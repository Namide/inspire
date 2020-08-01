const CONFIG = require('../../config.json')
const jwt = require('jsonwebtoken')

const JWT_OPTIONS = {
  // expiresIn: 1000 * 60 * 60 * 24
}

const DURATION = (24 * 60 * 60) // 24 hour
const BLACKLIST = []

module.exports.setToken = (ctx, user) => {
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

  return jwt.sign(payload, CONFIG.jwt.secret, JWT_OPTIONS)
}

module.exports.blacklistToken = (ctx, authorization = ctx.headers.authorization) => {
  if (authorization) {
    BLACKLIST.push(authorization)
    setTimeout(() => {
      BLACKLIST.shift()
    }, DURATION * 1000)
  }
}

/**
 * @returns {{ua:string, ip:string, expo:number, user: { role:string, _id:string }}|null}
 */
module.exports.getToken = (ctx) => {

  let token = null

  authorization = ctx.headers.authorization || ctx.query.token
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
      const decoded = jwt.verify(token, CONFIG.jwt.secret)
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
