'use strict';

/**
 * Posts controller for serving user posts.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    thunkify = require('thunkify'),
    glob = thunkify(require('glob'));

// register koa routes
exports.init = function (app) {
  app.use(route.post('/api/globground', executeGlob));
};


function *executeGlob() {

  var post = yield parse(this);
  var result = yield glob(post.pattern, {cwd: './sandbox'});

  this.status = 200;
  this.body = result;
}
