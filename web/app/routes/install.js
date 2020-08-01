const { router } = require('../helpers/core')
const { connect } = require('../helpers/database')

const testDatabaseConnect = async (data) => {
  const { db, client } = await connect(payload)

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
      // Create the config file
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
