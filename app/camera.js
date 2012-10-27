define(['game'], function(game) {

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
                y: -this.getRootDistance(worldPoint.y - this.target.y)
            }
            rootTargetPoint = {
                x: game.navigator.width() / 2,
                y: game.navigator.height() / 2
            }
            return {
                x: Math.floor(rootTargetPoint.x + targetOffset.x),
                y: Math.floor(rootTargetPoint.y + targetOffset.y)
            }

        },

        getRootDistance: function(worldDistance) {
            return (worldDistance * game.navigator.width()) / this.fieldWidth
        }

    });

    return Camera;
});