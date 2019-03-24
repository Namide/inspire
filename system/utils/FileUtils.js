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
const extToMimeType = ext => MIME_TYPES[ext] || 'application/octet-stream'
const gzipable = fileName => ['.html', '.json', '.css', '.js'].indexOf(getExt(fileName)) > -1
const isAsset = fileName => ['.html', '.css', '.js'].indexOf(getExt(fileName)) > -1
const isDynamic = fileName => ['.json'].indexOf(getExt(fileName)) > -1
const mvFile = (oldFile, newFile) =>
{
    const fs = require('fs')
    const mkdirSyncRecursive = file =>
    {
        const path = file.replace(/\/$/, '').split('/')
        path.pop()

        for (let i = 1; i <= path.length; i++)
        {
            const segment = path.slice(0, i).join('/')
            !fs.existsSync(segment) ? fs.mkdirSync(segment) : null
        }
    }

    if (fs.existsSync(newFile))
    {
        const path = require('path')
        const { dir, name, ext } = path.parse(newFile)
        let i = 1
        newFile = dir + '/' + name + '-' + i + ext
        while (fs.existsSync(newFile))
            newFile = dir + '/' + name + '-' + (++i) + ext
    }

    return new Promise((resolve, reject) =>
    {
        mkdirSyncRecursive(newFile)
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

module.exports = { getExt, getMimeType, extToMimeType, gzipable, isAsset, isDynamic, mvFile }
