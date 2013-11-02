'use strict';

angular.module('NumidiApp').controller('BoardController', ['$scope', '$modal', 'boardService', 'settingsService', 'highScoreService', function ($scope, $modal, boardService, settingsService, highScoreService) {
  $scope.board = boardService;
  $scope.settings = settingsService;
  $scope.highScore = highScoreService;

  $scope.pickTile = function(tile) {
    $scope.board.pickTile(tile);
    var width = $scope.settings.width;
    var score = $scope.board.score();
    if ($scope.board.win && $scope.highScore.isHighScore(width, score)) {
      addHighScore(width, score);
    }
  }

  function addHighScore(width, score) {
    $modal.open({
      templateUrl: 'name.html',
      backdrop: 'static',
      windowClass: 'modal',
      scope: $scope,
      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
        $scope.ok = function () {
          $scope.highScore.addResult(width, $scope.settings.name, score);
          $modalInstance.close($scope.settings.name);
        }
      }]
    });
  }
}]);
