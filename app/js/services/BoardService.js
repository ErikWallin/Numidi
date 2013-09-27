'use strict';

angular.module('NumidiApp').factory('boardService', function() {

  var started;
  var win;
  var grid;
  var lastCoordinate;
  var firstPick;

  var resetGame = function() {
    this.started = false;
    this.win = false;
    this.grid = [];
    this.lastCoordinate = [];
    this.firstPick = undefined;
  }

  return {
    started: started,
    win: win,
    grid: grid,
    lastCoordinate: lastCoordinate,
    firstPick: firstPick,
    resetGame: resetGame
  };
});