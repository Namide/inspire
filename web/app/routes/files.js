const ObjectID = require('mongodb').ObjectID
const { downloadFile } = require('../helpers/files.js')

const BASE_URL = '/api/files'

module.exports.fileDisplay = async (ctx) => {
  const type = ctx.params.type
  const id = ctx.params.id
  const src = `${BASE_URL}/${type}/${id}`
  const author = ctx.state.user._id ? ObjectID(ctx.state.user._id) : '0'
  const visibilities = ctx.state.user.visibilities

  const item = await ctx.app.collections[type]
    .findOne({
      $and: [
        {
          $or: [
            { 'image.src': src },
            { 'file.src': src }
          ]
        }, {
          $or: [
            { author },
            {
              visibility: {
                $regex: new RegExp(`^(${visibilities.join('|')})$`)
              }
            }
          ]
        }
      ]
    })

  if (item) {
    await downloadFile(ctx, src)
  } else {
    ctx.throw(404, 'File not found')
  }
  // ctx.body = { groups }
  return ctx
}
