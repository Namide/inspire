const { getToken, setToken } = require('../helpers/token.js');
const required = require('../helpers/required.js');
const ObjectID = require('mongodb').ObjectID;
const { ROLES, VISIBILITY, roleToVisibility } = require('../constants/permissions');

const isText = () => {
  return true;
}

const isJSON = (string) => {
  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }

  return true;
}

const RULES = {
  visibility: new RegExp(`^(${ Object.values(VISIBILITY).join('|') })$`),
  sort: /^[0-9]+$/,
  author: /^[0-9a-f]+$/,
  title: isText,
  image: isJSON,
  description: isText,
  filter: isText
}

module.exports.init = (db) => {
  const groups = db.collection('groups');
  groups.createIndex( { 'filter': 1 }, { unique: true } );
  return groups;
}

module.exports.list = async (ctx) => {

  const token = getToken(ctx);
  const role = token ? token.user.role : ROLES.GUEST;
  const visibility = roleToVisibility(role);
  const author = token ? token.user._id : '0';

  const groups = await ctx.app.groups
    .find({
      $or: [
        { author },
        {
          visibility: {
            $regex: new RegExp(`^(${ visibility.join('|') })$`)
          }
        }
      ]
    })
    .toArray();
  
  return ctx.body = { groups };
};

// module.exports.get = async (ctx) => {
//   const user = await ctx.app.users.findOne({'_id': ObjectID(ctx.params.id)});

//   if (user) {
//     ctx.body = displayUser(user);
//   } else {
//     ctx.status = 404;
//     ctx.body = {
//       success: false,
//       message: 'User not found'
//     };
//   }

//   return ctx;
// }

// module.exports.set = async (ctx) => {
//   const documentQuery = { '_id': ObjectID(ctx.params.id) };
//   const values = ctx.request.body;

//   for (const label of values) {
//     required(ctx, { [label]: RULES[label] })
//   }

//   if (values.password) {
//     const salt = bcrypt.genSaltSync();
//     const hash = bcrypt.hashSync(values.password, salt);
//     values.password = hash;
//   }

//   const user = await ctx.app.users.updateOne(documentQuery, values);
//   ctx.body = displayUser(user);

//   return ctx;
// }

// module.exports.delete = async (ctx) => {
  
//   const documentQuery = { '_id': ObjectID(ctx.params.id) };
//   await ctx.app.users.remove(documentQuery, true);

//   ctx.body = {
//     success: true,
//     message: 'User ' + ctx.params.id + ' deleted'
//   };

//   return ctx;
// }

module.exports.add = async (ctx) => {
  
  const token = getToken(ctx, true);
  if (!token) {
    return ctx;
  }

  const values = ctx.request.body;

  for (const label of values) {
    if (!RULES[label]) {
      return ctx.throw(401, label + ' undesired');
    }
    required(ctx, { [label]: RULES[label] })
  }

  try {
    const payload = Object.assign(values, { author: ObjectID(token.user._id) })
    const insert = await ctx.app.groups
      .insertOne(payload);
    const groups = [insert.ops[0]];
    ctx.body = { groups };
  } catch (error) {
    ctx.body = {
      success: false,
      message: error.message
    }
  }

  return ctx;
}
