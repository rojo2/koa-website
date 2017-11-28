module.exports = function(schema, options) {

  schema.add({
    created: Date,
    modified: Date,
  });

  schema.pre("save", function(next) {
    if (this.isNew) {
      this.created = new Date();
    }
    this.modified = new Date();
    return next();
  });

  return schema;
};
