const { router } = require('../helpers/core')
const auth = require('../middleware/auth')
const ObjectID = require('mongodb').ObjectID
const { VISIBILITY } = require('../constants/permissions')
const { TYPES } = require('../constants/items')
const IMAGE = require('../constants/image')
const { removeReadableStreams, removeFile, pathToSrc } = require('../helpers/files.js')
const { extractData } = require('../helpers/image.js')
const hooks = require('../event/hooks.js')
const checkDb = require('../middleware/checkDb')
const { uploaderItem } = require('../middleware/upload')
const { ROLES } = require('../constants/permissions')

// Initialize
hooks.onInitDb.addOnce(async (db, app) => {
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

  app.collections.items = items

  return items
})

const itemGet = async (ctx) => {
  const visibilities = ctx.state.user.visibilities
  const author = ObjectID(ctx.state.user._id)
  const id = ObjectID(ctx.params.id)

  const item = await ctx.app.collections.items
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

const itemList = async (ctx) => {
  const visibilities = ctx.state.user.visibilities
  const author = ObjectID(ctx.state.user._id)

  const items = await ctx.app.collections.items
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

const itemAdd = async (ctx) => {
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

    const insert = await ctx.app.collections.items
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

const itemEdit = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const item = ctx.state.field || await ctx.app.collections.items.findOne({ _id: ObjectID(ctx.params.id) })

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

    await ctx.app.collections.items.updateOne(documentQuery, { $set: payload })
    const itemReturned = await ctx.app.collections.items.findOne(documentQuery)
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

const itemDelete = async (ctx) => {
  const documentQuery = { _id: ObjectID(ctx.params.id) }
  const item = ctx.state.field || await ctx.app.collections.items.findOne({ _id: ObjectID(ctx.params.id) })

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

  await ctx.app.collections.items.deleteOne(documentQuery)

  ctx.body = {
    success: true,
    message: 'Item ' + ctx.params.id + ' deleted'
  }

  return ctx
}

const testSameItem = async (ctx, id) => {
  const item = await ctx.app.collections.items.findOne({ _id: ObjectID(ctx.params.id) })
  ctx.state.field = item
  return item.author.toString() === id
}

router.get('/api/items', checkDb, auth(), itemList)
router.get('/api/items/:id([0-9a-f]{24})', checkDb, auth(), itemGet)
router.post('/api/items', checkDb, auth([ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR]), uploaderItem, itemAdd)
router.post('/api/items/:id([0-9a-f]{24})', checkDb, auth([ROLES.ADMIN, ROLES.EDITOR], testSameItem), uploaderItem, itemEdit)
router.delete('/api/items/:id([0-9a-f]{24})', checkDb, auth([ROLES.ADMIN, ROLES.EDITOR], testSameItem), itemDelete)
