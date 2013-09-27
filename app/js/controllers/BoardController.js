'use strict';

angular.module('NumidiApp').controller('BoardController', function ($scope, settingsService, boardService) {

  $scope.settings = settingsService;
  $scope.board = boardService;

  function Tile(number, row, col) {
    this.number = number;
    this.coordinate = [];
    this.coordinate.row = row;
    this.coordinate.col = col;
    this.picked = false;
    this.solved = false;
  }

  $scope.newGame = function() {
    $scope.board.resetGame();
    $scope.board.started = true;
    $scope.board.grid[0] = [];

    var lastNumber = -1;
    for (var col = 0; col < $scope.settings.width; col++) {
      do {
        var newNumber = Math.floor(Math.random() * 10)
      } while (lastNumber == newNumber || lastNumber + newNumber == 10);
      $scope.board.grid[0][col] = new Tile(newNumber, 0, col);
      lastNumber = newNumber;
    }
    $scope.board.grid[1] = [];
    for (var col = 0; col < $scope.settings.width; col++) {
      $scope.board.grid[1][col] = new Tile(col % 10, 1, col)
    }
    $scope.board.lastCoordinate = [];
    $scope.board.lastCoordinate.row = 1;
    $scope.board.lastCoordinate.col = $scope.settings.width - 1;
  }

  $scope.pickTile = function(tile) {
    if (tile.solved) {
      if ($scope.board.firstPick) {
        $scope.board.firstPick.picked = false;
        $scope.board.firstPick = undefined;
      }
      return;
    }

    if (!$scope.board.firstPick) {
      tile.picked = true;
      $scope.board.firstPick = tile;
    } else {
      if ($scope.board.firstPick === tile) {
        tile.picked = false;
        $scope.board.firstPick = undefined;
      } else if (($scope.board.firstPick.number == tile.number || $scope.board.firstPick.number + tile.number == 10)
       && isNeighbours($scope.board.firstPick, tile)) {
        $scope.board.firstPick.picked = false;
        $scope.board.firstPick.solved = true;
        tile.picked = false;
        tile.solved = true;
        $scope.board.firstPick = undefined;
        if (isWin()) {
          $scope.board.win = true;
        }
      } else {
        $scope.board.firstPick.picked = false;
        tile.picked = true;
        $scope.board.firstPick = tile;
      }
    }

    function isNeighbours(tile1, tile2) {

      function isRowNeighbours(c1, c2) {
        var nextCoordinate = getNextCoordinate(c1, true);
        if (nextCoordinate.row == c2.row && nextCoordinate.col == c2.col) {
          return true;
        }
        if ($scope.board.grid[nextCoordinate.row][nextCoordinate.col].solved == false) {
          return false;
        }
        return isRowNeighbours(nextCoordinate, c2);
      }

      function isColumnNeighbours(c1, c2) {
        if (c1.col != c2.col) {
          return false;
        }
        for (var r = Math.min(c1.row, c2.row) + 1; r < Math.max(c1.row, c2.row); r++) {
          if (!$scope.board.grid[r][c1.col].solved) {
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
        if (!$scope.board.grid[nextCoordinate.row][nextCoordinate.col].solved) {
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
      for (var row = 0; row <= $scope.board.lastCoordinate.row; row++) {
        for (var col = 0; col <= (row == $scope.board.lastCoordinate.row ? $scope.board.lastCoordinate.col : $scope.settings.width - 1); col++) {
          if (!$scope.board.grid[row][col].solved) {
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
    if (nextCoordinate.col == $scope.settings.width) {
      nextCoordinate.col = 0;
      nextCoordinate.row += 1;
    }
    if (wrap && (nextCoordinate.row > $scope.board.lastCoordinate.row || (nextCoordinate.row == $scope.board.lastCoordinate.row && nextCoordinate.col > $scope.board.lastCoordinate.col))) {
      nextCoordinate.row = 0;
    }
    return nextCoordinate;
  }
  
  $scope.deal = function() {
    var oldLastCoordinate = {row: $scope.board.lastCoordinate.row, col: $scope.board.lastCoordinate.col};
    for (var row = 0; row <= oldLastCoordinate.row; row++) {
      for (var col = 0; col <= (row == oldLastCoordinate.row ? oldLastCoordinate.col : $scope.settings.width - 1); col++) {
        if (!$scope.board.grid[row][col].solved) {
          $scope.board.lastCoordinate = getNextCoordinate($scope.board.lastCoordinate, false);
          if ($scope.board.lastCoordinate.col == 0) {
            $scope.board.grid[$scope.board.lastCoordinate.row] = [];
          }
          $scope.board.grid[$scope.board.lastCoordinate.row][$scope.board.lastCoordinate.col] = new Tile($scope.board.grid[row][col].number, $scope.board.lastCoordinate.row, $scope.board.lastCoordinate.col);
        }
      }
    }
  }
});
