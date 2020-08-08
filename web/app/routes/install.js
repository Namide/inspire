const { router } = require('../helpers/core')
const { connect } = require('../helpers/database')
const hooks = require('../event/hooks')
const { addToConfigFile } = require('../helpers/config')

const testDatabaseConnect = async (data) => {
  const { db, client } = await connect(data)

  if (db) {
    client.close()
    return true
  }

  return false
}

router.post('/api/database/install', async (ctx) => {
  if (ctx.app.collections) {
    ctx.throw(404, 'Database already installed')
  } else {
    const payload = Object.assign({}, ctx.request.body.database)
    const success = await testDatabaseConnect(payload)

    if (success) {
      try {
        await hooks.onConfigureDbBefore.dispatch()
        addToConfigFile({ db: payload })

        const { getData } = require('../helpers/global.js')
        const global = await getData(ctx)

        await hooks.onConfigureDbAfter.dispatch()

        ctx.body = {
          success: true,
          global
        }
      } catch (error) {
        const { getData } = require('../helpers/global.js')
        const global = await getData(ctx)
        ctx.body = {
          error: true,
          message: error.message,
          global
        }
      }
    } else {
      const { getData } = require('../helpers/global.js')
      const data = await getData(ctx)
      data.error = true
      data.message = 'Can not connect to database'
      ctx.body = data
    }
  }
})

router.post('/api/database/test', async (ctx) => {
  if (ctx.app.collections) {
    ctx.throw(404, 'Database already installed')
  } else {
    const payload = Object.assign({}, ctx.request.body.database)
    const success = await testDatabaseConnect(payload)

    if (success) {
      ctx.body = {
        success: true
      }
    } else {
      ctx.body = {
        error: true,
        message: 'Can not connect to database'
      }
    }
  }
})
