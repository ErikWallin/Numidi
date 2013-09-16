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

  this.newGame = function() {
    this.grid = [];
    
    this.grid[0] = [];
    var lastNumber = -1;
    for (var col = 0; col < 20; col++) {
      do {
        var newNumber = Math.floor(Math.random() * 10)
      } while (lastNumber == newNumber || lastNumber + newNumber == 10);
      this.grid[0][col] = new Tile(newNumber, 0, col);
      lastNumber = newNumber;
    }
    this.grid[1] = [];
    for (var col = 0; col < 20; col++) {
      this.grid[1][col] = new Tile(col % 10, 1, col)
    }
    this.lastCoordinate = [];
    this.lastCoordinate.row = 1;
    this.lastCoordinate.col = 19;
  }

  this.pickTile = function(tile) {

    // tile is valid to pick
    if (tile.solved) {
      if (this.firstPick) {
        this.firstPick.picked = false;
        this.firstPick = undefined;
      }
      return;
    }

    // none is picked before
    if (!this.firstPick) {
      tile.picked = true;
      this.firstPick = tile;
    } else {
      // one is picked before
      if (this.firstPick === tile) {
        // tile is already picked
        tile.picked = false;
        this.firstPick = undefined;
      } else if ((this.firstPick.number == tile.number || this.firstPick.number + tile.number == 10)
               && isNeighbours(this.firstPick, tile)) {
        // match for 10/same is successful
        this.firstPick.picked = false;
        this.firstPick.solved = true;
        tile.picked = false;
        tile.solved = true;
        this.firstPick = undefined;
      } else {
        // match not successful
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
        return false;
      }

      return isRowNeighbours(tile1.coordinate, tile2.coordinate)
            || isRowNeighbours(tile2.coordinate, tile1.coordinate)
            || isColumnNeighbours(tile1.coordinate, tile2.coordinate)
            || isDiagonalNeighbours(tile1.coordinate, tile2.coordinate);
    }
  }

  var getNextCoordinate = function(coordinate, wrap) {
    var nextCoordinate = coordinate;
    nextCoordinate.col += 1;
    if (nextCoordinate.col == 20) {
      nextCoordinate.col = 0;
      nextCoordinate.row += 1;
    }
    if (wrap && (nextCoordinate.row > self.lastCoordinate.row || (nextCoordinate.row == self.lastCoordinate.row && nextCoordinate.col > self.lastCoordinate.col))) {
      nextCoordinate.row = 0;
    }
    return nextCoordinate;
  }

  /*var getPreviousCoordinate = function(coordinate) {
    var nextCoordinate = coordinate;
    nextCoordinate.col -= 1;
    if (nextCoordinate.col < 0) {
      nextCoordinate.col = 20;
      nextCoordinate.row -= 1;
    }
    if (wrap && (nextCoordinate.row > self.lastCoordinate.row || (nextCoordinate.row == self.lastCoordinate.row && nextCoordinate.col > seld.lastCoordinate.col))) {
      nextCoordinate.row = 0;
    }
    return nextCoordinate;
  }*/

  /*0733700088*/
  
  this.deal = function() {
    var oldLastCoordinate = {row: this.lastCoordinate.row, col: this.lastCoordinate.col};
    for (var row = 0; row <= oldLastCoordinate.row; row++) {
      for (var col = 0; col <= (row == oldLastCoordinate.row ? oldLastCoordinate.col : 19); col++) {
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
}


