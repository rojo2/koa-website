const Koa = require("koa");
const passport = require("koa-passport");
const helmet = require("koa-helmet");
const bodyParser = require("koa-bodyparser");
const views = require("koa-views");
const serve = require("koa-static");
const stylus = require("koa-stylus");

const path = require("path");
const fs = require("fs");
const util = require("util");

const paths = {
  models: path.resolve(__dirname, "models"),
  static: path.resolve(__dirname, "static"),
  styles: path.resolve(__dirname, "styles"),
  views: path.resolve(__dirname, "views")
};

const readDirectory = util.promisify(fs.readdir);
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/test", { useMongoClient: true }).then(() => {
  return readDirectory(paths.models).then((files) => {
    return files.filter(file => path.extname(file) === ".js")
                .map(file => require(path.resolve(paths.models, file)));
  });
}).catch((err) => {
  console.log(err);
});

const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(
  async function(email, password, done) {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false);
    }
    const verified = await user.verifyPassword(password);
    if (!verified) {
      return done(null, false);
    }
    return done(null, user);
  }
));

const app = new Koa();
const router = require("./routes");

app
  .use(serve(paths.static))
  .use(helmet())
  .use(passport.initialize())
  .use(bodyParser())
  .use(stylus({
    src: paths.styles,
    dest: paths.static,
    force: process.env.NODE_ENV === "development",
  }))
  .use(views(paths.views, {
    extension: "pug",
  }))
  .use(router.allowedMethods())
  .use(router.routes())
  .use(async (ctx) => {
    await ctx.render("not-found");
  })
  .listen(4000);
