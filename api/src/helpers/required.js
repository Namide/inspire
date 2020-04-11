
module.exports = (ctx, required, obj = ctx.request.body) => {

  if (Array.isArray(required)) {
    for (const name of required) {
      if(!obj[name]) {
        ctx.throw(422, {
          success: false,
          message: name + ' required'
        })
      }
    }
  } else {
    for (const name of Object.keys(required)) {
      if (!obj[name]) {
        ctx.throw(422, {
          success: false,
          message: name + ' required'
        })
      } else if (!required[name].test(obj[name])) {
        ctx.throw(422, {
          success: false,
          message: 'Bad format for ' + name
        })
      }
    }
  }

}
