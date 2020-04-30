
module.exports = (ctx, required, obj = ctx.request.body) => {

  if (Array.isArray(required)) {
    for (const name of required) {
      if(!obj[name]) {
        ctx.throw(422, name + ' required')
      }
    }
  } else {
    for (const name of Object.keys(required)) {
      if (!obj[name]) {
        ctx.throw(422, name + ' required')
      } else if (required[name] instanceof RegExp && !required[name].test(obj[name])) {
        ctx.throw(422, 'Bad format for ' + name)
      } else if (required[name] instanceof Function && !required[name](obj[name])) {
        ctx.throw(422, 'Bad format for ' + name)
      }
    }
  }
}
