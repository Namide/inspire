const ObjectID = require('mongodb').ObjectID
const { VISIBILITY } = require('../constants/permissions')
const IMAGE = require('../constants/image')
const { removeReadableStreams, removeFile, pathToSrc } = require('../helpers/files.js')
const hooks = require('../event/hooks.js')

// Initialize
hooks.onInitDb.addOnce(async (db, app) => {
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
          image: IMAGE.VALIDATOR,
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

  app.collections.groups = groups;

  return groups
})

module.exports.groupList = async (ctx) => {
  const visibilities = ctx.state.user.visibilities
  const author = ObjectID(ctx.state.user._id)

  const groups = await ctx.app.collections.groups
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

    const file = ctx.request.files && ctx.request.files.find(({ fieldname }) => fieldname === 'image')
    if (file) {
      payload.image = JSON.parse(payload.image)
      payload.image.src = pathToSrc(file.path)
    } else {
      delete payload.image
    }

    // Remove other images
    if (ctx.request.files) {
      removeReadableStreams(...ctx.request.files.filter(({ fieldname }) => fieldname !== 'image'))
    }

    const insert = await ctx.app.collections.groups
      .insertOne(payload)
    const groups = [insert.ops[0]]
    ctx.body = { groups }
  } catch (error) {
    // Remove images
    if (ctx.request.files) {
      removeReadableStreams(...ctx.request.files)
    }

    ctx.body = {
      error: true,
      message: error.message
    }
  }

  return ctx
}

module.exports.groupEdit = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const group = ctx.state.field
  const payload = ctx.request.body

  if (!group) {
    ctx.throw(404, 'Group not found')
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

    const file = ctx.request.files && ctx.request.files.find(({ fieldname }) => fieldname === 'image')
    if (file) {
      if (group.image) {
        removeFile(group.image.src)
      }

      payload.image = JSON.parse(payload.image)
      payload.image.src = pathToSrc(file.path)
    } else {
      delete payload.image
    }

    // Remove other images
    if (ctx.request.files) {
      removeReadableStreams(...ctx.request.files.filter(({ fieldname }) => fieldname !== 'image'))
    }

    await ctx.app.collections.groups.updateOne(documentQuery, { $set: payload })
    const groupReturned = await ctx.app.collections.groups.findOne(documentQuery)
    ctx.body = { groups: [groupReturned] }
  } catch (error) {
    if (ctx.request.files) {
      removeReadableStreams(...ctx.request.files)
    }

    ctx.body = {
      error: true,
      message: error.message
    }
  }

  return ctx
}

module.exports.groupDelete = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const group = ctx.state.field

  if (!group) {
    ctx.throw(404, 'Group not found')
    return ctx
  }

  if (group.image) {
    removeFile(group.image.src)
  }

  await ctx.app.collections.groups.deleteOne(documentQuery)

  ctx.body = {
    success: true,
    message: 'Group ' + ctx.params.id + ' deleted'
  }

  return ctx
}
