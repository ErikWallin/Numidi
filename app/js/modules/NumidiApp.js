'use strict';

angular.module('NumidiApp', ['ui', 'ui.bootstrap', 'LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html'
      }).
      when('/board', {
        controller: 'BoardController',
        templateUrl: 'views/board.html'
      }).
      when('/settings', {
        controller: 'SettingsController',
        templateUrl: 'views/settings.html'
      }).
      when('/highscore', {
        controller: 'HighScoreController',
        templateUrl: 'views/highscore.html'
      }).
      when('/rules', {
        templateUrl: 'views/rules.html'
      }).
      when('/about', {
        templateUrl: 'views/about.html'
      }).
      otherwise({
        redirectTo: '/board'
      });
  });
