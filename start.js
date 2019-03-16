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

const config = require('./config')
const ServerManager = require('./system/ServerManager')
const PostManager = require('./system/api/PostManager')
const Router = require('./system/Router')
const getDataBase = require('./system/api/DataBase')

const serverManager = new ServerManager(config.server.port)
const router = new Router('./public')

serverManager.onServer.add(router.test.bind(router))

let postManager

// Database connection
getDataBase(config.database)
    .then(database =>
    {
        postManager = new PostManager(database)

        router.add('/', 'GET', server => console.log('Home ok', server.getUrl()))
        router.add('/api/get.json', 'GET', server =>
        {
            const post = postManager.getPosts({})
                .then(post => server.serveData('-->' + JSON.stringify(post) + '<--'))
                .catch(error => server.serveData('error:' + error))
            
        })
        router.add('/api/add.json', 'GET', server =>
        {
            const post = postManager.insertPost({ test: Math.random() })
            server.serveData('saved')
        })
        router.add('*', 'GET', server => console.log('404 ok', server.request.url))
    })
    .catch(error => console.log(error))



// If application closed
process.on('exit', () =>
{
    dataBase.close()
    console.log('Database closed!')
})
