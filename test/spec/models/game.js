'use strict';

describe('Model: Game', function () {

  var game;

  // Initialize the controller and a mock scope
  beforeEach(inject(function () {
    game = new Game();
  }));

  it('the game should have default width of 20', function () {
    expect(game.width).toBe(20);
  });

  it('the game should not start by default', function () {
    expect(game.started).toBe(false);
  });

  it('the game should not be finished by default', function () {
    expect(game.win).toBe(false);
  });
});
