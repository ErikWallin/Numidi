'use strict';

angular.module('NumidiApp', ['ui', 'ui.bootstrap', 'LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('game', function() {
    return new Game();
  });
