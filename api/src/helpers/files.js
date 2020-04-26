const fs = require('fs');
const path = require('path');
const busboy = require('koa-busboy')
const CONFIG = require('../../config.json');

const getName = fileName => new Date().toISOString().replace(/[:]/g, '-').replace(/T(.)+Z/, '') + '_' + Math.round((Math.random() * 1e16)).toString(36) + '_' + fileName

module.exports.uploaderGroup = busboy({
  dest: './public/' + CONFIG.upload.dir.group,
  fnDestFilename: (_, filename) => getName(filename)
})

module.exports.uploaderThumb = busboy({
  dest: './public/' + CONFIG.upload.dir.thumb,
  fnDestFilename: (_, filename) => getName(filename)
})

module.exports.uploaderFile = busboy({
  dest: './public/' + CONFIG.upload.dir.file,
  fnDestFilename: (_, filename) => getName(filename)
})

module.exports.removeFile = (src) => {
  fs.unlink(path.resolve('./public' + src), error => {
    if (error) console.log(error)
  })
}

module.exports.pathToSrc = (filePath) => {
  return filePath.split(path.sep).join('/').replace('public', '')
}

module.exports.removeReadableStreams = (...files) => {
  files.forEach(file => {

    // https://nodejs.org/api/stream.html#stream_class_stream_readable 
    
    // Must listen data to listen end...
    file.on('data', () => 1);
    
    const onEnd = () => {
      fs.unlink(path.resolve(file.path), error => {
        if (error) console.log(error)
      })
    }

    if (file.closed) {
      onEnd()
    } else {
      file.on('end', onEnd)
    }
  })
}
