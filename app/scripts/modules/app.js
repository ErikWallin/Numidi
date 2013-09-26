'use strict';

angular.module('NumidiApp', ['ui', 'ui.bootstrap', 'LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'BoardController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
