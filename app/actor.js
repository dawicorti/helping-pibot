define(['game'], function(game) {

    var Actor = function(world, camera, pos, group, body) {
        this.init(world, camera, pos, group, body);
    };

    _.extend(Actor.prototype, {

        init: function(world, camera, pos, group, body) {
            this.group = game.root.set();
            this.group.animate(camera.getRootPoint(pos), 1);
            group.push(this.group);
            this.camera = camera;
            this.pos = pos;
            this.body = body;
            this.body.GetPosition();
        },

        show: function() {
            this.group.show();
        },

        hide: function() {
            this.group.hide();
        },

        update: function(delta) {
            this.pos = this.body.GetPosition();
            var rootPoint = this.camera.getRootPoint(this.pos);
            var config = this.camera.getRootPoint(this.pos);
            var angle = -Math.floor((this.body.GetAngle() * 90) / Math.PI);
            config.transform = 'R' + angle + ',' + rootPoint.x + ',' + rootPoint.y; 
            this.group.animate(config, delta);
        }

    });

    return Actor;

});