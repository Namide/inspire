// const CONFIG = require('../../config.json')
// const jwt = require('jsonwebtoken')
const { getToken } = require('../helpers/token')
const { ROLES, roleToVisibility } = require('../constants/permissions')
// const ObjectID = require('mongodb').ObjectID

/**
 * @param {string} _id
 * @param {string} role
 * @returns {{_id: string, role: string, visibilities: string[]}}
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
module.exports = (authorizedRoles = [ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR, ROLES.SUBSCRIBER, ROLES.GUEST], secondTest = async (ctx, userID) => true) => async (ctx, next) => {
  const { user } = getToken(ctx) || { user: { name: null, role: ROLES.GUEST, _id: null } }
  ctx.state.user = getUser(user._id, user.name, user.role)

  if (authorizedRoles.indexOf(user.role) < 0) {
    const isValid = await secondTest(ctx, user._id)
    if (!isValid) {
      ctx.throw(401, 'User not authorized')
    }
  }

  await next()
}
