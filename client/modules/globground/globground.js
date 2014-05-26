'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('koan.globground', [
      'ngRoute',
      'koan.common',
      'treeControl'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: 'modules/globground/globground.html',
            controller: 'GlobgroundCtrl'
          });
    });
