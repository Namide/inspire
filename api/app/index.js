
// --------------------------
//     KOA DEPENDENCIES
// --------------------------
const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')
const BodyParser = require('koa-bodyparser')
const logger = require('koa-logger')

// --------------------------
//        MIDDLEWARES
// --------------------------
const errorHandler = require('./middleware/errorHandler')
const auth = require('./middleware/auth')
const { uploaderGroup } = require('./middleware/upload')

// --------------------------
//          ROUTES
// --------------------------
const { distant: distantRequest } = require('./routes/distant.js')
const { userInit, userList, userAdd, userGet, userEdit, userDelete, signin } = require('./routes/users.js')
const { groupInit, groupList, groupAdd, groupDelete, groupEdit } = require('./routes/groups.js')

// --------------------------
//         CONSTANTS
// --------------------------
const { ROLES } = require('./constants/permissions')
const CONFIG = require('../config.json')

// --------------------------
//         HELPERS
// --------------------------
const ObjectID = require('mongodb').ObjectID

// --------------------------
//         INIT APP
// --------------------------
const app = new Koa()
const router = new Router()

app.use(errorHandler)
app.use(BodyParser())
app.use(logger())
app.use(Static('./public'))

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

    return true
  })
  .catch(error => console.log('DB connection error:', error.message))
require('./middleware/ratelimit.js')(app)

// --------------------------
//           BASE
// --------------------------
router.get('/', async (ctx) => {
  ctx.body = { message: 'Hello world!' }
})

// --------------------------
//         DISTANT
// --------------------------
router.get('/distant/:url', auth([ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR]), distantRequest)

// --------------------------
//           USERS
// --------------------------
const testSameUser = async (ctx, id) => {
  const user = await ctx.app.users.findOne({ _id: ObjectID(ctx.params.id) })
  return user._id === id
}
router.get(
  '/users/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN], testSameUser),
  userGet
)
router.post(
  '/users/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN], testSameUser),
  userEdit
)
router.delete(
  '/users/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN], testSameUser),
  userDelete
)
router.get(
  '/users',
  auth([ROLES.ADMIN]),
  userList
)
router.post('/users', auth([ROLES.ADMIN]), userAdd) // , uploaderGroup
router.post('/signin', signin)

// --------------------------
//          GROUPS
// --------------------------
const testSameGroup = async (ctx, id) => {
  const group = await ctx.app.groups.findOne({ _id: ObjectID(ctx.params.id) })
  return group.author === id
}
router.get('/groups', auth(), groupList)
router.post('/groups', auth([ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR]), uploaderGroup, groupAdd)
router.post(
  '/groups/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN, ROLES.EDITOR], testSameGroup),
  uploaderGroup,
  groupEdit
)
router.delete(
  '/groups/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN, ROLES.EDITOR], testSameGroup),
  groupDelete
)

// --------------------------
//           RUN
// --------------------------
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(CONFIG.port)
