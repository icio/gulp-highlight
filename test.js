'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var highlight = require('./index');

it('should highlight', function(cb) {
  var stream = highlight();

  stream.on('data', function(file) {
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), '<code class="hljs">* { <span class="hljs-attribute">box-sizing</span>: border-box }</code>');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('<code>* { box-sizing: border-box }</code>')
  }));

  stream.end();
});

it('should not highlight', function(cb) {
  var stream = highlight();

  stream.on('data', function(file) {
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), '<code class="nohighlight">* { box-sizing: border-box }</code>');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('<code class="nohighlight">* { box-sizing: border-box }</code>')
  }));

  stream.end();
});

it('should highlight html', function(cb) {
  var stream = highlight();

  stream.on('data', function(file) {
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), '<code class="hljs">&lt;<span class="hljs-keyword">div</span>&gt;html&lt;/<span class="hljs-keyword">div</span>&gt;</code>');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('<code><div>html</div></code>')
  }));

  stream.end();
});

it('should not HTML encode quotations', function(cb) {
  var stream = highlight();

  stream.on('data', function(file) {
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), '<code class="json hljs"><span class="hljs-string">"dependencies"</span>: { <span class="hljs-string">"gulp-highlight"</span>: <span class="hljs-string">"^1.0.0"</span> }</code>');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('<code class="json">"dependencies": { "gulp-highlight": "^1.0.0" }</code>')
  }));

  stream.end();
});

it('should highlight the custom selector only', function(cb) {
  var stream = highlight({
    selector: 'pre code'
  });

  stream.on('data', function(file) {
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), '<code class="css">* { box-sizing: border-box }</code><pre><code class="css hljs">* { <span class="hljs-attribute">box-sizing</span>: border-box }</code></pre>');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('<code class="css">* { box-sizing: border-box }</code><pre><code class="css">* { box-sizing: border-box }</code></pre>')
  }));

  stream.end();
});

it('should ignore a custom class', function(cb) {
  var stream = new highlight({
    ignoreClass: 'ignore-this'
  });

  stream.on('data', function(file) {
    assert.equal(file.relative, 'file.ext');
    assert.equal(file.contents.toString(), '<code class="css ignore-this">* { box-sizing: border-box }</code><code class="css hljs">* { <span class="hljs-attribute">box-sizing</span>: border-box }</code>');
  });

  stream.on('end', cb);

  stream.write(new gutil.File({
    base: __dirname,
    path: 'file.ext',
    contents: new Buffer('<code class="css ignore-this">* { box-sizing: border-box }</code><code class="css">* { box-sizing: border-box }</code>')
  }));

  stream.end();
});
