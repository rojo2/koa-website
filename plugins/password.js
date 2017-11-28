const password = require("../password");

module.exports = function(schema, options) {

  schema.add({
    password: String,
  });

  schema.method("verifyPassword", function(value) {
    return password.verify(value);
  });

  schema.pre("save", function(next) {
    if (this.isModified("password")) {
      password.hash(this.password).then((hashedPassword) => {
        this.password = hashedPassword;
        return next();
      }).catch((err) => {
        return next(err);
      });
    } else  {
      return next();
    }
  });

  return schema;

};
