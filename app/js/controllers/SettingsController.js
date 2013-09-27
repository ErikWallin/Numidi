'use strict';

angular.module('NumidiApp').controller('SettingsController', function ($scope, settingsService, boardService) {
  $scope.settings = settingsService;
  $scope.board = boardService;
});
