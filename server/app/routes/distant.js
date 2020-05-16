const request = require('../helpers/request')

module.exports.distant = async (ctx) => {
  try {
    ctx.body = await request(decodeURIComponent(ctx.params.url))
  } catch (error) {
    ctx.body = { error: true, message: error.message }
  }
}
