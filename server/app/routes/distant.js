const request = require('../helpers/request')

module.exports.distant = async (ctx) => {
  try {
    const response = await request(decodeURIComponent(ctx.params.url))
    ctx.body = response

    if (response.headers['content-type']) {
      ctx.response.type = response.headers['content-type']
    }
    if (response.headers['content-length']) {
      ctx.response.length = response.headers['content-length']
    }
    // ctx.response.length = response.length

    // console.log( headers )
    // console.log(response)
    // ctx.response.body = body
    // console.log(Object.keys(ctx))
    // $self.response.length = response.length;
    // $self.response.type="image/png";
    // ctx.body = body
    // ctx.response.type = headers['content-type']
  } catch (error) {
    ctx.body = { error: true, message: error.message }
  }
}
