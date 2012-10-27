define(['game', 'actor'], function(game, Actor) {

    // Box2D aliases
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    var StaticBox = function(world, camera, pos, group, size) {
        this.init(world, camera, pos, group, size)
    };

    _.extend(StaticBox.prototype, Actor.prototype);

    _.extend(StaticBox.prototype, {

        init: function(world, camera, pos, group, size) {
            Actor.prototype.init.call(
                this, world, camera,
                pos, group, this.createBody(world, pos, size)
            );
            this.size = size;
            this.render();
        },

        render: function() {
            var rootPoint = this.camera.getRootPoint({
                x: this.pos.x - this.size.width / 2.0,
                y: this.pos.y + this.size.height / 2.0
            });
            this.rect = game.root.rect(
                rootPoint.x, rootPoint.y,
                this.camera.getRootDistance(this.size.width),
                this.camera.getRootDistance(this.size.height)
            );
            this.rect.attr('fill', '#620e5d');
            this.group.push(this.rect);
        },

        createBody: function(world, pos, size) {
            var bodyDef = new b2BodyDef();
            bodyDef.position.Set(pos.x, pos.y);
            var body = world.CreateBody(bodyDef);
            var box = new b2PolygonShape();
            box.SetAsBox(
                size.width / 2.0,
                size.height / 2.0
            );
            var fixtureDef = new b2FixtureDef();
            fixtureDef.shape = box;
            fixtureDef.density = 1;
            fixtureDef.friction = 1;
            body.CreateFixture(fixtureDef);
            return body;
        }

    });

    return StaticBox;
});