/*global define,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        Navigator = require('game/navigator'),
        settings = require('core/settings'),
        Jukebox = require('game/jukebox'),
        UserInterface = require('game/userinterface'),
        dispatcher = require('core/dispatcher');

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
            this.chunks = ['rigidbox', 'rigidbox'];
            dispatcher.on('get:game:chunks', this.sendGameChunks);
            dispatcher.on('droper:drop', this.onDroperDrop);
            dispatcher.on('chunk:clone', this.onCloneChunk);
        },

        onCloneChunk: function (event) {
            this.chunks.push(event.data);
        },

        sendGameChunks: function () {
            dispatcher.trigger('send:game:chunks', _.clone(this.chunks));
        },

        onDroperDrop: function (event) {
            dispatcher.trigger('game:drop', {
                type: this.chunks[event.data.id],
                pos: event.data.pos
            });
            this.chunks.splice(event.data.id, 1);
        },

        onResize: function () {
            settings.resolution = [window.innerWidth, window.innerWidth / 3];
            this.root.setWidth(settings.resolution[0]);
            this.root.setHeight(settings.resolution[1]);
            this.root.calcOffset();
        },

        onClick: function (event) {
            if (_.isObject(this.root)) {
                this.userInterface.onClick(event.layerX, event.layerY);
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
    return new Game();
});