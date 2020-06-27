const ObjectID = require('mongodb').ObjectID
const { VISIBILITY } = require('../constants/permissions')
const { TYPES } = require('../constants/items')
const IMAGE = require('../constants/image')
const { removeReadableStreams, removeFile, pathToSrc } = require('../helpers/files.js')
const { extractData } = require('../helpers/image.js')

module.exports.itemInit = async (db) => {
  const items = await db.createCollection('items', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['visibility', 'types', 'title', 'author'],
        properties: {
          visibility: { enum: Object.values(VISIBILITY) },
          author: { bsonType: 'objectId' },
          title: { bsonType: 'string' },
          description: { bsonType: 'string' },
          types: {
            bsonType: 'array',
            minItems: 1,
            items: {
              enum: Object.values(TYPES)
            }
          },
          tags: {
            bsonType: 'array',
            items: {
              bsonType: 'string'
            }
          },
          image: IMAGE.VALIDATOR,
          file: {
            bsonType: 'object',
            required: ['src'],
            properties: {
              src: {
                bsonType: 'string'
              },
              type: {
                bsonType: 'string'
              }
            }
          },
          input: { bsonType: 'string' },
          score: {
            bsonType: 'number',
            minimum: 0,
            maximum: 5
          },
          content: { bsonType: 'string' },
          createdAt: { bsonType: 'date' }
        }
      }
    }
  })

  return items
}

module.exports.itemGet = async (ctx) => {

  const visibilities = ctx.state.user.visibilities
  const author = ObjectID(ctx.state.user._id)
  const id = ObjectID(ctx.params.id)

  const item = await ctx.app.items
    .findOne({
      $or: [
        { _id: id, author },
        {
          _id: id,
          visibility: {
            $regex: new RegExp(`^(${visibilities.join('|')})$`)
          }
        }
      ]
    })

  ctx.body = { item }
  return ctx
}

module.exports.itemList = async (ctx) => {
  const visibilities = ctx.state.user.visibilities
  const author = ObjectID(ctx.state.user._id)

  const items = await ctx.app.items
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

  ctx.body = { items }
  return ctx
}

module.exports.itemAdd = async (ctx) => {
  // const values = ctx.request.body

  try {
    const item = Object.assign(JSON.parse(ctx.request.body.item), { author: ObjectID(ctx.state.user._id) })
    
    if (item.createdAt) {
      item.createdAt = new Date(item.createdAt)
    } else {
      item.createdAt = new Date()
    }

    const image = ctx.request.files && ctx.request.files.find(({ fieldname }) => fieldname === 'image')
    if (image) {
      const properties = await extractData(image)
      item.image = properties
    } else {
      delete item.image
    }

    const file = ctx.request.files && ctx.request.files.find(({ fieldname }) => fieldname === 'file')
    if (file) {
      const properties = await extractData(file)
      item.file = properties
      item.file.src = pathToSrc(file.path)
    } else {
      delete item.file
    }

    // Remove other images
    removeReadableStreams(...ctx.request.files.filter(({ fieldname }) => fieldname !== 'image' && fieldname !== 'file'))

    const insert = await ctx.app.items
      .insertOne(item)
      
    ctx.body = { item: insert.ops[0] }
  } catch (error) {
    // Remove images
    removeReadableStreams(...ctx.request.files)
    ctx.body = {
      error: true,
      message: error.message
    }
  }

  return ctx
}

module.exports.itemEdit = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const item = ctx.state.field || await ctx.app.items.findOne({ _id: ObjectID(ctx.params.id) })
  
  if (!item) {
    ctx.throw(404, 'Item not found')
    return ctx
  }
  
  try {
    const payload = JSON.parse(ctx.request.body.item)

    delete payload.author

    const image = ctx.request.files && ctx.request.files.find(({ fieldname }) => fieldname === 'image')
    if (image) {
      if (item.image) {
        removeFile(item.image.src)
      }

      const properties = await extractData(image)
      payload.image = properties
      payload.image.src = pathToSrc(image.path)
    } else {
      delete payload.image
    }

    const file = ctx.request.files && ctx.request.files.find(({ fieldname }) => fieldname === 'file')
    if (file) {
      if (item.file) {
        removeFile(item.file.src)
      }

      const properties = await extractData(file)
      payload.file = properties
      payload.file.src = pathToSrc(file.path)
    } else {
      delete payload.file
    }

    // Remove other images
    removeReadableStreams(...ctx.request.files.filter(({ fieldname }) => fieldname !== 'image' && fieldname !== 'file'))
console.log(documentQuery, { $set: payload })
    await ctx.app.items.updateOne(documentQuery, { $set: payload })
    const itemReturned = await ctx.app.items.findOne(documentQuery)
    ctx.body = { item: itemReturned }
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

module.exports.itemDelete = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const item = ctx.state.field || await ctx.app.items.findOne({ _id: ObjectID(ctx.params.id) })

  if (!item) {
    ctx.throw(404, 'Item not found')
    return ctx
  }

  if (item.image) {
    removeFile(item.image.src)
  }

  if (item.file) {
    removeFile(item.file.src)
  }

  await ctx.app.items.deleteOne(documentQuery)

  ctx.body = {
    success: true,
    message: 'Item ' + ctx.params.id + ' deleted'
  }

  return ctx
}
