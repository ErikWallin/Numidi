'use strict';

angular.module('NumidiApp').controller('BoardController', function ($scope, $modal, boardService, highScoreService) {
  $scope.board = boardService;
  $scope.highScore = highScoreService;

  $scope.pickTile = function(tile) {
    $scope.board.pickTile(tile);
    var width = $scope.board.settings.width;
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
                  $scope.highScore.addResult(width, $scope.board.settings.name, score);
              }
          }
      });
    }
  }
});
