const { getToken, setToken } = require('../helpers/token.js');
const required = require('../helpers/required.js');
const bcrypt = require('bcryptjs');
const ObjectID = require('mongodb').ObjectID;
const { ROLES } = require('../constants/permissions');


const RULES = {
  name: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
  password: /^(.){6,}$/,
  role: new RegExp(`^(${ Object.values(ROLES).join('|') })$`),
  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
}

const displayUser = user => {
  delete user.password;
  return user;
}

module.exports.signin = async (ctx) => {
  required(ctx, { email: RULES['email'], password: RULES['password'] })

  const { email, password } = ctx.request.body;
  const user = await ctx.app.users.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    ctx.body = {
      user: displayUser(user),
      token: setToken(ctx, user)
    };
  } else {
    ctx.status = ctx.status = 401;
    ctx.body = {
      success: false,
      message: 'Authentication failed'
    };
  }

  return ctx;
}

module.exports.get = async (ctx) => {

  const token = getToken(ctx);

  if (token) {
    if (token.user.role !== ROLES.ADMIN &&
      token.user._id !== ctx.params.id) {
      return ctx.throw(401, 'Unauthorized');
    }

    const user = await ctx.app.users.findOne({'_id': ObjectID(ctx.params.id)});

    if (user) {
      ctx.body = {
        user: displayUser(user)
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'User not found'
      };
    }
  }

  return ctx;
}

module.exports.set = async (ctx) => {
  const documentQuery = { '_id': ObjectID(ctx.params.id) };
  const values = ctx.request.body;

  for (const label of values) {
    if (!RULES[label]) {
      return ctx.throw(401, label + ' undesired');
    }
    required(ctx, { [label]: RULES[label] })
  }

  if (values.password) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(values.password, salt);
    values.password = hash;
  }

  const user = await ctx.app.users.updateOne(documentQuery, values);
  ctx.body = {
    user: displayUser(user)
  };

  return ctx;
}

module.exports.delete = async (ctx) => {

  const documentQuery = { '_id': ObjectID(ctx.params.id) };
  await ctx.app.users.remove(documentQuery, true);

  ctx.body = {
    success: true,
    message: 'User ' + ctx.params.id + ' deleted'
  };

  return ctx;
}

module.exports.list = async (ctx) => {

  const token = getToken(ctx);

  if (token) {
    if (token.user.role !== ROLES.ADMIN) {
      return ctx.throw(401, 'Unauthorized');
    }

    const users = await ctx.app.users
      .find({})
      .toArray();
  
    return ctx.body = { users: users.map(displayUser) };
  }
};

module.exports.add = async (ctx) => {
  
  required(ctx, {
    name: RULES['name'],
    email: RULES['email'],
    password: RULES['password'],
    role: RULES['role']
  })

  const { name, password, role, email } = ctx.request.body;
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);

  try {
    const insert = await ctx.app.users
      .insertOne({ name, password: hash, role, email });
    const user = insert.ops[0];
    ctx.body = {
      user: displayUser(user)
    };
  } catch (error) {
    ctx.body = {
      success: false,
      message: error.message
    }
  }

  return ctx;
}
