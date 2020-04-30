const { getToken } = require('../helpers/token.js')
// const required = require('../helpers/required.js');
const ObjectID = require('mongodb').ObjectID
const { ROLES, VISIBILITY, roleToVisibility } = require('../constants/permissions')
const { removeReadableStreams, removeFile, pathToSrc } = require('../helpers/files.js')

// const isText = () => {
//   return true;
// }

// const isJSON = (string) => {
//   try {
//     JSON.parse(string);
//   } catch (error) {
//     return false;
//   }

//   return true;
// }

// const RULES = {
//   visibility: new RegExp(`^(${ Object.values(VISIBILITY).join('|') })$`),
//   order: /^[0-9]+$/,
//   author: /^[0-9a-f]+$/,
//   title: isText,
//   image: isJSON,
//   description: isText,
//   filter: isText
// }

module.exports.init = async (db) => {
  const groups = await db.createCollection('groups', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['visibility', 'order', 'title', 'author', 'filter'],
        properties: {
          visibility: {
            enum: Object.values(VISIBILITY),
            description: 'Can only be ' + Object.values(VISIBILITY).join(', ') + ' and is required'
          },
          order: {
            bsonType: 'int'
          },
          author: {
            bsonType: 'objectId'
          },
          title: {
            bsonType: 'string'
          },
          description: {
            bsonType: 'string'
          },
          image: {
            bsonType: 'object',
            required: ['width', 'height', 'src'],
            properties: {
              width: {
                bsonType: 'int',
                description: 'must be a string if the field exists'
              },
              height: {
                bsonType: 'int',
                description: 'must be a string if the field exists'
              },
              src: {
                bsonType: 'string'
              }
            }
          },
          filter: {
            bsonType: 'array',
            minItems: 1,
            items: {
              bsonType: 'string'
            }
          }
        }
      }
      // $or: [
      //   { name: { $regex: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/ } },
      //   { email: { $regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ } }
      // ]
    }
  })

  // const groups = db.collection('groups');
  // groups.createIndex({ 'filter': 1 }, { unique: true });
  return groups
}

module.exports.list = async (ctx) => {
  const token = getToken(ctx)
  const role = token ? token.user.role : ROLES.GUEST
  const visibility = roleToVisibility(role)
  const author = token ? token.user._id : '0'

  const groups = await ctx.app.groups
    .find({
      $or: [
        { author },
        {
          visibility: {
            $regex: new RegExp(`^(${visibility.join('|')})$`)
          }
        }
      ]
    })
    .toArray()

  ctx.body = { groups }
  return ctx
}

// module.exports.get = async (ctx) => {
//   const user = await ctx.app.users.findOne({'_id': ObjectID(ctx.params.id)});

//   if (user) {
//     ctx.body = displayUser(user);
//   } else {
//     ctx.status = 404;
//     ctx.body = {
//       success: false,
//       message: 'User not found'
//     };
//   }

//   return ctx;
// }

module.exports.add = async (ctx) => {
  const token = getToken(ctx, { isNeeded: true, roles: [ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR] })

  if (!token) {
    return ctx
  }

  const values = ctx.request.body

  // for (const label of values) {
  //   if (!RULES[label]) {
  //     return ctx.throw(401, label + ' undesired');
  //   }
  //   required(ctx, { [label]: RULES[label] })
  // }

  try {
    const payload = Object.assign(values, { author: ObjectID(token.user._id) })
    payload.order = Number(payload.order)
    payload.filter = payload.filter.split(',')

    if (ctx.request.files && ctx.request.files[0]) {
      payload.image = JSON.parse(payload.image)
      payload.image.src = pathToSrc(ctx.request.files[0].path)
      payload.image.mimetype = ctx.request.files[0].mimetype
    } else {
      delete payload.image
    }

    const insert = await ctx.app.groups
      .insertOne(payload)
    const groups = [insert.ops[0]]
    ctx.body = { groups }
  } catch (error) {
    removeReadableStreams(...ctx.request.files)
    ctx.body = {
      success: false,
      message: error.message
    }
  }

  return ctx
}

module.exports.set = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const group = await ctx.app.groups.findOne(documentQuery)
  const payload = ctx.request.body

  if (!group) {
    ctx.status = 404
    ctx.body = {
      success: false,
      message: 'Group not found'
    }

    return ctx
  }

  const token = getToken(ctx, { isNeeded: true, roles: [ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR], author: group.author.toString() })
  if (!token) {
    return ctx
  }

  try {
    delete payload.author
    if (payload.order) {
      payload.order = Number(payload.order)
    }

    if (payload.filter) {
      payload.filter = payload.filter.split(',')
    }

    if (ctx.request.files && ctx.request.files[0]) {
      payload.image = JSON.parse(payload.image)
      payload.image.src = pathToSrc(ctx.request.files[0].path)
      payload.image.mimetype = ctx.request.files[0].mimetype

      if (group.image) {
        removeFile(group.image.src)
      }
    } else {
      delete payload.image
    }

    await ctx.app.groups.updateOne(documentQuery, { $set: payload })
    const groupReturned = await ctx.app.groups.findOne(documentQuery)
    ctx.body = { groups: [groupReturned] }
  } catch (error) {
    if (ctx.request.files) {
      removeReadableStreams(...ctx.request.files)
    }

    ctx.body = {
      success: false,
      message: error.message
    }
  }

  return ctx
}

module.exports.delete = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const group = await ctx.app.groups.findOne(documentQuery)

  if (!group) {
    ctx.status = 404
    ctx.body = {
      success: false,
      message: 'Group not found'
    }

    return ctx
  }

  if (group.image) {
    removeFile(group.image.src)
  }

  await ctx.app.groups.deleteOne(documentQuery)

  ctx.body = {
    success: true,
    message: 'Group ' + ctx.params.id + ' deleted'
  }

  return ctx
}
