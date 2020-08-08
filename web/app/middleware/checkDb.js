module.exports = async (ctx, next) => {
  if (!ctx.app.collections) {
    ctx.throw(409, 'Database not configured')
  }

  await next()
}
