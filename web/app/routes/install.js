const { router } = require('../helpers/core')
const { connect } = require('../helpers/database')
const hooks = require('../event/hooks')
const { addToConfigFile } = require('../helpers/config')
const { add } = require('./users')
const checkDb = require('../middleware/checkDb')
const { uploaderFileless } = require('../middleware/upload')
const auth = require('../middleware/auth')

const testDatabaseConnect = async (data) => {
  const { db, client } = await connect(data)

  if (db) {
    client.close()
    return true
  }

  return false
}

router.post('/api/database/install', auth(), async (ctx) => {
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

        // wait hooks.onInstallDbAfter.dispatch for db install
        await hooks.onInstallDbAfter.dispatch()
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

router.post('/api/install/admin', checkDb, auth(), uploaderFileless, async (ctx) => {
  const count = await ctx.app.collections.users.countDocuments()
  if (count > 0) {
    ctx.throw(404, 'Admin already set')
  } else {
    try {
      await hooks.onInstallAdminBefore.dispatch()

      const user = await add(ctx)
      const { getData } = require('../helpers/global.js')
      const global = await getData(ctx)
      global.needAdmin = false
      ctx.body = {
        user,
        success: true,
        global
      }

      await hooks.onInstallAdminAfter.dispatch(user)
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
