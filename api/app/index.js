const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')
const BodyParser = require('koa-bodyparser')
const logger = require('koa-logger')

const ObjectID = require('mongodb').ObjectID

const errorHandler = require('./middleware/errorHandler')
const auth = require('./middleware/auth')
const { uploaderGroup } = require('./middleware/upload')

const { ROLES } = require('./constants/permissions')

const { distant: distantRequest } = require('./routes/distant.js')

const {
  add: addUser,
  get: getUser,
  set: setUser,
  delete: deleteUser,
  list: getUsers,
  init: initUsers,
  signin
} = require('./routes/users.js')

const {
  list: getGroups,
  init: initGroups,
  add: addGroups,
  delete: deleteGroup,
  set: setGroup
} = require('./routes/groups.js')

const CONFIG = require('../config.json')

const app = new Koa()
const router = new Router()

// Security
// https://nodesource.com/blog/Express-Koa-Hapi
// http://polyglot.ninja/rest-api-koajs-mongodb-part-3/

app.use(errorHandler)
app.use(BodyParser())
app.use(logger())
app.use(Static('./public'))

// app.use(koaStatic('upload'))
// app.use(mount('/upload', a));
// app.use(mount('/world', b));

// Init database
require('./middleware/mongo.js')(app)
  .then(async db => {
    // db.command( { listCollections: 1 } )
    //   .then(data => console.log(data.cursor.firstBatch));
    console.log('DB connected')

    // Init tables
    app.users = await initUsers(db)
    app.groups = await initGroups(db)

    return true
  })
  .catch(error => console.log('DB connection error:', error.message))
require('./middleware/ratelimit.js')(app)

// --------------------------
//          USERS
// --------------------------
const testSameUser = async (ctx, id) => {
  const user = await ctx.app.users.findOne({ _id: ObjectID(ctx.params.id) })
  return user._id === id
}
router.get(
  '/users/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN], testSameUser),
  getUser
)
router.post(
  '/users/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN], testSameUser),
  setUser
)
router.delete(
  '/users/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN], testSameUser),
  deleteUser
)
router.get(
  '/users',
  auth([ROLES.ADMIN]),
  getUsers
)
router.post('/users', auth([ROLES.ADMIN]), addUser) // , uploaderGroup
router.post('/signin', signin)
// router.post('/signout', signout);

// --------------------------
//          GROUPS
// --------------------------
const testSameGroup = async (ctx, id) => {
  const group = await ctx.app.groups.findOne({ _id: ObjectID(ctx.params.id) })
  return group.author === id
}
router.get('/groups', auth(), getGroups)
router.post('/groups', auth([ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR]), uploaderGroup, addGroups)
router.post(
  '/groups/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN, ROLES.EDITOR], testSameGroup),
  uploaderGroup,
  setGroup
)
router.delete(
  '/groups/:id([0-9a-f]{24})',
  auth([ROLES.ADMIN, ROLES.EDITOR], testSameGroup),
  deleteGroup
)

// Test route
router.get('/', async (ctx) => {
  ctx.body = { message: 'Hello world!' }
})

// Distant URL
router.get('/distant/:url', distantRequest)

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(CONFIG.port)
