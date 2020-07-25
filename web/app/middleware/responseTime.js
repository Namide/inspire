module.exports = async (ctx, next) => {
  const started = Date.now()
  await next()
  const ellapsed = (Date.now() - started) + 'ms'
  ctx.set('X-ResponseTime', ellapsed)
}
