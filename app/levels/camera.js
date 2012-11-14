/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        game = require('game/game'),
        dispatcher = require('core/dispatcher');

    function Camera(target, fieldWidth) {
        this.init(target, fieldWidth);
    }

    _.extend(Camera.prototype, {

        velocity: 0.6,

        init: function (target, fieldWidth) {
            _.bindAll(this);
            this.target = target;
            this.fieldWidth = fieldWidth;
            this.lockedChunk = null;
            dispatcher.on('camera:move:left', this.onCameraLeftRequest);
            dispatcher.on('camera:move:right', this.onCameraRightRequest);
        },

        lock: function (chunk) {
            this.lockedChunk = chunk;
        },

        unlock: function () {
            this.lockedChunk = null;
        },

        onCameraLeftRequest: function () {
            this.target.x -= 0.3;
        },

        onCameraRightRequest: function () {
            this.target.x += 0.3;
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
            var sign = 1,
                distance = {};
            if (_.isObject(this.lockedChunk)) {
                distance = {
                    x: this.lockedChunk.pos.x - this.target.x,
                    y: this.lockedChunk.pos.y - this.target.y
                };
                if (Math.abs(distance.x) > this.velocity) {
                    sign = (distance.x && distance.x / Math.abs(distance.x));
                    distance.x = sign * this.velocity;
                }
                if (Math.abs(distance.y) > this.velocity) {
                    sign = (distance.y && distance.y / Math.abs(distance.y));
                    distance.y = sign * this.velocity;
                }
                this.target = {
                    x: this.target.x + distance.x,
                    y: this.target.y + distance.y
                };
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