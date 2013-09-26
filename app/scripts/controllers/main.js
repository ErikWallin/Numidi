'use strict';

angular.module('NumidiApp')
.controller('BoardController', function ($scope, localStorageService) {

  function Tile(number, row, col) {
    this.number = number;
    this.coordinate = [];
    this.coordinate.row = row;
    this.coordinate.col = col;
    this.picked = false;
    this.solved = false;
  }

  $scope.width = 20;
  $scope.widths = [10, 15, 20, 25, 30];

  $scope.resetGame = function() {
    $scope.started = false;
    $scope.win = false;
    $scope.grid = [];
  }
  $scope.resetGame();

  $scope.newGame = function() {
    $scope.resetGame();
    $scope.started = true;
    $scope.grid[0] = [];

    var lastNumber = -1;
    for (var col = 0; col < $scope.width; col++) {
      do {
        var newNumber = Math.floor(Math.random() * 10)
      } while (lastNumber == newNumber || lastNumber + newNumber == 10);
      $scope.grid[0][col] = new Tile(newNumber, 0, col);
      lastNumber = newNumber;
    }
    $scope.grid[1] = [];
    for (var col = 0; col < $scope.width; col++) {
      $scope.grid[1][col] = new Tile(col % 10, 1, col)
    }
    $scope.lastCoordinate = [];
    $scope.lastCoordinate.row = 1;
    $scope.lastCoordinate.col = 19;
  }

  $scope.pickTile = function(tile) {
    if (tile.solved) {
      if ($scope.firstPick) {
        $scope.firstPick.picked = false;
        $scope.firstPick = undefined;
      }
      return;
    }

    if (!$scope.firstPick) {
      tile.picked = true;
      $scope.firstPick = tile;
    } else {
      if ($scope.firstPick === tile) {
        tile.picked = false;
        $scope.firstPick = undefined;
      } else if (($scope.firstPick.number == tile.number || $scope.firstPick.number + tile.number == 10)
       && isNeighbours($scope.firstPick, tile)) {
        $scope.firstPick.picked = false;
        $scope.firstPick.solved = true;
        tile.picked = false;
        tile.solved = true;
        $scope.firstPick = undefined;
        if (isWin()) {
          $scope.win = true;
        }
      } else {
        $scope.firstPick.picked = false;
        tile.picked = true;
        $scope.firstPick = tile;
      }
    }

    function isNeighbours(tile1, tile2) {

      function isRowNeighbours(c1, c2) {
        var nextCoordinate = getNextCoordinate(c1, true);
        if (nextCoordinate.row == c2.row && nextCoordinate.col == c2.col) {
          return true;
        }
        if ($scope.grid[nextCoordinate.row][nextCoordinate.col].solved == false) {
          return false;
        }
        return isRowNeighbours(nextCoordinate, c2);
      }

      function isColumnNeighbours(c1, c2) {
        if (c1.col != c2.col) {
          return false;
        }
        for (var r = Math.min(c1.row, c2.row) + 1; r < Math.max(c1.row, c2.row); r++) {
          if (!$scope.grid[r][c1.col].solved) {
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
        if (!$scope.grid[nextCoordinate.row][nextCoordinate.col].solved) {
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
      for (var row = 0; row <= $scope.lastCoordinate.row; row++) {
        for (var col = 0; col <= (row == $scope.lastCoordinate.row ? $scope.lastCoordinate.col : 19); col++) {
          if (!$scope.grid[row][col].solved) {
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
    if (nextCoordinate.col == $scope.width) {
      nextCoordinate.col = 0;
      nextCoordinate.row += 1;
    }
    if (wrap && (nextCoordinate.row > $scope.lastCoordinate.row || (nextCoordinate.row == $scope.lastCoordinate.row && nextCoordinate.col > $scope.lastCoordinate.col))) {
      nextCoordinate.row = 0;
    }
    return nextCoordinate;
  }
  
  $scope.deal = function() {
    var oldLastCoordinate = {row: $scope.lastCoordinate.row, col: $scope.lastCoordinate.col};
    for (var row = 0; row <= oldLastCoordinate.row; row++) {
      for (var col = 0; col <= (row == oldLastCoordinate.row ? oldLastCoordinate.col : $scope.width - 1); col++) {
        if (!$scope.grid[row][col].solved) {
          $scope.lastCoordinate = getNextCoordinate($scope.lastCoordinate, false);
          if ($scope.lastCoordinate.col == 0) {
            $scope.grid[$scope.lastCoordinate.row] = [];
          }
          $scope.grid[$scope.lastCoordinate.row][$scope.lastCoordinate.col] = new Tile($scope.grid[row][col].number, $scope.lastCoordinate.row, $scope.lastCoordinate.col);
        }
      }
    }
  }

  $scope.setWidth = function(width) {
    $scope.width = width;
  }

});