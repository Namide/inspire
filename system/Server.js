const http = require('http')
const Signal = require('./utils/Signal')

module.exports = class Server
{
    constructor(port)
    {
        this.port = port

        // this.homeFile = this.viewPath + '/index.html'
        // this.notFoundFile = this.viewPath + '/404.html'

        this.onRequest = new Signal()

        this.init(port)

        console.log('Server running at http://127.0.0.1:' + port + '/')
    }

    serveFile(response, file)
    {
        fs.readFile(file, (error, content) =>
        {
            if (!error)
            {
                this.serveData(response, content, file)
            }
            else 
            {
                this.serveError(response, 'Sorry, file not found: ' + error.code + ' ..\n')
            }
        })
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

    serveData(response, content, file, duration = 0)
    {
        if (gzipable(file))
        {
            const gzip = this.gzipData(content)

            if (CACHE_ENABLE)
            {
                saveCacheFile(file, gzip)
                if (duration > 0)
                    setTimeout(rmCacheFile, duration, file)
            }

            this.serveGZIP(response, gzip, file)
        }
        else
        {
            this.serveGZIP(response, content, file)
        }
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
            console.log('on request')
            this.onRequest.dispatch(request, response)
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