'use strict';

angular.module('NumidiApp').controller('HighScoreController', function ($scope, settingsService, highScoreService) {
  $scope.settings = settingsService;
  $scope.highScore = highScoreService;
});
