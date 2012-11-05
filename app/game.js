define(function(require) {
    
    var Navigator = require('navigator');
    var settings = require('settings');
    var Jukebox = require('jukebox');
    var UserInterface = require('userinterface');

    var Game = function() {};
    
    _.extend(Game.prototype, {

        initialize: function() {
            _.bindAll(this);
            this.navigator = new Navigator();
            this.jukebox = new Jukebox();
            this.jukebox.playFromJamendo(settings.SOUNDTRACK);
            this.root = this.navigator.root;
            this.userInterface = new UserInterface();
            addEvent(elm('main'), 'click', this.onClick);
            this.resetLoop();
        },

        onClick: function(event) {
            if(_.isObject(this.root)) {
                this.userInterface.onClick(event.x, (event.y - settings.CANVAS_TOP) * 2.0);
            }
        },

        resetLoop: function() {
            var that = this;
            _.delay(function() {
                that.onTick();
            }, settings.GAME_LOOP_PERIOD);
        },

        onTick: function() {
            this.navigator.update(settings.GAME_LOOP_PERIOD);
            this.userInterface.update(this.root);
            this.resetLoop();
        }

    });

    // Create and return the Game singleton
    var game = new Game();
    return game;
});