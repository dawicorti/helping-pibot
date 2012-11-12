/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        game = require('game/game');

    function Camera(target, fieldWidth) {
        this.init(target, fieldWidth);
    }

    _.extend(Camera.prototype, {

        init: function (target, fieldWidth) {
            this.target = target;
            this.fieldWidth = fieldWidth;
            this.lockedChunk = null;
        },

        lock: function (chunk) {
            this.lockedChunk = chunk;
        },

        unlock: function () {
            this.lockedChunk = null;
        },

        getRootPoint: function (worldPoint) {
            /* 
                Calculate the root graphics point equivalent
                to the given world point
            */
            var targetOffset = {
                    x: this.getRootDistance(worldPoint.x - this.target.x),
                    y: this.getRootDistance(this.target.y - worldPoint.y)
                },
                rootTargetPoint = {
                    x: game.navigator.width() / 2.0,
                    y: game.navigator.height() / 2.0
                };
            return {
                x: rootTargetPoint.x + targetOffset.x,
                y: rootTargetPoint.y + targetOffset.y
            };
        },

        getRootDistance: function (worldDistance) {
            return (worldDistance * game.navigator.width()) / this.fieldWidth;
        },

        getWorldPoint: function (rootPoint) {
            var rootTargetPoint = {
                    x: game.navigator.width() / 2.0,
                    y: game.navigator.height() / 2.0
                },
                targetOffset = {
                    x: this.getWorldDistance(rootPoint.x - rootTargetPoint.x),
                    y: this.getWorldDistance(rootTargetPoint.y - rootPoint.y)
                };
            return {
                x: this.target.x + targetOffset.x,
                y: this.target.y + targetOffset.y
            };
        },

        getWorldDistance: function (rootDistance) {
            return ((rootDistance * this.fieldWidth) / game.navigator.width());
        },

        update: function () {
            if (_.isObject(this.lockedChunk)) {
                this.target = _.clone(this.lockedChunk.pos);
            }
            if (this.target.x - this.fieldWidth / 2 <= 0) {
                this.target.x = this.fieldWidth / 2;
            }
            if (this.target.y <= 0) {
                this.target.y = 0;
            }
        }

    });

    return Camera;
});