define(['game'], function(game) {

    var Chunk = function(world, camera, pos, group, body) {
        this.init(world, camera, pos, group, body);
    };

    _.extend(Chunk.prototype, {

        init: function(world, camera, pos, group, body) {
            this.group = game.root.set();
            this.group.animate(camera.getRootPoint(pos), 1);
            group.push(this.group);
            this.camera = camera;
            this.pos = pos;
            this.body = body;
            this.lastAngle = 0;
            this.bufferTr = {x: 0, y: 0};
            this.oldPoint = this.camera.getRootPoint(this.pos);
        },

        show: function() {
            this.group.show();
        },

        hide: function() {
            this.group.hide();
        },

        normalRelativeAngle: function(newAngle) {
            var radAngle = newAngle - this.lastAngle;
            this.lastAngle = newAngle;
            return -(radAngle * 180 / Math.PI);
        },

        update: function(delta) {
            this.pos = this.body.GetPosition();
            var rootPoint = this.camera.getRootPoint(this.pos);
            var angle = this.normalRelativeAngle(this.body.GetAngle());
            var transform = 'r' + angle + ',' + rootPoint.x + ',' + rootPoint.y;
            this.group.animate({transform: transform}, 1);
        }

    });

    return Chunk;

});