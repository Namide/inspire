const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const request = require('./request');
const ObjectID = require('mongodb').ObjectID;
const errorHandler = require('./middleware/errorHandler');
const static = require('koa-static');
const { uploaderGroup } = require('./helpers/files');

const {
  add: addUser,
  get: getUser,
  set: setUser,
  delete: deleteUser,
  list: getUsers,
  init: initUsers,
  signin,
  signout
} = require('./routes/users.js');

const {
  list: getGroups,
  init: initGroups,
  add: addGroups,
  delete: deleteGroup,
  set: setGroup,
} = require('./routes/groups.js');


const app = new Koa();
const router = new Router();

// Security
// https://nodesource.com/blog/Express-Koa-Hapi
// http://polyglot.ninja/rest-api-koajs-mongodb-part-3/

app.use(errorHandler);
app.use(BodyParser());
app.use(logger());
app.use(static('./public'));

// app.use(koaStatic('upload'))
// app.use(mount('/upload', a));
// app.use(mount('/world', b));

require('./middleware/mongo.js')(app)
  .then(async db => {
    
    // db.command( { listCollections: 1 } )
    //   .then(data => console.log(data.cursor.firstBatch));

    console.log('DB connected');
    app.users = await initUsers(db);
    app.groups = await initGroups(db);

    return true
  })
  .catch(error => console.log('DB connection error:', error.message));
require('./middleware/ratelimit.js')(app);

router.get('/users/:id([0-9a-f]{24})', getUser);
router.post('/users/:id([0-9a-f]{24})', setUser);
router.delete('/users/:id([0-9a-f]{24})', deleteUser);
router.get('/users', getUsers);
router.post('/users', addUser); // , uploaderGroup
router.post('/signin', signin);
// router.post('/signout', signout);

router.get('/groups', getGroups);
router.post('/groups/:id([0-9a-f]{24})', uploaderGroup, setGroup);
router.delete('/groups/:id([0-9a-f]{24})', deleteGroup);
router.post('/groups', uploaderGroup, addGroups);

router.post('/', async function (ctx) {
  let name = ctx.request.body.name || 'World';
  ctx.body = { message: `Hello ${name}!` }
});

router.get('/peoples', async (ctx) => {
  // app.peoples.insert({ 'name': 'masnun', 'email': 'masnun@gmail.com' })
  ctx.body = await ctx.app.peoples.find().toArray();
});

router.get('/peoples/:id([0-9a-f]{24})', async (ctx) => {
  ctx.body = await ctx.app.peoples.findOne({'_id': ObjectID(ctx.params.id)});
});

router.post('/peoples', async (ctx) => {
  ctx.body = await ctx.app.peoples.insert(ctx.request.body);
});

router.post('/peoples/:id([0-9a-f]{24})', async (ctx) => {
  const documentQuery = { '_id': ObjectID(ctx.params.id) }; // Used to find the document
  const valuesToUpdate = ctx.request.body;
  ctx.body = await ctx.app.peoples.updateOne(documentQuery, valuesToUpdate);
});

router.get('/distant/:url', async (ctx) => {
  try {
    ctx.body = await request(decodeURIComponent(ctx.params.url));
  } catch (error) {
    ctx.body = { success: false, message: error.message }
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
