// through2 is a thin wrapper around node transform streams
const gccs = require('gccs');
const through = require('through2');
const PluginError = require('plugin-error');

// Consts
const PLUGIN_NAME = 'gulp-gccs';

// Plugin level function(dealing with files)
function gulpGCCS(opt) {

    const options = Object.assign({}, opt||{});

    // if (!prefixText) {
    //   throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
    // }

    // Creating a stream through which each file will pass
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }

        if (file.isBuffer()) {
            options.js_code = file.contents;
            gccs(options, (error, code) => {
                if ( error ) {
                    this.emit('error', new PluginError(PLUGIN_NAME, error));
                }
                else {
                    file.contents = Buffer.from(code, 'utf8');
                    cb(null, file);
                }
            });
            delete options.js_code;
        }

        if (file.isStream()) {
            var stream = through();
            options.out_file = stream;
            gccs.file(file.contents, options, (error) => {
                if ( error ) {
                    this.emit('error', new PluginError(PLUGIN_NAME, error));
                }
            });
            delete options.out_file;
            file.contents = stream;
            cb(null, file);
        }
    });

}

// Exporting the plugin main function
module.exports = gulpGCCS;
