module.exports = async (ctx, next) => {
  if (!ctx.app.collections) {
    const error = new Error('Database not configured')
    error.status = 409
    throw error
  }

  await next()
}
