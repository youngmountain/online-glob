'use strict';

/**
 * Service for providing access the backend API via HTTP and WebSockets.
 */

angular.module('koan.common').factory('api', function ($rootScope, $http, $window) {

  var apiBase = 'api' /* base /api uri */,
      api = {events: {}};

  api.globground = {
    create: function (pattern) {
      return $http({method: 'POST', url: apiBase + '/globground', data: pattern});
    },
    tree: function () {
      return $http({method: 'GET', url: apiBase + '/globground/tree'});
    },
  };

  return api;
});
