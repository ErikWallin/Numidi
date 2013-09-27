'use strict';

angular.module('NumidiApp').controller('SettingsController', function ($scope, settingsService) {
  $scope.settings = settingsService;
});
