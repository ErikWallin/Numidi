'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('NumidiApp'));

  var MainCtrl, scope, game;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    game = new Game();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      game: game
    });
  }));

  it('the game should be set', function () {
    expect(scope.game).toBe(game);
  });
});
