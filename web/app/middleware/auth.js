const ObjectID = require('mongodb').ObjectID
const { ROLES, roleToVisibility } = require('../constants/permissions')
const hooks = require('../event/hooks')
const { getCookie } = require('../helpers/cookie')
const { getSessionDocumentShema, checkSession } = require('../helpers/session')

const ALL_ROLES = Object.values(ROLES)
const SECOND_TEST = async (ctx, userID) => true

hooks.editUsersDocumentShema.addOnce(async (documentShema) => {
  documentShema.validator.$jsonSchema.properties.sessions = {
    bsonType: 'array',
    items: getSessionDocumentShema()
  }

  return documentShema
})

/**
 * @param {string} _id
 * @param {string} name
 * @param {string} role
 * @returns {{_id: string, name: string, role: string, visibilities: string[]}}
 */
const getUser = (_id, name, role) => {
  return {
    _id,
    name,
    role,
    visibilities: roleToVisibility(role)
  }
}

/**
 * @param {String[]} authorizedRoles Roles aways authorized
 * @param {Function} secondTest If previous roles failed, second test 'async (ctx, userID) => true'
 */
module.exports = (authorizedRoles = ALL_ROLES, secondTest = SECOND_TEST) => async (ctx, next) => {
  const cookie = getCookie(ctx)

  if (ctx.app.collections && ctx.app.collections.users) {
    const user = await ctx.app.collections.users.findOne({ sessions: { $elemMatch: { cookie: ObjectID(cookie) } } })

    if (user) {
      const session = user.sessions.find(session => session.cookie.toString() === cookie)
      console.log(session)
      if (session && checkSession(ctx, session)) {
        user.visibilities = roleToVisibility(user.role)
        ctx.state.user = user
      }
    }
  }

  if (!ctx.state.user) {
    ctx.state.user = getUser(null, null, ROLES.GUEST)
  }

  if (authorizedRoles.indexOf(ctx.state.user.role) < 0) {
    const isValid = await secondTest(ctx, ctx.state.user._id)
    if (!isValid) {
      ctx.throw(401, 'User not authorized')
    }
  }

  await next()
}
