'use strict';

angular.module('NumidiApp').controller('BoardController', function ($scope, boardService) {
  $scope.board = boardService;
});
