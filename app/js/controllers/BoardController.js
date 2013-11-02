'use strict';

angular.module('NumidiApp').controller('BoardController', function ($scope, $modal, boardService, settingsService, highScoreService) {
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

    function addHighScore(width, score) {
      $modal.open({
          templateUrl: 'name.html',
          scope: $scope,
          backdrop: 'static',
          windowClass: 'modal',
          controller: function ($scope, $modalInstance) {
              $scope.ok = function () {
                  $modalInstance.dismiss('ok');
                  $scope.highScore.addResult(width, $scope.settings.name, score);
              }
          }
      });
    }
  }
});
