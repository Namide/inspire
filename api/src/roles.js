const Roles = require('koa-roles');

const user = new Roles({
  async failureHandler(ctx, action) {
    // optional function to customise code that runs when
    // user fails authorisation
    ctx.status = 403;
    
    ctx.body = {
      message: 'Access Denied - You don\'t have permission to: ' + action
    };
  }
});

  
// anonymous users can only access the public page
// returning false stops any more rules from being
// considered
user.use(async (ctx, action) => {
  return ctx.user || action === 'access public page';
});

// moderator users can access private page, but
// they might not be the only ones so we don't return
// false if the user isn't a moderator
user.use('access private page', ctx => {
  if (ctx.user.role === 'moderator') {
    return true;
  }
})

//admin users can access all pages
user.use((ctx, action) => {
  if (ctx.user.role === 'admin') {
    return true;
  }
});

module.exports = function (app, router) {

  app.use(user.middleware());

  return user;
};
