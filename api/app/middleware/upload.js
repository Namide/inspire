const busboy = require('koa-busboy')
const { removeReadableStreams } = require('../helpers/files.js')

const getName = fileName => new Date().toISOString().replace(/[:]/g, '-').replace(/T(.)+Z/, '') + '_' + Math.round((Math.random() * 1e16)).toString(36) + '_' + fileName

module.exports.uploaderGroup = busboy({
  dest: './upload/groups',
  fnDestFilename: (_, filename) => getName(filename)
})

module.exports.uploaderItem = busboy({
  dest: './upload/items',
  fnDestFilename: (_, filename) => getName(filename)
})

module.exports.uploaderFileless = async (ctx, next) => {
  const middleware = busboy()
  await middleware(ctx, next)
  if (ctx.request.files) {
    removeReadableStreams(...(ctx.request.files))
  }
}
