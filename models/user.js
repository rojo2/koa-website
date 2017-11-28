const validator = require("validator");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const password = require("../plugins/password");
const date = require("../plugins/date");

const UserSchema = new Schema({
  _id: String,
  displayName: String,
  email: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    default: "user"
  },
  state: {
    type: String,
    default: "not-enabled",
    enum: [
      "not-enabled",
      "enabled",
      "disabled"
    ]
  },
  enabled: Date,
});

UserSchema.plugin(password);
UserSchema.plugin(date);

UserSchema.path("email").validate(value => validator.isEmail(value), "Invalid e-mail");

UserSchema.pre("save", function(next) {
  if (this.isModified("state")
   && this.state === "enabled") {
    this.enabled = new Date();
  }
  return next();
});

module.exports = mongoose.model("user", UserSchema);
