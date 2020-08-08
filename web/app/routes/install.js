const { router } = require('../helpers/core')
const { connect } = require('../helpers/database')
const hooks = require('../event/hooks')
const { addToConfigFile } = require('../helpers/config')
const { add } = require('./users')

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
        await hooks.onInstallDbBefore.dispatch()
        addToConfigFile({ db: payload })

        const { getData } = require('../helpers/global.js')

        hooks.onInitDbAfter.addOnce(async () => {
          const global = await getData(ctx)
          global.needDatabase = false
          ctx.body = {
            success: true,
            global
          }
        })

        await hooks.onInstallDbAfter.dispatch()

        // wait hooks.onInstallDbAfter.dispatch for db install
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

router.post('/api/install/admin', async (ctx) => {
  if (!ctx.app.collections.users) {
    return ctx.throw(404, 'Need install database')
  }

  const count = await ctx.app.collections.users.countDocuments()
  if (count > 0) {
    ctx.throw(404, 'Admin already set')
  } else {
    try {
      await hooks.onInstallAdminBefore.dispatch()

      if (add(ctx)) {
        const { getData } = require('../helpers/global.js')
        const global = await getData(ctx)
        ctx.body.global = global
      }

      await hooks.onInstallAdminAfter.dispatch()
    } catch (error) {
      const { getData } = require('../helpers/global.js')
      const global = await getData(ctx)
      ctx.body = {
        error: true,
        message: error.message,
        global
      }
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
