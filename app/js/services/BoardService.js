'use strict';

angular.module('NumidiApp').factory('boardService', function() {
  return {
    started: false,
    win: false,
    grid: [],
    lastCoordinate: [],
    firstPick: undefined
  };
});