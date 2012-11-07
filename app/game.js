/*global define,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),    
        Navigator = require('navigator'),
        settings = require('settings'),
        Jukebox = require('jukebox'),
        UserInterface = require('userinterface');

    function Game() {}

    _.extend(Game.prototype, {

        initialize: function () {
            _.bindAll(this);
            this.navigator = new Navigator();
            this.jukebox = new Jukebox();
            this.jukebox.playFromJamendo(settings.soundtrack);
            this.root = this.navigator.root;
            this.userInterface = new UserInterface();
            $(window).resize(this.onResize);
            $($('canvas')[1]).click(this.onClick);
            this.resetLoop();
        },

        onResize: function () {
            settings.resolution = [window.innerWidth, window.innerWidth / 3];
            this.root.setWidth(settings.resolution[0]);
            this.root.setHeight(settings.resolution[1]);
            this.root.calcOffset();
        },

        onClick: function (event) {
            if (_.isObject(this.root)) {
                console.log(event);
                this.userInterface.onClick(event.offsetX, event.offsetY);
            }
        },

        resetLoop: function () {
            var that = this;
            _.delay(function () {
                that.onTick();
            }, settings.gameLoopPeriod);
        },

        onTick: function () {
            this.resetLoop();
            this.navigator.update(settings.gameLoopPeriod);
            this.userInterface.update(this.root);
        }

    });

    // Create and return the Game singleton
    var game = new Game();
    return game;
});