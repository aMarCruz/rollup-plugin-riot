'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rollupPluginutils = require('rollup-pluginutils');
var compiler = _interopDefault(require('riot-compiler'));
var assign = _interopDefault(require('object-assign'));

function extend (src) {
  var args = arguments;
  for (var i = 1; i < args.length; ++i) {
    var obj = args[i];
    if (obj) {
      for (var key in obj) {
        if (typeof obj[key] === 'object' && typeof src[key] === 'object')
          { src[key] = extend(src[key], obj[key]); }
        else if (typeof obj[key] !== 'undefined')
          { src[key] = obj[key]; }
      }
    }
  }
  return src
}

function riot(options) {
  if ( options === void 0 ) options = {};

  var
    frag = "import riot from 'riot';",
    ext = options.ext || 'tag',
    filter = rollupPluginutils.createFilter(options.include, options.exclude),
    skip = options.skip || false,
    parsers = options.parsers || {},
    re = new RegExp(("." + ext + "$"));

  extend(compiler.parsers, parsers);

  // clone options
  options = assign({}, options);

  // drop properties not necessary for Riot comipler
  delete options.include;
  delete options.exclude;
  delete options.skip;
  delete options.ext;
  delete options.parsers;

  // `exclude` is reserved by rollup, so we use `skip` instead
  options.exclude = skip;

  return {
    transform: function transform (code, id) {
      if (!re.test(id)) { return null }
      if (!filter(id)) { return null }
      return frag + compiler.compile(code, options)
    }
  }
}

module.exports = riot;