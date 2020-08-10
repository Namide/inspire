const { router } = require('../helpers/core')
const auth = require('../middleware/auth')

router.get('/api', auth(), async (ctx) => {
  const { version } = require('../../package.json')
  const { getData } = require('../helpers/global.js')
  const global = await getData(ctx)

  ctx.body = {
    name: 'Inspire API',
    version,
    global
  }
})
