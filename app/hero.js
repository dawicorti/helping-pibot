define(function(require) {

    var game = require('game');
    var Actor = require('actor');
    var drawRobot = require('generated/drawRobot');

    // Box2D aliases
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;


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
            this.group.push(drawRobot(game.root));
            this.group.attr({'transform': 's4'});
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