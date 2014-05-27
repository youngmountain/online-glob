'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('koan.globground', [
      'ngRoute',
      'koan.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/:glob?', {
            templateUrl: 'modules/globground/globground.html',
            controller: 'GlobgroundCtrl',
            reloadOnSearch: false
          });
    });
