const { getToken, setToken, blacklistToken } = require('../helpers/token.js')
const bcrypt = require('bcryptjs')
const ObjectID = require('mongodb').ObjectID
const { ROLES } = require('../constants/permissions')

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

module.exports.userInit = async (db) => {
  const users = await db.createCollection('users', {
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
          // address: {
          //   bsonType: 'object',
          //   required: ['city'],
          //   properties: {
          //     street: {
          //       bsonType: 'string',
          //       description: 'must be a string if the field exists'
          //     },
          //     city: {
          //       bsonType: 'string',
          //       'description': 'must be a string and is required'
          //     }
          //   }
          // }
        }
      }
      // $or: [
      //   { name: { $regex: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/ } },
      //   { email: { $regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ } }
      // ]
    }
  })

  // const users = db.collection('users');

  users.createIndex({ email: 1 }, { unique: true })
  users.createIndex({ name: 1 }, { unique: true })
  return users
}

module.exports.signout = async (ctx) => {
  blacklistToken(ctx)
  ctx.body = {
    success: true,
    message: 'Signout'
  }

  return ctx
}

module.exports.signin = async (ctx) => {
  const { email, password } = ctx.request.body
  const user = await ctx.app.users.findOne({ email })

  if (user && bcrypt.compareSync(password, user.password)) {
    ctx.body = {
      user: displayUser(user),
      token: setToken(ctx, user)
    }
  } else {
    ctx.status = ctx.status = 401
    ctx.body = {
      success: false,
      message: 'Authentication failed'
    }
  }

  return ctx
}

module.exports.userMe = async (ctx) => {
  const token = getToken(ctx)

  if (token) {
    const user = await ctx.app.users.findOne({ _id: ObjectID(token.user._id) })

    if (user) {
      ctx.body = {
        user: displayUser(user)
      }
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'User not found'
      }
    }
  } else {
    ctx.status = 404
    ctx.body = {
      success: false,
      message: 'User not found'
    }
  }

  return ctx
}

module.exports.userGet = async (ctx) => {
  const token = getToken(ctx)

  if (token) {
    if (token.user.role !== ROLES.ADMIN &&
      token.user._id !== ctx.params.id) {
      return ctx.throw(401, 'Unauthorized')
    }

    const user = await ctx.app.users.findOne({ _id: ObjectID(ctx.params.id) })

    if (user) {
      ctx.body = {
        user: displayUser(user)
      }
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        message: 'User not found'
      }
    }
  }

  return ctx
}

module.exports.userEdit = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const values = ctx.request.body

  if (values.password) {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(values.password, salt)
    values.password = hash
  }

  await ctx.app.users.updateOne(documentQuery, { $set: values })

  const user = await ctx.app.users.findOne(documentQuery)
  ctx.body = {
    user: displayUser(user)
  }

  return ctx
}

module.exports.userDelete = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  await ctx.app.users.deleteOne(documentQuery)

  ctx.body = {
    success: true,
    message: 'User ' + ctx.params.id + ' deleted'
  }

  return ctx
}

module.exports.userList = async (ctx) => {
  const token = getToken(ctx)
  if (token) {
    if (token.user.role !== ROLES.ADMIN) {
      return ctx.throw(401, 'Unauthorized')
    }

    const list = await ctx.app.users
      .find({})
      .toArray()

    ctx.body = { users: list.map(displayUser) }
    return ctx
  }
}

module.exports.userAdd = async (ctx) => {
  const { name, password, role, email } = ctx.request.body
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(password || '', salt)

  try {
    const insert = await ctx.app.users
      .insertOne({ name, password: hash, role, email })
    const user = insert.ops[0]
    ctx.body = {
      user: displayUser(user)
    }
  } catch (error) {
    ctx.body = {
      success: false,
      code: error.code,
      message: error.message
    }
  }

  return ctx
}
