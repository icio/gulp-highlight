'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var cheerio = require('cheerio');
var hljs = require('highlight.js');
var _ = require('lodash');

var DEFAULTS = {
  cheerio: {
    decodeEntities: false
  }
};

module.exports = function (options) {
  var options = _.assign(DEFAULTS, options);
  var highlight = function (str, options) {
    var $ = cheerio.load(str, options.cheerio);
    $('code').each(function (index, code) {
      if (!$(code).hasClass('nohighlight')) {
        $(code).html(hljs.highlightAuto($(code).html()).value);
      }
    });
    return $.html() || str;
  };
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-highlight', 'Streaming not supported'));
      return cb();
    }

    try {
      file.contents = new Buffer(highlight(file.contents.toString(), options), options.buffer);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-highlight', err));
    }

    this.push(file);
    cb();
  });
};
