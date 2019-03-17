/*const http = require('http')
const fs = require('fs')
const zlib = require('zlib')

const { getMimeType, gzipable } = require('./system/File')
const { getRSS, parseRSS } = require('./system/RSS')
const { rmCache, addCache, hasCacheFile, getCacheFile, saveCacheFile, rmCacheFile } = require('./system/Cache')
const config = require('./config.json')

// https://developer.mozilla.org/en-US/docs/Learn/ServerManager-side/Node_server_without_framework
// https://blog.feedspot.com/game_development_rss_feeds/

const CACHE_ENABLE = process.argv.indexOf('no-cache') < 0*/

/*
setInterval(() =>
{
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}, 1000)
*/

const fs = require('fs')
const config = require('./config')
const ServerManager = require('./system/ServerManager')
const PostManager = require('./system/api/PostManager')
const Router = require('./system/Router')
const getDataBase = require('./system/api/DataBase')

const serverManager = new ServerManager(config.server.port)
const router = new Router('./public')


let postManager

// Database connection
getDataBase(config.database)
    .then(database =>
    {
        serverManager.onServer.add(router.test.bind(router))
        postManager = new PostManager(database)

        router.add('/', 'GET', server =>
        {
            const file = config.assets.dir + server.getPath() + 'index.html'
            server.setContentType('.html')
            server.serveFile(file)
        })
        router.add('/api/get', 'GET', server =>
        {
            server.setContentType('.json')
            const post = postManager.getPosts({})
                .then(post => server.serveStr('-->' + JSON.stringify(post) + '<--'))
                .catch(error => server.serveStr('error:' + error))
        })
        router.add('/api/add', 'GET', server =>
        {
            server.setContentType('.json')
            const post = postManager.insertPost({ test: Math.random() })
                .then(() => server.serveStr('saved'))
        })
        router.add('/api', 'GET', server =>
        {
            server.setContentType('.json')
            server.serveStr('{"success":false,"message":"Bad route"}')
        })
        router.add('*', 'GET', server =>
        {
            const file = config.assets.dir + server.getPath()
            server.serveFile(file)
        })
    })
    .catch(error => console.log('Database connection error:', error.message))


// If application closed
process.on('exit', () =>
{
    dataBase.close()
    console.log('Database closed!')
})
