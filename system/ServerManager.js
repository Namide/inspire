const http = require('http')
const Signal = require('./utils/Signal')
const { getExt, getMimeType, extToMimeType, gzipable, isAsset, isDynamic } = require('./utils/FileUtils')
const fs = require('fs')

class Server
{
    constructor(request, response)
    {
        this.request = request
        this.response = response
        this.head = {
            'Content-Type': getMimeType(this.getPath())
        }
    }

    getPath() { return this.request.url }

    getForm()
    {
        return new Promise((resolve, reject)=>
        {
            const Formidable = require('formidable')
            const form = new Formidable.IncomingForm()
            form.on('end', (...data) =>
            {
                console.log('--')
                console.log(data)
                console.log('--')
            })
            form.parse(this.request, (err, fields, files) =>
            {
                // console.log('==')
                // console.log('==>', err.message)
                // console.log('==')
                if (err)
                    reject(err.message)
                else
                {
                    // const util = require('util')
                    resolve({ fields, files }) // util.inspect({ fields, files }))
                }
            })
        })
    }

    setContentType(ext)
    {
        this.head['Content-Type'] = extToMimeType(ext)
    }

    serveFile(file)
    {
        if (fs.existsSync(file))
        {
            fs.readFile(file, (error, content) =>
            {
                if (!error)
                    this.serveStr(content)
                else 
                    this.serveError('Can not serve file: ' + error.code)
            })
        }
        else
        {
            this.serveError('Page not found')
        }
    }

    serveError(message)
    {
        this.setContentType('.html')
        this.response.writeHead(404, this.head)
        // this.response.writeHead(500, this.head)
        // this.response.write(message)
        this.response.end(message)
    }

    serveStr(str, duration = 0)
    {
        this.response.writeHead(200, this.head)
        this.response.end(str)

        /*if (gzipable(url))
        {
            const gzip = this.gzipData(content)

            if (CACHE_ENABLE)
            {
                saveCacheFile(url, gzip)
                if (duration > 0)
                    setTimeout(rmCacheFile, duration, url)
            }

            this.serveGZIP(response, gzip, url)
        }
        else
        {
            this.serveGZIP(response, content, url)
        }*/
    }
}

module.exports = class ServerManager
{
    constructor(port)
    {
        this.port = port
        this.onServer = new Signal()

        this.init(port)

        console.log('Server running at http://127.0.0.1:' + port + '/')
    }

    serveFile(file)
    {
        if (fs.existsSync(file))
        {
            fs.readFile(file, (error, content) =>
            {
                if (!error)
                {
                    this.serveData(response, content, file)
                }
                else 
                {
                    this.serveError(response, 'Can not serve file: ' + error.code)
                }
            })
        }
        else
        {   
            server.serveError('Page not found ')
        }
    }

    gzipData(content)
    {
        const buffer = Buffer.from(content, 'utf-8')
        return zlib.gzipSync(buffer)
    }

    serveGZIP(response, gzip, file)
    {
        const head = {
            'Content-Type': getMimeType(file),
            'Content-Encoding': 'gzip'
        }

        response.writeHead(200, head)
        response.end(gzip)
    }

    serveRaw(response, raw, file)
    {
        const head = { 'Content-Type': getMimeType(file) }
        response.writeHead(200, head)
        response.end(raw)
    }

    serveError(response, message)
    {
        response.writeHead(500)
        response.end(message)
        response.end()
    }

    getRSS(response, route, file)
    {
        const list = []
        const meta = { error: [], log: [] }

        let i = route.list.length - 1
        const pushItems = rss =>
        {
            list.push(...rss)
            if (--i < 0)
            {
                list.sort((a, b) => b.date - a.date)
                const jsonStr = JSON.stringify({
                    meta,
                    list: list.slice(0, route.limit)
                })
                this.serveData(response, jsonStr, file, route.duration)
            }
        }

        route.list.forEach(url =>
        {
            getRSS(url, (error, content) =>
            {
                if (error)
                {
                    meta.error.push(error)
                    pushItems([])
                }
                else
                {
                    meta.error.push('Loaded: ' + url)
                    parseRSS(content, pushItems, { url, type: route.type })
                }
            })
        })
    }

    init(port)
    {
        this.http = http.createServer((request, response) =>
        {
            const server = new Server(request, response)
            this.onServer.dispatch(server)
            /*const filePath = request.url === '/' ? this.homeFile : (this.viewPath + request.url)

            if (hasCacheFile(filePath))
            {
                return this.serveGZIP(response, getCacheFile(filePath), filePath)
            }

            const route = config.routes.find(route => route.path === request.url)
            if (route)
                return this.getRSS(response, route, filePath)

            if (fs.existsSync(filePath))
            {
                this.serveFile(response, filePath)
            }
            else if (fs.existsSync(this.notFoundFile))
            {
                this.serveFile(response, this.notFoundFile)
            }
            else
            {
                response.writeHead(500)
                response.end('Sorry, file not found ..\n')
            }*/
        
        }).listen(port)
    }
}