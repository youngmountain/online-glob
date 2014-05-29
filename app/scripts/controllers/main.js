'use strict';

angular.module('globApp', ['angularBootstrapNavTree'])
  .controller('MainCtrl', function ($scope) {

    var data = [
      'README.md',
      'index.html',
      'src',
      'src/app.js',
      'src/data.js',
      'src/lib',
      'src/lib/angular.js',
      'img',
      'img/logo.png'
    ];

    $scope.tree_data = createTree(data);
  });

  function createTree(files) {
    var result = [];
    var lookupHelper = {};
    var fileList = createFileObject(files);

    fileList.forEach(function(file) {
        var item = {};
        item.label = file.name;
        item.data = file;

        if(file.parentPath) {
            var parentItem = lookupHelper[file.parentPath];
            if(!parentItem.children) {
              parentItem.children = [];
            }
            parentItem.children.push(item);
        } else {
            result.push(item);
        }
        lookupHelper[file.path] = item;
    });

    return result;
  }

  function createFileObject(files) {
    var result = [];
    files.forEach(function(file) {
      var item = {};
      var path = file.replace(/[^\/]*$/, '');
      if(path) {
        item.parentPath = path.slice(0,-1);
      }
      item.path = file;
      item.name = file.replace(/^.*[\\\/]/, '');
      result.push(item);
    });
    return result;
  }
