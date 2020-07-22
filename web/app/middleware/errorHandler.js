module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    console.log(err)
    ctx.body = {
      error: true,
      message: err.message || 'Server error'
    }
    ctx.app.emit('error', err, ctx)
  }
}
