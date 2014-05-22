'use strict';

/**
 * Home controller simply lists all the posts from everyone on the front page.
 */

angular.module('koan.globground').controller('GlobgroundCtrl', function ($scope, api) {

  var user = $scope.common.user;

  $scope.globPattern = '*.js';


  // add post/comment creation functions to scope
  $scope.createPost = function ($event) {
    // don't let the user type in blank lines or submit empty/whitespace only post, or type in something when post is being created
    if (!$scope.globPattern.length) {
      $event.preventDefault();
      return;
    }

    api.globground.create({pattern: $scope.globPattern})
        .success(function (result) {

          // Print out the globbing result
          $scope.globResult = result;

        })
        .error(function () {
          // don't clear the post box but enable it so the user can re-try
        });
  };
  
});
