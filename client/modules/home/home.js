'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('koan.home', [
      'ngRoute',
      'koan.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/home', {
            title: 'KOAN Home',
            templateUrl: 'modules/home/home.html',
            controller: 'HomeCtrl'
          });
    });
