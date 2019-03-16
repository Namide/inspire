const path = require('path')

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml'
}

const getExt = fileName => String(path.extname(fileName)).toLowerCase()
const getMimeType = fileName => MIME_TYPES[getExt(fileName)] || 'application/octet-stream'
const gzipable = fileName => ['.html', '.json', '.css', '.js'].indexOf(getExt(fileName)) > -1
const isAsset = fileName => ['.html', '.css', '.js'].indexOf(getExt(fileName)) > -1
const isDynamic = fileName => ['.json'].indexOf(getExt(fileName)) > -1

module.exports = { getExt, getMimeType, gzipable, isAsset, isDynamic }
