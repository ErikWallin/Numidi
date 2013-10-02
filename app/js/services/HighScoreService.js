'use strict';

angular.module('NumidiApp').service('highScoreService', function(localStorageService) {

  var self = this;
  
  self.localStorage = localStorageService;
  self.scores = self.localStorage.get('highscore') || {};//10: 1000, 15: 1000, 20: 134};

  self.addScore = function(width, score) {
    if (self.scores[width] == null || score < self.scores[width]) {
      self.scores[width] = score;
    }
    self.localStorage.set('highscore', self.scores);
  }

  self.hasScore = function() {
    return !(Object.keys(self.scores).length === 0);
  }
});
