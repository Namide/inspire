const Koa = require("koa");
const Router = require("koa-router");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const request = require('./request');
const ObjectID = require("mongodb").ObjectID;

const app = new Koa();
const router = new Router();

// Security
// https://nodesource.com/blog/Express-Koa-Hapi

// http://polyglot.ninja/rest-api-koajs-mongodb-part-3/

// const jwt = require("./jwt");
// app.use(jwt.errorHandler()).use(jwt.jwt());
app.use(BodyParser());
app.use(logger());

require("./mongo.js")(app)
const user = require("./roles.js")(app)

router.post("/", user.can('access public page'), async function (ctx) {
  let name = ctx.request.body.name || "World";
  ctx.body = { message: `Hello ${name}!` }
});

router.get("/people", user.can('access public page'), async (ctx) => {
  // app.people.insert({ "name": "masnun", "email": "masnun@gmail.com" })
  ctx.body = await ctx.app.people.find().toArray();
});

router.get("/people/:id", user.can('access private page'), async (ctx) => {
  ctx.body = await ctx.app.people.findOne({"_id": ObjectID(ctx.params.id)});
});

router.post("/people", user.can('access private page'), async (ctx) => {
  ctx.body = await ctx.app.people.insert(ctx.request.body);
});

router.put("/people/:id", user.can('access private page'), async (ctx) => {
  const documentQuery = { "_id": ObjectID(ctx.params.id) }; // Used to find the document
  const valuesToUpdate = ctx.request.body;
  ctx.body = await ctx.app.people.updateOne(documentQuery, valuesToUpdate);
});

router.get("/distant/:url", user.can('access private page'), async (ctx) => {
  try {
    ctx.body = await request(decodeURIComponent(ctx.params.url));
  } catch (error) {
    ctx.body = { success: false, message: error.message }
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
