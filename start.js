/*const http = require('http')
const fs = require('fs')
const zlib = require('zlib')

const { getMimeType, gzipable } = require('./system/File')
const { getRSS, parseRSS } = require('./system/RSS')
const { rmCache, addCache, hasCacheFile, getCacheFile, saveCacheFile, rmCacheFile } = require('./system/Cache')
const config = require('./config.json')

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
// https://blog.feedspot.com/game_development_rss_feeds/

const CACHE_ENABLE = process.argv.indexOf('no-cache') < 0*/

/*
setInterval(() =>
{
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}, 1000)
*/


const Server = require('./system/Server')
const Router = require('./system/Router')

const server = new Server(8125)
const router = new Router('./public')

server.onRequest.add(router.test.bind(router))

router.add('/', 'GET', (request, response) => console.log('Home ok', request.url))
router.add('/api', 'GET', (request, response) => console.log('Api ok', request.url))
router.add('*', 'GET', (request, response) => console.log('404 ok', request.url))
