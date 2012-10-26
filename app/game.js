define(['navigator'], function(Navigator) {
    var Game = function() {

        this.initialize = function() {
            this.navigator = new Navigator();
        };

        _.bindAll(this);
    };

    // Create and return the Game singleton
    var game = new Game();
    return game;
});