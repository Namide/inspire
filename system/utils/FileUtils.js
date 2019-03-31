const getExt = fileName => String(require('path').extname(fileName)).toLowerCase()
const extToMimeType = ext =>
{
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

    return MIME_TYPES[ext] || 'application/octet-stream'
}
const getMimeType = fileName => extToMimeType(getExt(fileName))
const gzipable = fileName => ['.html', '.json', '.css', '.js'].indexOf(getExt(fileName)) > -1
const isAsset = fileName => ['.html', '.css', '.js'].indexOf(getExt(fileName)) > -1
const isDynamic = fileName => ['.json'].indexOf(getExt(fileName)) > -1
const isImage = fileName => ['.jpg', '.jpeg', '.png', '.gif'].indexOf(getExt(fileName)) > -1
/* const addSubExt = (fileName, subExt) =>
{
    const { dir, name, ext } = require('path').parse(fileName)
    return dir + '/' + name + '-' + subExt + ext
}*/
const getFilenameAvailable = fileName =>
{
    const fs = require('fs')
    if (fs.existsSync(fileName))
    {
        const { dir, name, ext } = require('path').parse(fileName)
        let i = 1
        fileName = dir + '/' + name + '-' + i + ext
        while (fs.existsSync(fileName))
            fileName = dir + '/' + name + '-' + (++i) + ext
    }

    return fileName
}
const mkDirForFile = fileName =>
{
    const fs = require('fs')

    const tempPath = fileName.replace(/\/$/, '').split('/')
    tempPath.pop()

    for (let i = 1; i <= tempPath.length; i++)
    {
        const segment = tempPath.slice(0, i).join('/')
        if (!fs.existsSync(segment))
            fs.mkdirSync(segment)
    }
}

const mvFile = (oldFile, newFile) =>
{
    newFile = getFilenameAvailable(newFile)
    mkDirForFile(newFile)

    return new Promise((resolve, reject) =>
    {
        const fs = require('fs')

        fs.rename(oldFile, newFile, err =>
        {
            if (err)
            {
                fs.copyFile(oldFile, newFile, err =>
                {
                    if (err)
                        reject(err.message)
                    else
                    {
                        fs.unlink(oldFile, () => 1)
                        resolve(newFile)
                    }
                })
            }
            else
                resolve(newFile)
        })
    })
}

module.exports = { getExt, getFilenameAvailable, mkDirForFile, getMimeType, extToMimeType, gzipable, isAsset, isDynamic, mvFile, isImage }
