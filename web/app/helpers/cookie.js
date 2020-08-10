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
    // secure: true,
    httpOnly: true
  })
}

/*
module.exports.getUser = (ctx) => {

}

module.exports.setCookie = (ctx, user) => {
  const payload = {
    ua: ctx.request.headers['user-agent'],
    ip: ctx.request.ip,
    exp: Math.floor(Date.now() / 1000) + DURATION,
    user: {
      name: user.name,
      role: user.role,
      _id: user._id
    }
  }

  return jwt.sign(payload, getConfig().jwt.secret, JWT_OPTIONS)
}

module.exports.getCookie = (ctx) => {
  let token = null

  const authorization = ctx.headers.authorization || ctx.query.token
  if (ctx.headers.authorization && authorization.split(' ').length > 1) {
    token = authorization.split(' ')[1]
  } else if (ctx.query.token) {
    token = ctx.query.token
  }

  if (token) {
    if (BLACKLIST.indexOf(token) > -1) {
      ctx.throw(401, 'Falsified token')
      return null
    }

    try {
      const decoded = jwt.verify(token, getConfig().jwt.secret)
      const ua = ctx.request.headers['user-agent']
      const ip = ctx.request.ip

      if (decoded.ua === ua && decoded.ip === ip) {
        return decoded
      }

      ctx.throw(401, 'Falsified token')
      return null
    } catch (err) {
      ctx.throw(401, err.message)
      return null
    }
  }

  return null
}
*/
