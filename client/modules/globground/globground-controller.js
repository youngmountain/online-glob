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

  api.globground.tree().success(function(posts) {
    $scope.dataForTheTree = posts.content;
  });

  // add post/comment creation functions to scope
  $scope.submitGlob = function($event) {
    // don't let the user type in blank lines or submit empty/whitespace only post, or type in something when post is being created
    if (!$scope.globPattern.length) {
      $event.preventDefault();
      return;
    }

    $location.search('glob', $scope.globPattern);
    $location.search('hidden', $scope.options.hidden);

    api.globground.create({
      pattern: $scope.globPattern,
      options: $scope.options
    })
      .success(function(result) {

        // Print out the globbing result
        $scope.globResult = result;

        // Highlight matches
        setSelectedClass($scope.dataForTheTree);
      })
      .error(function() {
        // don't clear the post box but enable it so the user can re-try
      });
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
