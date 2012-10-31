define(function(require) {

    var game = require('game');
    var Chunk = require('chunk');

    // Box2D aliases
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    var StaticBox = function(world, camera, pos, group, options) {
        this.init(world, camera, pos, group, options)
    };

    _.extend(StaticBox.prototype, Chunk.prototype);

    _.extend(StaticBox.prototype, {

        init: function(world, camera, pos, group, options) {
            Chunk.prototype.init.call(
                this, world, camera,
                pos, group, this.createBody(world, pos, options)
            );
            this.options = options;
        },

        render: function() {
            var rootPoint = this.camera.getRootPoint(this.pos);
            this.rect = new fabric.Rect({
                left: rootPoint.x,
                top: rootPoint.y,
                width: this.camera.getRootDistance(this.options.width),
                height: this.camera.getRootDistance(this.options.height),
                fill: '#620e5d',
                stroke: '#4a1a47'
            });
            game.root.add(this.rect);
        },

        createBody: function(world, pos, options) {
            var bodyDef = new b2BodyDef();
            bodyDef.position.Set(pos.x, pos.y);
            var body = world.CreateBody(bodyDef);
            var box = new b2PolygonShape()
            box.SetAsBox(
                options.width / 2.0,
                options.height / 2.0
            );
            var fixtureDef = new b2FixtureDef();
            fixtureDef.shape = box;
            fixtureDef.density = 1;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.2;
            body.CreateFixture(fixtureDef);
            return body;
        },

        update: function() {
            this.render();
        }


    });

    return StaticBox;
});