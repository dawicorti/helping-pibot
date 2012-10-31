define(function(require) {

    var game = require('game');

    var Camera = function(target, fieldWidth) {
        this.init(target, fieldWidth);
    };

    _.extend(Camera.prototype, {

        init: function(target, fieldWidth) {
            this.target = target;
            this.fieldWidth = fieldWidth;
        },

        getRootPoint: function(worldPoint) {
            /* 
                Calculate the root graphics point equivalent
                to the given world point
            */
            targetOffset = {
                x: this.getRootDistance(worldPoint.x - this.target.x),
                y: this.getRootDistance(this.target.y - worldPoint.y)
            }
            rootTargetPoint = {
                x: game.navigator.width() / 2.0,
                y: game.navigator.height() / 2.0
            }
            return {
                x: rootTargetPoint.x + targetOffset.x,
                y: rootTargetPoint.y + targetOffset.y
            }

        },

        getRootDistance: function(worldDistance) {
            return (worldDistance * game.navigator.width()) / this.fieldWidth
        }

    });

    return Camera;
});