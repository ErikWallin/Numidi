'use strict';

angular.module('NumidiApp').service('highScoreService', function(localStorageService) {

  var self = this;
  
  self.localStorage = localStorageService;
  self.scores = self.localStorage.get('highscore') || {10: [1000], 15: [1000], 20: [134]};

  self.addScore = function(width, result) {
    self.scores.set(width, result);
  }
});
