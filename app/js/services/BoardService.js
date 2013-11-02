'use strict';

angular.module('NumidiApp').service('boardService', ['settingsService', function(settingsService) {

  var self = this;

  self.settings = settingsService;
  self.started = false;
  self.win = false;
  self.grid = [];
  self.lastCoordinate = [];
  self.firstPick = undefined;

  function Tile(number, row, col) {
    this.number = number;
    this.coordinate = [];
    this.coordinate.row = row;
    this.coordinate.col = col;
    this.picked = false;
    this.solved = false;
  }

  self.resetGame = function() {
    self.started = false;
    self.win = false;
    self.grid = [];
    self.lastCoordinate = [];
    self.firstPick = undefined;
  }

  self.newGame = function() {
    self.resetGame();
    self.started = true;
    self.grid[0] = [];

    var lastNumber = -1;
    for (var col = 0; col < self.settings.width; col++) {
      do {
        var newNumber = Math.floor(Math.random() * 10)
      } while (lastNumber == newNumber || lastNumber + newNumber == 10);
      self.grid[0][col] = new Tile(newNumber, 0, col);
      lastNumber = newNumber;
    }
    self.grid[1] = [];
    for (var col = 0; col < self.settings.width; col++) {
      self.grid[1][col] = new Tile(col % 10, 1, col)
    }
    self.lastCoordinate = [];
    self.lastCoordinate.row = 1;
    self.lastCoordinate.col = self.settings.width - 1;
  }

  self.score = function() {
    return self.lastCoordinate.row * self.settings.width + self.lastCoordinate.col + 1
  }

  self.pickTile = function(tile) {
    if (tile.solved) {
      if (self.firstPick) {
        self.firstPick.picked = false;
        self.firstPick = undefined;
      }
    } else if (!self.firstPick) {
      tile.picked = true;
      self.firstPick = tile;
    } else {
      if (self.firstPick === tile) {
        tile.picked = false;
        self.firstPick = undefined;
      } else if ((self.firstPick.number == tile.number || self.firstPick.number + tile.number == 10)
       && isNeighbours(self.firstPick, tile)) {
        self.firstPick.picked = false;
        self.firstPick.solved = true;
        tile.picked = false;
        tile.solved = true;
        self.firstPick = undefined;
        self.win = isWin();
      } else {
        self.firstPick.picked = false;
        tile.picked = true;
        self.firstPick = tile;
      }
    }

    function isWin() {
      for (var row = 0; row <= self.lastCoordinate.row; row++) {
        for (var col = 0; col <= (row == self.lastCoordinate.row ? self.lastCoordinate.col : self.settings.width - 1); col++) {
          if (!self.grid[row][col].solved) {
            return false;
          }
        }
      }
      return true;
    }

    function isNeighbours(tile1, tile2) {
      return isRowNeighbours(tile1.coordinate, tile2.coordinate) ||
             isRowNeighbours(tile2.coordinate, tile1.coordinate) ||
             isColumnNeighbours(tile1.coordinate, tile2.coordinate) ||
             isDiagonalNeighbours(tile1.coordinate, tile2.coordinate);
    }

    function isRowNeighbours(c1, c2) {
      var nextCoordinate = getNextCoordinate(c1, true);
      if (nextCoordinate.row == c2.row && nextCoordinate.col == c2.col) {
        return true;
      }
      if (!self.grid[nextCoordinate.row][nextCoordinate.col].solved) {
        return false;
      }
      return isRowNeighbours(nextCoordinate, c2);
    }

    function isColumnNeighbours(c1, c2) {
      if (c1.col != c2.col) {
        return false;
      }
      for (var r = Math.min(c1.row, c2.row) + 1; r < Math.max(c1.row, c2.row); r++) {
        if (!self.grid[r][c1.col].solved) {
          return false;
        }
      }
      return true;
    }

    function isDiagonalNeighbours(c1, c2) {
      if (Math.abs(c1.row - c2.row) != Math.abs(c1.col - c2.col) || c1.row == c2.row) {
        return false;
      }
      var nextCoordinate = {row: c1.row > c2.row ? c1.row - 1 : c1.row + 1, col: c1.col > c2.col ? c1.col - 1 : c1.col + 1}
      if (nextCoordinate.row == c2.row && nextCoordinate.col == c2.col) {
        return true;
      }
      if (!self.grid[nextCoordinate.row][nextCoordinate.col].solved) {
        return false;
      }
      return isDiagonalNeighbours(nextCoordinate, c2);
    }
  }

  function getNextCoordinate(coordinate, wrap) {
    var nextCoordinate = {row: coordinate.row, col: coordinate.col};
    nextCoordinate.col += 1;
    if (nextCoordinate.col == self.settings.width) {
      nextCoordinate.col = 0;
      nextCoordinate.row += 1;
    }
    if (wrap && (nextCoordinate.row > self.lastCoordinate.row || (nextCoordinate.row == self.lastCoordinate.row && nextCoordinate.col > self.lastCoordinate.col))) {
      nextCoordinate.row = 0;
      nextCoordinate.col = 0;
    }
    return nextCoordinate;
  }
  
  self.deal = function() {
    var oldLastCoordinate = {row: self.lastCoordinate.row, col: self.lastCoordinate.col};
    for (var row = 0; row <= oldLastCoordinate.row; row++) {
      for (var col = 0; col <= (row == oldLastCoordinate.row ? oldLastCoordinate.col : self.settings.width - 1); col++) {
        if (!self.grid[row][col].solved) {
          self.lastCoordinate = getNextCoordinate(self.lastCoordinate, false);
          if (self.lastCoordinate.col == 0) {
            self.grid[self.lastCoordinate.row] = [];
          }
          self.grid[self.lastCoordinate.row][self.lastCoordinate.col] = new Tile(self.grid[row][col].number, self.lastCoordinate.row, self.lastCoordinate.col);
        }
      }
    }
  }
}]);
