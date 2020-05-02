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
const getUser = (_id, name, role, ctx) => {
  return {
    _id,
    name,
    role,
    visibilities: roleToVisibility(role)
  }
}

module.exports = (roles = [ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR, ROLES.SUBSCRIBER, ROLES.GUEST], secondTest = async (ctx, userID) => true) => async (ctx, next) => {
  const { user } = getToken(ctx) || { user: { name: 'Guest', role: ROLES.GUEST, _id: '0' } }
  ctx.state.user = getUser(user._id, user.name, user.role, ctx)

  // if (collection) {
  //   const documentQuery = { _id: ObjectID(ctx.params.id) }
  //   const element = await ctx.app[collection].findOne(documentQuery)

  //   if (element[idProperty] === user._id) {
  //     await next()
  //     return true
  //   }
  // }

  if (roles.indexOf(user.role) < 0) {
    ctx.throw(401, 'Role not authorized')
  } else {
    const isValid = await secondTest(ctx, user._id)
    if (!isValid) {
      ctx.throw(401, 'User not authorized')
    }
  }

  await next()
}

// module.exports.testAuthorized = (ctx, itemAuthorID, rolesAuthorized = [ROLES.ADMIN], deepTest = (ctx, userID) => true) => {
//   const { _id, role } = ctx.state.user

//   // Authorize if is author of good role
//   if (itemAuthorID !== _id && rolesAuthorized.indexOf(role) === -1) {
//     ctx.throw(401, 'Role not authorized')
//     return false
//   }

//   return deepTest(ctx, id)
// }
