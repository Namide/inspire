
// --------------------------
//     KOA DEPENDENCIES
// --------------------------
const Static = require('koa-static')
const BodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const compress = require('koa-compress')

// --------------------------
//        MIDDLEWARES
// --------------------------
const errorHandler = require('./middleware/errorHandler')
const responseTime = require('./middleware/responseTime')

// --------------------------
//         CONSTANTS
// --------------------------
const CONFIG = require('../config.json')

// --------------------------
//         HELPERS
// --------------------------
const ObjectID = require('mongodb').ObjectID
const zlib = require('zlib')
const hooks = require('./event/hooks')

// --------------------------
//         INIT APP
// --------------------------
const { app, router } = require('./helpers/core')

app.use(errorHandler)
app.use(responseTime)
app.use(BodyParser())
app.use(logger())
app.use(compress({
  // filter (content_type) {
  //   return /text/i.test(content_type)
  // },
  threshold: 2048,
  gzip: { flush: zlib.Z_SYNC_FLUSH },
  deflate: { flush: zlib.Z_SYNC_FLUSH },
  br: false // disable brotli
}))
app.use(Static('./public'))
// app.use(async (ctx, next) => {
//   if (ctx.request.url === '/test') {
//     ctx.serve()
//   } else {
//     await next()
//   }
// })

// Security
// https://nodesource.com/blog/Express-Koa-Hapi
// http://polyglot.ninja/rest-api-koajs-mongodb-part-3/

// --------------------------
//         DATABASE
// --------------------------
const initDb = async () => {
  return require('./middleware/mongo.js')(app)
    .then(async db => {
      await hooks.onInitDbBefore.dispatch(db, app)
      app.collections = {}
      // db.command( { listCollections: 1 } )
      //   .then(data => console.log(data.cursor.firstBatch));
      console.log('DB connected')
      await hooks.onInitDb.dispatch(db, app)
      await hooks.onInitDbAfter.dispatch(db, app)

      return true
    })
    .catch(error => console.log('DB connection error:', error.message))
}
require('./middleware/ratelimit.js')(app)

if (CONFIG.db) {
  initDb()
} else {
  hooks.onConfigureDbAfter.dispatch(initDb)
}

// --------------------------
//          ROUTES
// --------------------------
require('./routes/api.js')
require('./routes/distant.js')
require('./routes/users.js')
require('./routes/groups.js')
require('./routes/items.js')
require('./routes/files.js')

// --------------------------
//           RUN
// --------------------------
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(CONFIG.server.port)
