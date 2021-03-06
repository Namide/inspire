const fs = require('fs')
const path = require('path')
const send = require('koa-send')

const BASE_URL = '/api/files'
const srcToFilePath = src => src.replace(BASE_URL, './upload')

module.exports.downloadFile = async (ctx, src) => {
  await send(ctx, srcToFilePath(src))
}

module.exports.removeFile = (src) => {
  fs.unlink(srcToFilePath(src), error => {
    if (error) console.log(error)
  })
}

module.exports.pathToSrc = (filePath) => {
  return filePath.split(path.sep).join('/').replace('upload', BASE_URL)
}

module.exports.removeReadableStreams = (...files) => {
  files.forEach(file => {
    // https://nodejs.org/api/stream.html#stream_class_stream_readable

    // Must listen data to listen end...
    file.on('data', () => 1)

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
