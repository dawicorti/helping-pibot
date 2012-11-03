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

    var RigidBox = function(world, camera, pos, group) {
        this.init(world, camera, pos, group)
    };

    _.extend(RigidBox.prototype, Chunk.prototype);

    _.extend(RigidBox.prototype, {

        init: function(world, camera, pos, group) {
            Chunk.prototype.init.call(
                this, world, camera,
                pos, group, this.createBody(world, pos)
            );
        },

        render: function() {
            var rootPoint = this.camera.getRootPoint(this.pos);
            this.rect = new fabric.Rect({
                left: rootPoint.x,
                top: rootPoint.y,
                width: this.camera.getRootDistance(1),
                height: this.camera.getRootDistance(1),
                fill: '#ff6e49',
                stroke: '#a63518'
            });
            this.group.add(this.rect);
        },

        createBody: function(world, pos) {
            var bodyDef = new b2BodyDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position.Set(pos.x, pos.y);
            var body = world.CreateBody(bodyDef);
            var dynamicBox = new b2PolygonShape();
            console.log()
            dynamicBox.SetAsBox(0.5, 0.5);
            var fixtureDef = new b2FixtureDef();
            fixtureDef.shape = dynamicBox;
            fixtureDef.density = 10000;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.2;
            body.CreateFixture(fixtureDef);
            return body;
        },

        updatePos: function(delta) {
            var rootPoint = this.camera.getRootPoint(this.body.GetPosition());
            this.rect.set({left: rootPoint.x, top: rootPoint.y});
        }

    });

    return RigidBox;
});