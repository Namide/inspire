
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
//         HELPERS
// --------------------------
const zlib = require('zlib')
const hooks = require('./event/hooks')

// --------------------------
//         INIT APP
// --------------------------
const { app, router } = require('./helpers/core')
const { getConfig } = require('./helpers/config')

console.log('--------')
console.log(app.env)
app.keys = getConfig().cookie.keys
app.proxy = true // to enable IP

app.use(errorHandler)
app.use(responseTime)
app.use(BodyParser())
app.use(logger())
app.use(compress({
  threshold: 2048,
  gzip: { flush: zlib.Z_SYNC_FLUSH },
  deflate: { flush: zlib.Z_SYNC_FLUSH },
  br: false // disable brotli
}))
app.use(Static('./public'))

// Security
// https://nodesource.com/blog/Express-Koa-Hapi
// http://polyglot.ninja/rest-api-koajs-mongodb-part-3/

// --------------------------
//         DATABASE
// --------------------------
const initDb = async () => {
  try {
    const { connect } = require('./helpers/database')
    const { db } = await connect(getConfig().db)

    await hooks.onInitDbBefore.dispatch(db, app)
    app.collections = {}
    // db.command( { listCollections: 1 } )
    //   .then(data => console.log(data.cursor.firstBatch));
    console.log('DB connected')
    await hooks.onInitDb.dispatch(db, app)
    await hooks.onInitDbAfter.dispatch(db, app)

    return true
  } catch (error) {
    console.log('DB connection error:', error.message)
    return false
  }
}
require('./middleware/ratelimit.js')(app)

if (!getConfig().db || !initDb()) {
  hooks.onInstallDbAfter.addOnce(initDb)
}

// --------------------------
//          ROUTES
// --------------------------
require('./routes/api.js')
require('./routes/install.js')
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
  .listen(getConfig().server.port)
