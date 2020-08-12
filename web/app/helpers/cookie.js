module.exports.getCookie = ctx => {
  return ctx.cookies.get('auth', { signed: true }) || null
}

module.exports.removeCookie = (ctx) => {
  ctx.cookies.set('auth', '')
}

module.exports.setCookie = (ctx, cookie, expires) => {
  ctx.cookies.set('auth', cookie, {
    expires,
    maxAge: expires.getTime() - Date.now(),
    signed: true,
    secure: ctx.app.env !== 'development',
    httpOnly: true
  })
}
