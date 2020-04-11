const CONFIG = require('../../config.json')
const jwt = require('jsonwebtoken');

const JWT_OPTIONS = {
  expiresIn: 1000 * 60 * 60 * 24
}

module.exports.setToken = (name, role) => {
  const payload = {
    user: { name, role }
  }
  return jwt.sign(payload, CONFIG.jwt.secret, JWT_OPTIONS);
}

module.exports.getToken = (ctx) => {
  if (ctx.headers.authorization) {
    const token = ctx.headers.authorization.split(' ')[1];
    try {
      return jwt.verify(token, CONFIG.jwt.secret);
    } catch (err) {
      ctx.throw(err.status || 403, err.text);
    }
  } else {
    return {
      user: {
        name: null,
        role: 'guest'
      }
    }
  }
}
