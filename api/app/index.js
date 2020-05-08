
// --------------------------
//     KOA DEPENDENCIES
// --------------------------
const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')
const BodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const compress = require('koa-compress')

// --------------------------
//        MIDDLEWARES
// --------------------------
const errorHandler = require('./middleware/errorHandler')
const auth = require('./middleware/auth')
const { uploaderGroup, uploaderItem, uploaderFileless } = require('./middleware/upload')

// --------------------------
//          ROUTES
// --------------------------
const { distant: distantRequest } = require('./routes/distant.js')
const { userInit, userList, userAdd, userGet, userEdit, userDelete, signin } = require('./routes/users.js')
const { groupInit, groupList, groupAdd, groupDelete, groupEdit } = require('./routes/groups.js')
const { itemInit, itemList, itemAdd, itemDelete, itemEdit } = require('./routes/items.js')
const { fileDisplay } = require('./routes/files.js')

// --------------------------
//         CONSTANTS
// --------------------------
const { ROLES } = require('./constants/permissions')
const CONFIG = require('../config.json')

// --------------------------
//         HELPERS
// --------------------------
const ObjectID = require('mongodb').ObjectID
const zlib = require('zlib')

// --------------------------
//         INIT APP
// --------------------------
const app = new Koa()
const router = new Router()

app.use(errorHandler)
app.use(BodyParser())
app.use(logger())
app.use(compress({
  // filter (content_type) {
  //   return /text/i.test(content_type)
  // },
  threshold: 2048,
  gzip: { flush: zlib.Z_SYNC_FLUSH },
  deflate: { flush: zlib.Z_SYNC_FLUSH },
  br: false // disable brotli
}))
app.use(Static('./public'))
// app.use(async (ctx, next) => {
//   if (ctx.request.url === '/test') {
//     ctx.serve()
//   } else {
//     await next()
//   }
// })

// Security
// https://nodesource.com/blog/Express-Koa-Hapi
// http://polyglot.ninja/rest-api-koajs-mongodb-part-3/

// --------------------------
//         DATABASE
// --------------------------
require('./middleware/mongo.js')(app)
  .then(async db => {
    // db.command( { listCollections: 1 } )
    //   .then(data => console.log(data.cursor.firstBatch));
    console.log('DB connected')

    // Init tables
    app.users = await userInit(db)
    app.groups = await groupInit(db)
    app.items = await itemInit(db)

    return true
  })
  .catch(error => console.log('DB connection error:', error.message))
require('./middleware/ratelimit.js')(app)

// --------------------------
//           BASE
// --------------------------
router.get('/api', async (ctx) => {
  const { version } = require('../package.json')
  const userCount = await ctx.app.users.countDocuments()

  const payload = {
    version,
    date: Date.now()
  }

  if (userCount < 1) {
    payload.needUser = true
    payload.message = 'Add a user to finalise install'
  }

  ctx.body = payload
})

// --------------------------
//         DISTANT
// --------------------------
router.get('/api/distant/:url', auth([ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR]), distantRequest)

// --------------------------
//           USERS
// --------------------------
const testSameUser = async (ctx, id) => {
  const user = await ctx.app.users.findOne({ _id: ObjectID(ctx.params.id) })
  ctx.state.field = user
  return user._id.toString() === id
}
// Authorize admin creation if 0 user in collection
const testInstall = async (ctx, id) => {
  const count = await ctx.app.users.countDocuments()
  if (count < 1) {
    ctx.request.body.role = ROLES.ADMIN
  }
  return count < 1
}
router.get('/api/users', auth([ROLES.ADMIN]), userList)
router.get('/api/users/:id([0-9a-f]{24})', auth([ROLES.ADMIN], testSameUser), userGet)
router.post('/api/users', auth([ROLES.ADMIN], testInstall), uploaderFileless, userAdd)
router.post('/api/users/:id([0-9a-f]{24})', auth([ROLES.ADMIN], testSameUser), uploaderFileless, userEdit)
router.post('/api/signin', uploaderFileless, signin)
router.delete('/api/users/:id([0-9a-f]{24})', auth([ROLES.ADMIN], testSameUser), userDelete)

// --------------------------
//           GROUPS
// --------------------------
const testSameGroup = async (ctx, id) => {
  const group = await ctx.app.groups.findOne({ _id: ObjectID(ctx.params.id) })
  ctx.state.field = group
  return group.author.toString() === id
}
router.get('/api/groups', auth(), groupList)
router.post('/api/groups', auth([ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR]), uploaderGroup, groupAdd)
router.post('/api/groups/:id([0-9a-f]{24})', auth([ROLES.ADMIN, ROLES.EDITOR], testSameGroup), uploaderGroup, groupEdit)
router.delete('/api/groups/:id([0-9a-f]{24})', auth([ROLES.ADMIN, ROLES.EDITOR], testSameGroup), groupDelete)

// --------------------------
//            ITEMS
// --------------------------
const testSameItem = async (ctx, id) => {
  const item = await ctx.app.items.findOne({ _id: ObjectID(ctx.params.id) })
  ctx.state.field = item
  return item.author.toString() === id
}
router.get('/api/items', auth(), itemList)
router.post('/api/items', auth([ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR]), uploaderItem, itemAdd)
router.post('/api/items/:id([0-9a-f]{24})', auth([ROLES.ADMIN, ROLES.EDITOR], testSameItem), uploaderItem, itemEdit)
router.delete('/api/items/:id([0-9a-f]{24})', auth([ROLES.ADMIN, ROLES.EDITOR], testSameItem), itemDelete)

// --------------------------
//          FILES
// --------------------------
router.get('/api/files/:type(groups|users|items)/:id', auth(), fileDisplay)

// --------------------------
//           RUN
// --------------------------
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(CONFIG.port)
