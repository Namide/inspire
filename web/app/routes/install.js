const { router } = require('../helpers/core')
const { connect } = require('../helpers/database')
const hooks = require('../event/hooks')

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
        const path = require('path')
        const fileName = path.resolve(__dirname, '../../config.json')
        const fs = require('fs');
        const str = fs.readFileSync(fileName);
        const json = JSON.parse(str);
        json.db = payload

        await hooks.onConfigureDb.dispatch()

        fs.writeFileSync(fileName, JSON.stringify(json, null, 2))

        await hooks.onConfigureDbAfter.dispatch()
        
        ctx.body = {
          success: true
        }
      } catch (error) {
        ctx.body = {
          error: true,
          message: error.message
        }
      }
    } else {
      ctx.body = {
        error: true,
        message: 'Can not connect to database'
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
