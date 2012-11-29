/*global define,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        Navigator = require('game/navigator'),
        settings = require('core/settings'),
        UserInterface = require('game/userinterface'),
        dispatcher = require('core/dispatcher');

    function Game() {}

    _.extend(Game.prototype, {

        initialize: function () {
            var index = 0;
            _.bindAll(this);
            this.navigator = new Navigator();
            this.root = this.navigator.root;
            this.chunks = [];
            for (index = 0; index < 4; index += 1) {
                this.chunks.push('rigidbox');
            }
            this.userInterface = new UserInterface(this.chunks);
            $(window).resize(this.onResize);
            $($('canvas')[1]).click(this.onClick);
            $($('canvas')[1]).mousedown(this.onMouseDown);
            $($('canvas')[1]).mouseup(this.onMouseUp);
            this.resetLoop();
            dispatcher.on('get:game:chunks', this.sendGameChunks);
            dispatcher.on('droper:drop', this.onDroperDrop);
            dispatcher.on('chunk:clone', this.onCloneChunk);
            dispatcher.on('chunk:fork', this.onForkRequest);
            dispatcher.on('forker:fork', this.onForkerFork);
        },

        onForkerFork: function (event) {
            var chunkDef = event.data;
            this.userInterface.addChunk(this.chunks.length, chunkDef);
            this.chunks.push(chunkDef);
        },

        onForkRequest: function (event) {
            dispatcher.trigger('game:fork', {
                id: event.data,
                def: this.chunks[event.data]
            });
        },

        onClick: function (event) {
            if (_.isObject(this.root)) {
                this.userInterface.onClick(event.layerX, event.layerY);
            }
        },

        onMouseDown: function (event) {
            if (_.isObject(this.root)) {
                this.userInterface.onMouseDown(event.layerX, event.layerY);
            }
        },

        onMouseUp: function (event) {
            if (_.isObject(this.root)) {
                this.userInterface.onMouseUp(event.layerX, event.layerY);
            }
        },

        onCloneChunk: function (event) {
            var chunkDef = _.clone(this.chunks[event.data]);
            this.userInterface.cloneChunk(event.data, this.chunks.length, chunkDef);
            this.chunks.push(chunkDef);
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
            this.userInterface.removeChunk(event.data.id);
        },

        onResize: function () {
            settings.resolution = [window.innerWidth, window.innerWidth / 3];
            this.root.setWidth(settings.resolution[0]);
            this.root.setHeight(settings.resolution[1]);
            this.root.calcOffset();
        },

        resetLoop: function () {
            var that = this;
            window.webkitRequestAnimationFrame(
                _.throttle(
                    this.onTick,
                    settings.gameLoopPeriod
                )
            );
        },

        onTick: function () {
            this.navigator.update(settings.gameLoopPeriod);
            this.userInterface.update(this.root);
            this.resetLoop();
        }

    });

    // Create and return the Game singleton
    return new Game();
});