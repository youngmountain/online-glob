'use strict';

/**
 * Top level module. Lists all the other modules as dependencies.
 */

angular
    .module('koan', [
      'ngRoute',
      'koan.common',
      'koan.home',
      'koan.profile',
      'koan.globground'
    ])

    .config(function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .otherwise({
            redirectTo: '/'
          });
    })

    .run(function ($location, $rootScope, $window, $route, api) {
      // attach commonly used info to root scope to be available to all controllers/views
      var common = $rootScope.common = $rootScope.common || {
        active: {}
      };

      // set actions to be taken each time the user navigates
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        // set page title
        $rootScope.common.title = current.$$route.title;

        // set active menu class for the left navigation (.sidenav)
        var currentCtrl = current.controller.substring(0, current.controller.indexOf('Ctrl')).toLowerCase();
        $rootScope.common.active[currentCtrl] = 'active';
        if (previous) {
          var previousCtrl = previous.controller.substring(0, previous.controller.indexOf('Ctrl')).toLowerCase();
          delete $rootScope.common.active[previousCtrl];
        }
      });
    });
