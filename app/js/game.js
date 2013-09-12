'use strict';
/* Numidi Models and Business Logic */

function Tile(number) {
  this.number = number;
  this.picked = false;
  this.solved = false;
}

function Game() {

  this.newGame = function() {
    this.grid = [];
    
    this.grid[0] = [];
    for (var col = 0; col < 20; col++) {
      this.grid[0][col] = new Tile(Math.floor(Math.random() * 10));
    }
    this.grid[1] = [];
    for (var col = 0; col < 20; col++) {
      this.grid[1][col] = new Tile(col % 10)
    }
    this.lastRow = 1;
    this.lastCol = 19;
  }

  this.grid = [];

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
      } else if (this.firstPick.number == tile.number || this.firstPick.number + tile.number == 10) {
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
  }

  this.deal = function() {
    var oldLastRow = this.lastRow;
    var oldLastCol = this.lastCol;
    for (var row = 0; row <= oldLastRow; row++) {
      if (row == oldLastRow) {
        for (var col = 0; col <= oldLastCol; col++) {
          if (!this.grid[row][col].solved) {
            if (this.lastCol == 20 - 1) {
              this.lastCol = 0;
              this.lastRow += 1;
              this.grid[this.lastRow] = [];
            } else {
              this.lastCol += 1;
            }
            this.grid[this.lastRow][this.lastCol] = new Tile(this.grid[row][col].number);
          }
        }
      } else {
        for (var col = 0; col < 20; col++) {
          if (!this.grid[row][col].solved) {
            if (this.lastCol == 20 - 1) {
              this.lastCol = 0;
              this.lastRow += 1;
              this.grid[this.lastRow] = [];
            } else {
              this.lastCol += 1;
            }
            this.grid[this.lastRow][this.lastCol] = new Tile(this.grid[row][col].number);
          }
        }
      }
    }
  }
}


