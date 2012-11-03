define(function() {

    var Chunk = function(world, camera, pos, group, body) {
        this.init(world, camera, pos, group, body);
    };

    _.extend(Chunk.prototype, {

        init: function(world, camera, pos, group, body) {
            this.group = new fabric.Group();
            this.camera = camera;
            this.world = world;
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

        updatePos: function(delta) {},

        update: function(delta, root) {
            this.updatePos(delta);
            root.add(this.group);
        }

    });

    return Chunk;

});