'use strict';
/* App Controllers */

var numidiApp = angular.module('numidiApp', ['ui.bootstrap']);

numidiApp.factory('game', function() {
  return new Game();
});


numidiApp.controller('GameCtrl', function GameCtrl($scope, game) {
  $scope.game = game;
});

