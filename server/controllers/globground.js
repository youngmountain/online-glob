'use strict';

/**
 * Posts controller for serving user posts.
 */

var route = require('koa-route'),
  parse = require('co-body'),
  thunkify = require('thunkify'),
  _ = require('lodash'),
  glob = thunkify(require('glob'));
// register koa routes
exports.init = function(app) {
  app.use(route.post('/api/globground', executeGlob));
  app.use(route.get('/api/globground/tree', sandboxTree));
};

function * sandboxTree() {

  var files = [{
    'name': 'img',
    'children': [{
      'name': 'logo.png',
      'children': []
    }, {
      'name': 'user.gif',
      'children': []
    }]
  }, {
    'name': 'index.js',
    'children': []
  }, {
    'name': 'package.json',
    'children': []
  }, {
    'name': 'src',
    'children': [{
      'name': 'user.js',
      'children': []
    }, {
      'name': 'utils.js',
      'children': []
    }]
  }, ];

  this.body = files;
}

function * executeGlob() {

  var post = yield parse(this);
  var result = yield glob(post.pattern, {
    cwd: './sandbox'
  });

  this.status = 200;
  this.body = result;
}

var fs = require('fs');
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push({
            name: file,
            children: []
          });
          next();
        }
      });
    })();
  });
};
