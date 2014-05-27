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
  var rootPath = process.cwd() + '/sandbox/';

  var currentFolder = {
    name: dir,
    type: 'folder',
    path: dir,
    content: []
  };

  var files = fs.readdirSync(dir);

  for (var i in files) {
    if (!files.hasOwnProperty(i)) continue;
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      currentFolder.content.push({
        name: files[i],
        type: 'folder',
        path: name.split(rootPath)[1],
        content: getFiles(name).content
      });
    } else {
      currentFolder.content.push({
        name: files[i],
        path: name.split(rootPath)[1],
        type: 'file',
      });
    }
  }
  return currentFolder;
}