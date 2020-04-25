const { getToken, setToken } = require('../helpers/token.js');
// const required = require('../helpers/required.js');
const ObjectID = require('mongodb').ObjectID;
const { ROLES, VISIBILITY, roleToVisibility } = require('../constants/permissions');
const fs = require('fs')
const path = require('path')

// const isText = () => {
//   return true;
// }

// const isJSON = (string) => {
//   try {
//     JSON.parse(string);
//   } catch (error) {
//     return false;
//   }

//   return true;
// }

// const RULES = {
//   visibility: new RegExp(`^(${ Object.values(VISIBILITY).join('|') })$`),
//   order: /^[0-9]+$/,
//   author: /^[0-9a-f]+$/,
//   title: isText,
//   image: isJSON,
//   description: isText,
//   filter: isText
// }

module.exports.init = async (db) => {
  const groups = await db.createCollection('groups', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['visibility', 'order', 'title', 'author', 'filter'],
        properties: {
          visibility: {
            enum: Object.values(VISIBILITY),
            description: 'Can only be ' + Object.values(VISIBILITY).join(', ') + ' and is required'
          },
          order: {
            bsonType: 'int'
          },
          author: {
            bsonType: 'objectId',
            // pattern: '^[0-9a-fA-F]{24}$'
          },
          title: {
            bsonType: 'string'
          },
          description: {
            bsonType: 'string'
          },
          image: {
            bsonType: 'object',
            required: ['width', 'height', 'src'],
            properties: {
              width: {
                bsonType: 'int',
                description: 'must be a string if the field exists'
              },
              height: {
                bsonType: 'int',
                description: 'must be a string if the field exists'
              },
              src: {
                bsonType: 'string'
              }
            }
          },
          filter: {
            bsonType: 'string'
          }
        }
      },
      // $or: [
      //   { name: { $regex: /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/ } },
      //   { email: { $regex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ } }
      // ]
    }
  })

  // const groups = db.collection('groups');
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
  
  const token = getToken(ctx, { isNeeded: true, roles: [ROLES.ADMIN, ROLES.EDITOR, ROLES.AUTHOR] });
  if (!token) {
    return ctx;
  }

  const values = ctx.request.body;

  // for (const label of values) {
  //   if (!RULES[label]) {
  //     return ctx.throw(401, label + ' undesired');
  //   }
  //   required(ctx, { [label]: RULES[label] })
  // }
  

  try {
    const payload = Object.assign(values, { author: ObjectID(token.user._id) })
    payload.order = Number(payload.order)

    if (ctx.request.files[0]) {
      payload.image = JSON.parse(payload.image)
      payload.image.src = '/' + ctx.request.files[0].path.split(path.sep).join('/')
      payload.image.mimetype = ctx.request.files[0].mimetype
    } else {
      delete payload.image
    }

    const insert = await ctx.app.groups
      .insertOne(payload);
    const groups = [insert.ops[0]];
    ctx.body = { groups };
  } catch (error) {

    
    console.log(ctx.request.files[0].path.split(path.sep).join('/'))
    ctx.request.files.forEach(file => {

      // file.on('data', function(data) {
      //   console.log('File got ' + data.length + ' bytes');
      // });
      // console.log(file)
      if (file.ended) {
        return fs.unlink(path.resolve(file.path), error => {
          if (error) console.log(error)
        })
      }
      file.on('end', () => {
        fs.unlink(path.resolve(file.path), error => {
          if (error) console.log(error)
        })
      })

    })

    ctx.body = {
      success: false,
      message: error.message
    }
  }

  return ctx;
}
