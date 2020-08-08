module.exports.getData = async (ctx) => {
  const { ROLES } = require('../constants/permissions')

  const data = {
    serverTime: new Date(),
    isLogged: (ctx.state.user && ctx.state.user.role !== ROLES.GUEST) || false
  }

  if (ctx.app.collections && ctx.app.collections.users) {
    const userCount = await ctx.app.collections.users.countDocuments()
    if (userCount < 1) {
      data.needAdmin = true
    }
  } else {
    data.needDatabase = true
  }

  return data
}
