const mongoose = require("mongoose");
const Router = require("koa-router");
const router = new Router();

router.get("/", async (ctx) => {
	await ctx.render("index", {
		title: "Hello, World!"
	});
});

router.post("/login", async (ctx) => {
  const User = mongoose.model("user");
  const email = ctx.request.body.email;
  const user = await User.findOne({ email });
  // TODO: Cambiar esto por passport.
  await ctx.render("user/login", { user });
});

router.post("/signup", async (ctx) => {
  const User = mongoose.model("user");
  try {
    const user = await User.create({
      _id: ctx.request.body.username.toLowerCase(),
      displayName: ctx.request.body.username,
      email: ctx.request.body.email.toLowerCase(),
      password: ctx.request.body.password
    });
    await ctx.render("user/welcome", { user });
  } catch (err) {
    console.log(err);
    await ctx.redirect("/");
  }
});

module.exports = router;
