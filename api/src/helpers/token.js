const CONFIG = require('../../config.json')
const { ROLES } = require('../constants/permissions');
const jwt = require('jsonwebtoken');

const JWT_OPTIONS = {
  expiresIn: 1000 * 60 * 60 * 24
}

module.exports.setToken = (ctx, user) => {
  const payload = {
    ua: ctx.request.headers['user-agent'],
    ip: ctx.request.ip,
    user: {
      role: user.role,
      _id: user._id,
    }
  }

  return jwt.sign(payload, CONFIG.jwt.secret, JWT_OPTIONS);
}

module.exports.getToken = (ctx, { isNeeded = false, roles: ROLES } = {}) => {
  if (ctx.headers.authorization) {
    const token = ctx.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, CONFIG.jwt.secret);
      const ua = ctx.request.headers['user-agent'];
      const ip = ctx.request.ip;

      if (decoded.ua === ua && decoded.ip === ip) {
        return decoded;
      }
      
      ctx.throw(401, 'Falsified token');
      return null;

    } catch (err) {
      ctx.throw(401, err.message);
      return null;
    }
  }

  if (isNeeded) {
    ctx.throw(401, 'Token needed');
    return null;
  }
  
  if (!roles.find(token.user.role)) {
    ctx.throw(401, 'Role not authorized');
    return null;
  }

  return {
    user: {
      name: null,
      role: ROLES.GUEST,
      _id: '0'
    }
  }
}