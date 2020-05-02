const busboy = require('koa-busboy')
const CONFIG = require('../../config.json')

const getName = fileName => new Date().toISOString().replace(/[:]/g, '-').replace(/T(.)+Z/, '') + '_' + Math.round((Math.random() * 1e16)).toString(36) + '_' + fileName

module.exports.uploaderGroup = busboy({
  dest: './public/' + CONFIG.upload.dir.group,
  fnDestFilename: (_, filename) => getName(filename)
})

module.exports.uploaderItem = busboy({
  dest: './public/' + CONFIG.upload.dir.item,
  fnDestFilename: (_, filename) => getName(filename)
})
