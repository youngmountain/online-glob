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
            title: 'KOAN Home',
            templateUrl: 'modules/globground/globground.html',
            controller: 'GlobgroundCtrl'
          });
    });
