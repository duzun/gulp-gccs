var gccs = require("gccs");
var through = require("through2");
var PluginError = require("plugin-error");
var PLUGIN_NAME = "gulp-gccs";
function gulpGCCS(opt) {
  var options = Object.assign({}, opt || {});
  return through.obj(function(file, enc, cb) {
    var $jscomp$this = this;
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isBuffer()) {
      options.js_code = file.contents;
      gccs(options, function(error, code) {
        if (error) {
          $jscomp$this.emit("error", new PluginError(PLUGIN_NAME, error));
        } else {
          file.contents = Buffer.from(code, "utf8");
          cb(null, file);
        }
      });
      delete options.js_code;
    }
    if (file.isStream()) {
      var stream = through();
      options.out_file = stream;
      gccs.file(file.contents, options, function(error) {
        if (error) {
          $jscomp$this.emit("error", new PluginError(PLUGIN_NAME, error));
        }
      });
      delete options.out_file;
      file.contents = stream;
      cb(null, file);
    }
  });
}
module.exports = gulpGCCS;

