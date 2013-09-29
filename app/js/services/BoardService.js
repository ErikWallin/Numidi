'use strict';

angular.module('NumidiApp').factory('boardService', function(settingsService) {

  var settings = settingsService;
  var started = false;
  var win = false;
  var grid = [];
  var lastCoordinate = [];
  var firstPick = undefined;

  function Tile(number, row, col) {
    this.number = number;
    this.coordinate = [];
    this.coordinate.row = row;
    this.coordinate.col = col;
    this.picked = false;
    this.solved = false;
  }

  var resetGame = function() {
    this.started = false;
    this.win = false;
    this.grid = [];
    this.lastCoordinate = [];
    this.firstPick = undefined;
  }

  var newGame = function() {
    this.resetGame();
    this.started = true;
    this.grid[0] = [];

    var lastNumber = -1;
    for (var col = 0; col < this.settings.width; col++) {
      do {
        var newNumber = Math.floor(Math.random() * 10)
      } while (lastNumber == newNumber || lastNumber + newNumber == 10);
      this.grid[0][col] = new Tile(newNumber, 0, col);
      lastNumber = newNumber;
    }
    this.grid[1] = [];
    for (var col = 0; col < this.settings.width; col++) {
      this.grid[1][col] = new Tile(col % 10, 1, col)
    }
    this.lastCoordinate = [];
    this.lastCoordinate.row = 1;
    this.lastCoordinate.col = this.settings.width - 1;
  }

  var pickTile = function(tile) {
    if (tile.solved) {
      if (this.firstPick) {
        this.firstPick.picked = false;
        this.firstPick = undefined;
      }
      return;
    }

    if (!this.firstPick) {
      tile.picked = true;
      this.firstPick = tile;
    } else {
      if (this.firstPick === tile) {
        tile.picked = false;
        this.firstPick = undefined;
      } else if ((this.firstPick.number == tile.number || this.firstPick.number + tile.number == 10)
       && this.isNeighbours(this.firstPick, tile)) {
        this.firstPick.picked = false;
        this.firstPick.solved = true;
        tile.picked = false;
        tile.solved = true;
        this.firstPick = undefined;
        this.win = this.isWin();
      } else {
        this.firstPick.picked = false;
        tile.picked = true;
        this.firstPick = tile;
      }
    }
  }

  var isNeighbours = function(tile1, tile2) {
    return this.isRowNeighbours(tile1.coordinate, tile2.coordinate) ||
           this.isRowNeighbours(tile2.coordinate, tile1.coordinate) ||
           this.isColumnNeighbours(tile1.coordinate, tile2.coordinate) ||
           this.isDiagonalNeighbours(tile1.coordinate, tile2.coordinate);
  }

  var isRowNeighbours = function(c1, c2) {
    var nextCoordinate = this.getNextCoordinate(c1, true);
    if (nextCoordinate.row == c2.row && nextCoordinate.col == c2.col) {
      return true;
    }
    if (this.grid[nextCoordinate.row][nextCoordinate.col].solved == false) {
      return false;
    }
    return this.isRowNeighbours(nextCoordinate, c2);
  }

  var isColumnNeighbours = function(c1, c2) {
    if (c1.col != c2.col) {
      return false;
    }
    for (var r = Math.min(c1.row, c2.row) + 1; r < Math.max(c1.row, c2.row); r++) {
      if (!this.grid[r][c1.col].solved) {
        return false;
      }
    }
    return true;
  }

  var isDiagonalNeighbours = function(c1, c2) {
    if (Math.abs(c1.row - c2.row) != Math.abs(c1.col - c2.col) || c1.row == c2.row) {
      return false;
    }
    var nextCoordinate = {row: c1.row > c2.row ? c1.row - 1 : c1.row + 1, col: c1.col > c2.col ? c1.col - 1 : c1.col + 1}
    if (nextCoordinate.row == c2.row && nextCoordinate.col == c2.col) {
      return true;
    }
    if (!this.grid[nextCoordinate.row][nextCoordinate.col].solved) {
      return false;
    }
    return this.isDiagonalNeighbours(nextCoordinate, c2);
  }

  var isWin = function() {
    for (var row = 0; row <= this.lastCoordinate.row; row++) {
      for (var col = 0; col <= (row == this.lastCoordinate.row ? this.lastCoordinate.col : this.settings.width - 1); col++) {
        if (!this.grid[row][col].solved) {
          return false;
        }
      }
    }
    return true;
  }

  var getNextCoordinate = function(coordinate, wrap) {
    var nextCoordinate = {row: coordinate.row, col: coordinate.col};
    nextCoordinate.col += 1;
    if (nextCoordinate.col == this.settings.width) {
      nextCoordinate.col = 0;
      nextCoordinate.row += 1;
    }
    if (wrap && (nextCoordinate.row > this.lastCoordinate.row || (nextCoordinate.row == this.lastCoordinate.row && nextCoordinate.col > this.lastCoordinate.col))) {
      nextCoordinate.row = 0;
      nextCoordinate.col = 0;
    }
    return nextCoordinate;
  }
  
  var deal = function() {
    var oldLastCoordinate = {row: this.lastCoordinate.row, col: this.lastCoordinate.col};
    for (var row = 0; row <= oldLastCoordinate.row; row++) {
      for (var col = 0; col <= (row == oldLastCoordinate.row ? oldLastCoordinate.col : this.settings.width - 1); col++) {
        if (!this.grid[row][col].solved) {
          this.lastCoordinate = this.getNextCoordinate(this.lastCoordinate, false);
          if (this.lastCoordinate.col == 0) {
            this.grid[this.lastCoordinate.row] = [];
          }
          this.grid[this.lastCoordinate.row][this.lastCoordinate.col] = new Tile(this.grid[row][col].number, this.lastCoordinate.row, this.lastCoordinate.col);
        }
      }
    }
  }

  return {
    started: started,
    win: win,
    grid: grid,
    lastCoordinate: lastCoordinate,
    firstPick: firstPick,

    settings: settings,
    resetGame: resetGame,
    newGame: newGame,
    pickTile: pickTile,
    isNeighbours: isNeighbours,
    isRowNeighbours: isRowNeighbours,
    isColumnNeighbours: isColumnNeighbours,
    isDiagonalNeighbours: isDiagonalNeighbours,
    isWin: isWin,
    getNextCoordinate: getNextCoordinate,
    deal: deal
  };
});
