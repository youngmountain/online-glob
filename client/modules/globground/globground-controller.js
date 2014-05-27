'use strict';

/**
 * Home controller simply lists all the posts from everyone on the front page.
 */

angular.module('koan.globground').controller('GlobgroundCtrl', function($scope, api, $location) {

  // var user = $scope.common.user;

  $scope.globPattern = $location.search().glob || '**/*.js';
  $scope.options = {
    hidden: $location.search().hidden || true
  };

  $scope.dataForTheTree = [{
      "name": ".DS_Store",
      "path": ".DS_Store",
      "type": "file"
  }, {
      "name": ".hiddenfile",
      "path": ".hiddenfile",
      "type": "file"
  }, {
      "name": "img",
      "type": "folder",
      "path": "img",
      "content": [{
          "name": ".DS_Store",
          "path": "img/.DS_Store",
          "type": "file"
      }, {
          "name": "logo.png",
          "path": "img/logo.png",
          "type": "file"
      }, {
          "name": "user.gif",
          "path": "img/user.gif",
          "type": "file"
      }]
  }, {
      "name": "index.js",
      "path": "index.js",
      "type": "file"
  }, {
      "name": "cli.js",
      "path": "cli.js",
      "type": "file"
  }, {
      "name": "package.json",
      "path": "package.json",
      "type": "file"
  }, {
      "name": "src",
      "type": "folder",
      "path": "src",
      "content": [{
          "name": ".DS_Store",
          "path": "src/.DS_Store",
          "type": "file"
      }, {
          "name": "user.js",
          "path": "src/user.js",
          "type": "file"
      }, {
          "name": "utils.js",
          "path": "src/utils.js",
          "type": "file"
      }]
  }];

  // add post/comment creation functions to scope
  $scope.submitGlob = function($event) {
    // don't let the user type in blank lines or submit empty/whitespace only post, or type in something when post is being created
    if (!$scope.globPattern.length) {
      $event.preventDefault();
      return;
    }

    $location.search('glob', $scope.globPattern);
    $location.search('hidden', $scope.options.hidden);

    var flattenFileTree = function(data) {
      var result = [];
      data.forEach(function(item) {
        result.push(item.path);
        if(item.content) {
          result = result.concat(flattenFileTree(item.content));
        }
      });
      return result;
    }
    var files = flattenFileTree($scope.dataForTheTree);
    $scope.globResult =  minimatch.match(files, $scope.globPattern, $scope.options);
    setSelectedClass($scope.dataForTheTree);
  };

  function setSelectedClass(data) {

    data.forEach(function(item) {

      var matchItem = _.findWhere($scope.globResult, function(globItem) {
        return globItem == item.path;
      });

      if(matchItem) {
        item.isSelected = 'selected';
      } else {
        item.isSelected = 'ignore';
      }

      if(item.content) {
        setSelectedClass(item.content);
      }
    });
  }
});
