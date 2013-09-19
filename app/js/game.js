'use strict';
/* Numidi Models and Business Logic */

function Tile(number, row, col) {
  this.number = number;
  this.coordinate = [];
  this.coordinate.row = row;
  this.coordinate.col = col;
  this.picked = false;
  this.solved = false;
}

function Game() {

  var self = this;

  this.grid = [];
  this.win = false;
  this.started = false;
  this.width = 20;
  this.widths = [10, 15, 20, 25, 30];

  this.newGame = function() {
    this.grid = [];
    this.started = true;
    this.win = false;
    
    this.grid[0] = [];
    var lastNumber = -1;
    for (var col = 0; col < this.width; col++) {
      do {
        var newNumber = Math.floor(Math.random() * 10)
      } while (lastNumber == newNumber || lastNumber + newNumber == 10);
      this.grid[0][col] = new Tile(newNumber, 0, col);
      lastNumber = newNumber;
    }
    this.grid[1] = [];
    for (var col = 0; col < this.width; col++) {
      this.grid[1][col] = new Tile(col % 10, 1, col)
    }
    this.lastCoordinate = [];
    this.lastCoordinate.row = 1;
    this.lastCoordinate.col = 19;
  }

  this.pickTile = function(tile) {
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
               && isNeighbours(this.firstPick, tile)) {
        this.firstPick.picked = false;
        this.firstPick.solved = true;
        tile.picked = false;
        tile.solved = true;
        this.firstPick = undefined;
        if (isWin()) {
          this.win = true;
        }
      } else {
        this.firstPick.picked = false;
        tile.picked = true;
        this.firstPick = tile;
      }
    }

    function isNeighbours(tile1, tile2) {

      function isRowNeighbours(c1, c2) {
        var nextCoordinate = getNextCoordinate(c1, true);
        if (nextCoordinate.row == c2.row && nextCoordinate.col == c2.col) {
          return true;
        }
        if (self.grid[nextCoordinate.row][nextCoordinate.col].solved == false) {
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

      return isRowNeighbours(tile1.coordinate, tile2.coordinate)
            || isRowNeighbours(tile2.coordinate, tile1.coordinate)
            || isColumnNeighbours(tile1.coordinate, tile2.coordinate)
            || isDiagonalNeighbours(tile1.coordinate, tile2.coordinate);
    }

    function isWin() {
      for (var row = 0; row <= self.lastCoordinate.row; row++) {
        for (var col = 0; col <= (row == self.lastCoordinate.row ? self.lastCoordinate.col : 19); col++) {
          if (!self.grid[row][col].solved) {
            return false;
          }
        }
      }
      return true;
    }
  }

  var getNextCoordinate = function(coordinate, wrap) {
    var nextCoordinate = {row: coordinate.row, col: coordinate.col};
    nextCoordinate.col += 1;
    if (nextCoordinate.col == self.width) {
      nextCoordinate.col = 0;
      nextCoordinate.row += 1;
    }
    if (wrap && (nextCoordinate.row > self.lastCoordinate.row || (nextCoordinate.row == self.lastCoordinate.row && nextCoordinate.col > self.lastCoordinate.col))) {
      nextCoordinate.row = 0;
    }
    return nextCoordinate;
  }
  
  this.deal = function() {
    var oldLastCoordinate = {row: this.lastCoordinate.row, col: this.lastCoordinate.col};
    for (var row = 0; row <= oldLastCoordinate.row; row++) {
      for (var col = 0; col <= (row == oldLastCoordinate.row ? oldLastCoordinate.col : self.width - 1); col++) {
        if (!this.grid[row][col].solved) {
          this.lastCoordinate = getNextCoordinate(this.lastCoordinate, false);
          if (this.lastCoordinate.col == 0) {
            this.grid[this.lastCoordinate.row] = [];
          }
          this.grid[this.lastCoordinate.row][this.lastCoordinate.col] = new Tile(this.grid[row][col].number, this.lastCoordinate.row, this.lastCoordinate.col);
        }
      }
    }
  }

  this.setWidth = function(width) {
    self.width = width;
  }
}


