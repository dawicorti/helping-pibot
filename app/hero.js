define(['game', 'actor'], function(game, Actor) {

    var Hero = function(world, camera, pos, group) {
        this.init(world, camera, pos, group);
    };

    _.extend(Hero.prototype, {

        init: function(world, camera, pos, group) {
            Actor.prototype.init.call(
                this, world, camera,
                pos, group, this.createBody(world, pos)
            );
            this.render();
        },

        render: function() {

        },

        createBody: function(world, pos) {
            var bodyDef = new b2BodyDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position.Set(pos.x, pos.y);
            var body = world.CreateBody(bodyDef);
            var dynamicBox = new b2PolygonShape();
            dynamicBox.SetAsBox(0.5, 0.5);
            var fixtureDef = new b2FixtureDef();
            fixtureDef.shape = dynamicBox;
            fixtureDef.density = 1;
            fixtureDef.friction = 0.3;
            body.CreateFixture(fixtureDef);
            return body;
        }

    });

    return Hero;
});