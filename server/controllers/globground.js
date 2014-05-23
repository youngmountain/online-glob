'use strict';

/**
 * Posts controller for serving user posts.
 */
var fs = require('fs');

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

  this.body = getFiles(process.cwd() + '/sandbox');
}

function * executeGlob() {

  var post = yield parse(this);
  var result = yield glob(post.pattern, {
    cwd: './sandbox',
    dot: post.options.hidden
  });

  this.status = 200;
  this.body = result;
}


function getFiles(dir) {
  var parentPath = process.cwd() + '/sandbox/';

  var currentFolder = {
    name: dir,
    type: 'folder',
    content: []
  };

  var files = fs.readdirSync(dir);

  for (var i in files) {
    if (!files.hasOwnProperty(i)) continue;
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      currentFolder.content.push({
        name: name.split(parentPath)[1],
        type: 'folder',
        content: getFiles(name).content
      });
    } else {
      currentFolder.content.push({
        name: name.split(parentPath)[1],
        type: 'file',
      });
    }
  }
  return currentFolder;
}