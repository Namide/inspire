const { router } = require('../helpers/core')
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const ObjectID = require('mongodb').ObjectID
const { ROLES } = require('../constants/permissions')
const hooks = require('../event/hooks.js')
const checkDb = require('../middleware/checkDb')
const { uploaderFileless } = require('../middleware/upload')
const { createSession } = require('../helpers/session')
const { removeCookie, getCookie } = require('../helpers/cookie')

// const RULES = {
//   name: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
//   password: /^(.){6,}$/,
//   role: new RegExp(`^(${Object.values(ROLES).join('|')})$`),
//   email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
// }

const displayUser = user => {
  delete user.password
  return user
}

// hooks.initDb.addOnce((db) => {

// })

// Initialize
hooks.onInitDb.addOnce(async (db, app) => {
  const documentShema = {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'password', 'role', 'email'],
        properties: {
          name: {
            bsonType: 'string',
            description: 'Can only contain alpha numeric caracters and "_" or "."',
            pattern: '^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'
          },
          password: {
            bsonType: 'string'
          },
          role: {
            enum: Object.values(ROLES),
            description: 'Can only be ' + Object.values(ROLES).join(', ') + ' and is required'
          },
          email: {
            bsonType: 'string',
            description: 'Must be a valid email',
            pattern: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
          }
        }
      }
      // $or: [
      //   { name: { $regex: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/ } },
      //   { email: { $regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ } }
      // ]
    }
  }

  await hooks.editUsersDocumentShema.dispatch(documentShema)

  const users = await db.createCollection('users', documentShema)

  app.collections.users = users

  users.createIndex({ email: 1 }, { unique: true })
  users.createIndex({ name: 1 }, { unique: true })

  return users
})

const signout = async (ctx) => {
  if (ctx.state.user && ctx.app.collections && ctx.app.collections.users) {
    const documentQuery = { _id: ObjectID(ctx.state.user._id) }
    console.log(documentQuery)
    const cookie = getCookie(ctx)
    console.log(cookie)
    await ctx.app.collections.users.updateOne(documentQuery, { $pull: { sessions: { cookie: ObjectID(cookie) } } })
  }

  removeCookie(ctx)

  ctx.body = {
    success: true,
    message: 'Signout'
  }

  return ctx
}

const signin = async (ctx) => {
  const { email, password } = ctx.request.body
  const user = await ctx.app.collections.users.findOne({ email })

  if (user && bcrypt.compareSync(password, user.password)) {
    const session = createSession(ctx)
    const documentQuery = { _id: ObjectID(user._id) }
    await ctx.app.collections.users.updateOne(documentQuery, { $pull: { sessions: { expires: { $lte: new Date() } } } })
    await ctx.app.collections.users.updateOne(documentQuery, { $push: { sessions: session } })

    ctx.body = {
      user: displayUser(user)
    }
  } else {
    ctx.status = ctx.status = 401
    ctx.body = {
      error: true,
      message: 'Authentication failed'
    }
  }

  return ctx
}

const userMe = async (ctx) => {
  if (ctx.state.user) {
    ctx.body = {
      user: displayUser(ctx.state.user)
    }
  } else {
    ctx.status = 404
    ctx.body = {
      error: true,
      message: 'User not found'
    }
  }

  return ctx
}

const userGet = async (ctx) => {
  let user = ctx.state.field
  if (!user) {
    user = await ctx.app.collections.users.findOne({ _id: ObjectID(ctx.params.id) })
  }

  if (user) {
    ctx.body = {
      user: displayUser(user)
    }
  } else {
    ctx.status = 404
    ctx.body = {
      error: true,
      message: 'User not found'
    }
  }

  return ctx
}

const userEdit = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const values = ctx.request.body

  if (values.password) {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(values.password, salt)
    values.password = hash
  }

  await ctx.app.collections.users.updateOne(documentQuery, { $set: values })

  const user = await ctx.app.collections.users.findOne(documentQuery)
  ctx.body = {
    user: displayUser(user)
  }

  return ctx
}

const userDelete = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  await ctx.app.collections.users.deleteOne(documentQuery)

  ctx.body = {
    success: true,
    message: 'User ' + ctx.params.id + ' deleted'
  }

  return ctx
}

const userList = async (ctx) => {
  const list = await ctx.app.collections.users
    .find({})
    .toArray()

  ctx.body = { users: list.map(displayUser) }
  return ctx
}

const add = async ctx => {
  const { name, password, role, email } = ctx.request.body
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(password || '', salt)
  console.log({ name, password: hash, role, email })
  const insert = await ctx.app.collections.users
    .insertOne({ name, password: hash, role, email })
  const user = insert.ops[0]
  return displayUser(user)
}

const userAdd = async (ctx) => {
  try {
    const user = await add(ctx)
    ctx.body = {
      user
    }
  } catch (error) {
    ctx.body = {
      error: true,
      code: error.code,
      message: error.message
    }
  }

  return ctx
}

const testSameUser = async (ctx, id) => {
  const user = await ctx.app.collections.users.findOne({ _id: ObjectID(ctx.params.id) })
  if (user) {
    ctx.state.field = user
    return user._id.toString() === id
  }
  return false
}

router.get('/api/users', checkDb, auth([ROLES.ADMIN]), userList)
router.get('/api/users/:id([0-9a-f]{24})', checkDb, auth([ROLES.ADMIN], testSameUser), userGet)
router.post('/api/users', checkDb, auth([ROLES.ADMIN]), uploaderFileless, userAdd)
router.post('/api/users/:id([0-9a-f]{24})', checkDb, auth([ROLES.ADMIN], testSameUser), uploaderFileless, userEdit)
router.get('/api/users/me', checkDb, auth([ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR, ROLES.SUBSCRIBER], testSameUser), userMe)
router.post('/api/signin', checkDb, uploaderFileless, signin)
router.post('/api/signout', checkDb, auth(), uploaderFileless, signout)
router.delete('/api/users/:id([0-9a-f]{24})', checkDb, auth([ROLES.ADMIN], testSameUser), userDelete)

exports.add = add
