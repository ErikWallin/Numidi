'use strict';

angular.module('NumidiApp').service('settingsService', function() {
  var self = this;

  self.width = 20;
  self.widths = [10, 15, 20, 25, 30];

  self.showUsedTiles = false;

  self.defaultName = 'Unknown';
  self.name = self.defaultName;
});
