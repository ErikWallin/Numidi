'use strict';

angular.module('NumidiApp').service('highScoreService', function(localStorageService) {

  var self = this;
  self.version = 1;
  self.localStorage = localStorageService;

  self.results = self.localStorage.get('highscore') || {};

  updateStorage();
  
  self.addResult = function(width, name, score) {
    if (self.isHighScore(width, score)) {
      self.results[width] = {'name': name, 'score': score};
      self.localStorage.set('highscore', self.results);
    }
  }

  self.isHighScore = function(width, score) {
    return self.results[width] == null || score <= self.results[width].score;
  }

  self.hasScore = function() {
    return !(Object.keys(self.results).length === 0);
  }

  function updateStorage() {
    var currentVersion = self.localStorage.get('version') || 0;
    if (self.version > currentVersion) {
      self.localStorage.set('version', self.version);
      self.results = {};
      self.localStorage.set('highscore', self.results);
    }
  }
});
