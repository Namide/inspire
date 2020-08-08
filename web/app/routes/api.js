const { router } = require('../helpers/core')

router.get('/api', async (ctx) => {
  const { version } = require('../../package.json')
  const { getData } = require('../helpers/global.js')
  const global = await getData(ctx)

  ctx.body = {
    name: 'Inspire API',
    version,
    global
  }
})
