'use strict';

angular.module('NumidiApp')
  .controller('MainCtrl', function ($scope, game, localStorageService) {
    $scope.game = game;
  });
