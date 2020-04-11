const { getToken, setToken } = require('../helpers/token.js')
const required = require('../helpers/required.js')


const RULES = {
  username: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
  password: /^(.){6,}$/,
  role: /^(admin|editor|author)$/
}

module.exports.signin = (ctx) => {
  // console.log(jwt({ secret: 'A very secret key', role: 'admin' })())

  required(ctx, [ 'username', 'password' ])

  if (true) {
    const { username, password } = ctx.request.body;
    const token = setToken('Jean Jean', 'admin');
    ctx.status = 200;
    // console.log(jwt({ secret: 'A very secret key', role: 'admin' }))
    ctx.body = {
      token,
      success: true,
      // user: {
      //   name: 'Jean Jean',
      //   role: 'admin'
      // }
    };
  } else {
    ctx.status = ctx.status = 401;
    ctx.body = {
      success: false,
      message: "Authentication failed"
    };
  }

  return ctx;
}

module.exports.signout = (ctx) => {
  if (ctx.request.body.password === 'password') {
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign({ role: 'admin' }, 'A very secret key'),
      //Should be the same secret key as the one used is ./jwt.js
      message: "Successfully logged in!"
    };
  } else {
    ctx.status = ctx.status = 401;
    ctx.body = {
      message: "Authentication failed"
    };
  }
  return ctx;
}

module.exports.get = async (ctx) => {
  ctx.body = await ctx.app.users.findOne({'_id': ObjectID(ctx.params.id)});
}

module.exports.set = async (ctx) => {
  required(ctx, ['password'])

  const documentQuery = { '_id': ObjectID(ctx.params.id) }; // Used to find the document
  const values = ctx.request.body;
  for (const label of values) {
    required(ctx, { [label]: RULES[label] })
  }
  ctx.body = await ctx.app.users.updateOne(documentQuery, values);
}

module.exports.list = async (ctx) => {
  ctx.body = await ctx.app.users.find();
};

module.exports.add = async (ctx) => {
  // console.log(jwt({ secret: 'A very secret key', role: 'admin' })())

  required(ctx, {
    username: RULES['username'],
    password: RULES['password'],
    role: RULES['role']
  })

  if (true) {
    const { username, password, role } = ctx.request.body;

    
    ctx.body = await ctx.app.users.insert({ username, password, role });

    // // const token = setToken('Jean Jean', 'admin');
    // ctx.status = 200;
    // // console.log(jwt({ secret: 'A very secret key', role: 'admin' }))
    // ctx.body = {
    //   aaa: 1,
    //   success: true,
    //   // user: {
    //   //   name: 'Jean Jean',
    //   //   role: 'admin'
    //   // }
    // };
  }

  return ctx;
}
