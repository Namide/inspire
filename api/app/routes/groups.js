const ObjectID = require('mongodb').ObjectID
const { ROLES, VISIBILITY } = require('../constants/permissions')
const { removeReadableStreams, removeFile, pathToSrc } = require('../helpers/files.js')
const { testAuthorized } = require('../middleware/auth.js')

// const RULES = {
//   visibility: new RegExp(`^(${ Object.values(VISIBILITY).join('|') })$`),
//   order: /^[0-9]+$/,
//   author: /^[0-9a-f]+$/,
//   title: isText,
//   image: isJSON,
//   description: isText,
//   filter: isText
// }

module.exports.groupInit = async (db) => {
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

module.exports.groupList = async (ctx) => {
  const visibilities = ctx.state.user.visibilities
  const author = ObjectID(ctx.state.user._id)

  const groups = await ctx.app.groups
    .find({
      $or: [
        { author },
        {
          visibility: {
            $regex: new RegExp(`^(${visibilities.join('|')})$`)
          }
        }
      ]
    })
    .toArray()

  ctx.body = { groups }
  return ctx
}

module.exports.groupAdd = async (ctx) => {
  const values = ctx.request.body

  try {
    const payload = Object.assign(values, { author: ObjectID(ctx.state.user._id) })
    payload.order = Number(payload.order)
    payload.filter = payload.filter.split(',')

    const file = ctx.request.files && ctx.request.files.find(({ fieldname }) => fieldname === 'imageFile')
    if (file) {
      payload.image = JSON.parse(payload.image)
      payload.image.src = pathToSrc(file.path)
      payload.image.mimetype = file.mimetype
    } else {
      delete payload.image
    }

    // Remove other images
    removeReadableStreams(...ctx.request.files.filter(({ fieldname }) => fieldname !== 'imageFile'))

    const insert = await ctx.app.groups
      .insertOne(payload)
    const groups = [insert.ops[0]]
    ctx.body = { groups }
  } catch (error) {
    // Remove images
    removeReadableStreams(...ctx.request.files)
    ctx.body = {
      success: false,
      message: error.message
    }
  }

  return ctx
}

module.exports.groupEdit = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const group = await ctx.app.groups.findOne(documentQuery)
  const payload = ctx.request.body

  if (!group) {
    ctx.throw(404, 'Group not found')
    return ctx
  }

  if (!testAuthorized(group.author, [ROLES.ADMIN, ROLES.EDITOR])) {
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

    const file = ctx.request.files && ctx.request.files.find(({ fieldname }) => fieldname === 'imageFile')
    if (file) {
      payload.image = JSON.parse(payload.image)
      payload.image.src = pathToSrc(file.path)
      payload.image.mimetype = file.mimetype

      if (group.image) {
        removeFile(group.image.src)
      }
    } else {
      delete payload.image
    }

    // Remove other images
    removeReadableStreams(...ctx.request.files.filter(({ fieldname }) => fieldname !== 'imageFile'))

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

module.exports.groupDelete = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const group = await ctx.app.groups.findOne(documentQuery)

  if (!group) {
    ctx.throw(404, 'Group not found')
    return ctx
  }

  if (!testAuthorized(group.author, [ROLES.ADMIN, ROLES.EDITOR])) {
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
