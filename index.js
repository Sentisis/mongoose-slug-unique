/**
 * deps
 */

var slug = require('slug-component');

/**
 * slug plugin.
 *
 * Usage:
 *
 *      mySchema.plugin(slug('title'));
 *
 * Options:
 *
 *      - `.replace` characters to replace defaulted to `[^a-zA-Z]`
 *      - `.separator` separator to use, defaulted to `-`
 *      - `.unique` whether the slug is unique or not, detauls to  to `true`
 *      - `required` whether a slug is required, defaults to `true`
 *
 * @param {String} prop
 * @param {Object} options
 * @return {Function}
 */

module.exports = function(prop, required, opts){
  return (function slugize(schema){
    var required = required||false;

    var title;
    var slug_opts = {type: String, required:required} ;
    if (!opts || opts.unique)
      slug_opts.unique = true
    schema.add({ slug: slug_opts});
    schema.pre('save', function(next){
      var self = this;

      if (prop && Array.isArray(prop)) {
        var titles = [];
        prop.forEach(function(el){
          titles.push(self[el]);
        });
        title = titles.join(' ');
      } else {
        title = this[prop || 'title'];
      }

      var require = (opts && !opts.required) ? false : true;
      if (require && !title) return next(new Error(prop + ' is required to create a slug'));
      delete opts.unique // clean opts
      if (title) self.slug = slug(title, opts);
      next();
    });
  });
};
