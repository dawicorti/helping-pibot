define(function(require) {

    var game = require('game');
    var Chunk = require('chunk');
    var robotPrint = require('text!svg/robot.svg');

    // Box2D aliases
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;


    var Robot = function(world, camera, pos, group) {
        this.init(world, camera, pos, group);
    };

    _.extend(Robot.prototype, Chunk.prototype);

    _.extend(Robot.prototype, {

        init: function(world, camera, pos, group) {
            Chunk.prototype.init.call(
                this, world, camera,
                pos, group, this.createBody(world, pos)
            );
            this.render();
        },

        render: function() {
            //game.root.importSVG(robotPrint, this.group);
            //this.group.attr('transform', 's0.5');
            var rootPoint = this.camera.getRootPoint(
                this.wheelBody.GetPosition()
            );
            var rootRadius = this.camera.getRootDistance(0.5);
            this.wheelPrint = game.root.circle(
                rootPoint.x, rootPoint.y, rootRadius
            );
            this.wheelPrint.attr('fill', '#ff6e49');
            //this.group.push(this.wheelPrint);
        },

        createWheelBody: function(world, pos) {
            var bodyDef = new b2BodyDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position.Set(pos.x, pos.y - 0.5);
            this.wheelBody = world.CreateBody(bodyDef);
            var wheel = new b2CircleShape(0.5);
            var fixtureDef = new b2FixtureDef();
            fixtureDef.shape = wheel;
            fixtureDef.density = 8000;
            fixtureDef.friction = 0.3;
            fixtureDef.restitution = 0.5
            this.wheelBody.CreateFixture(fixtureDef);
            this.wheelBody.SetLinearVelocity(new b2Vec2(3, 0));
            return this.wheelBody;
        },

        createBody: function(world, pos) {
            return this.createWheelBody(world, pos);
        },

        update: function(delta) {
            var wheelPos = this.wheelBody.GetPosition();
            var rootPoint = this.camera.getRootPoint(wheelPos);
            var angle = this.normalRelativeAngle(this.wheelBody.GetAngle());
            this.wheelPrint.animate({
                cx: rootPoint.x,
                cy: rootPoint.y,
                transform: 'r' + angle + ',' + rootPoint.x + ',' + rootPoint.y
            }, delta);
        }
    });

    return Robot;
});