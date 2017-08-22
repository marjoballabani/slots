var PluginError, through;

through = require('through2');

PluginError = require('gulp-util').PluginError;

module.exports = function(checks) {
  var stream;
  if (checks == null) {
    checks = {};
  }
  stream = through.obj(function(file, enc, cb) {
    var content, errors, msg, test;
    content = file.contents.toString();
    errors = [];
    for (msg in checks) {
      test = checks[msg];
      if (test(content)) {
        errors.push(msg);
      }
    }
    if (errors.length) {
      msg = "in file " + file.path + ":\n - " + (errors.join('\n - '));
      throw new PluginError('gulp-sniffer', msg);
    }
    this.push(file);
    return cb();
  });
  return stream;
};
