const { setCookie } = require('./cookie')
const { getConfig } = require('./config')

const ObjectID = require('mongodb').ObjectID

module.exports.getSessionDocumentShema = () => {
  return {
    bsonType: 'object',
    required: ['cookie', 'userAgent', 'expires', 'ip'],
    properties: {
      cookie: {
        bsonType: 'objectId'
      },
      userAgent: {
        bsonType: 'string'
      },
      ip: {
        bsonType: 'string'
      },
      expires: {
        bsonType: 'date'
      }
    }
  }
}

module.exports.checkSessionDate = ({ cookie, userAgent, ip, expires }) => {
  return expires.getTime() > Date.now()
}

module.exports.checkSession = (ctx, { cookie, userAgent, ip, expires }) => {
  return cookie !== null &&
    userAgent === ctx.request.headers['user-agent'] &&
    ip === ctx.request.ip &&
    expires.getTime() > Date.now()
}

module.exports.createSession = (ctx, duration = null) => {
  const maxAge = duration === null ? getConfig().cookie.ageHours * 60 * 60 * 1000 : duration

  const cookie = ObjectID()
  const userAgent = ctx.request.headers['user-agent']
  const ip = ctx.request.ip
  const expires = new Date(Date.now() + maxAge)

  setCookie(ctx, cookie, expires)

  return {
    cookie,
    userAgent,
    ip,
    expires
  }
}
