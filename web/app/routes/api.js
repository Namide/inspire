const { router } = require('../helpers/core')
const { ROLES } = require('../constants/permissions')

router.get('/api', async (ctx) => {
  const { version } = require('../../package.json')

  const payload = {
    version,
    serverTime: new Date(),
    isLogged: ctx.state.user && ctx.state.user.role !== ROLES.GUEST
  }

  if (ctx.app.collections && ctx.app.collections.users) {
    const userCount = await ctx.app.collections.users.countDocuments()
    if (userCount < 1) {
      payload.needAdmin = true
    }
  } else {
    payload.needDatabase = true
  }

  ctx.body = payload
})
