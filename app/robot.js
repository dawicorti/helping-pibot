define(function(require) {

    var game = require('game');
    var Chunk = require('chunk');
    var robotWheelPrint = require('text!svg/robot_wheel.svg');
    var robotBoxPrint = require('text!svg/robot_box.svg');

    // Box2D aliases
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;


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
            this.createJoint();
        },

        createJoint: function() {
            var jointDef = new b2RevoluteJointDef();
            jointDef.bodyA = this.boxBody;
            jointDef.bodyB = this.wheelBody;
            jointDef.collideConnected = false;
            jointDef.localAnchorA.Set(0, -1);
            jointDef.localAnchorB.Set(0, 0);
            this.joint = this.world.CreateJoint(jointDef);            
        },

        render: function() {
            this.renderRigidBox();
            this.renderWheel();
        },

        renderRigidBox: function() {
            var pos = this.boxBody.GetPosition();
            var rootPoint = this.camera.getRootPoint({
                x: pos.x, y: pos.y - 0.5 
            });
            var rootSize = this.camera.getRootDistance(1);
            var that = this;
            fabric.loadSVGFromString(robotBoxPrint, function(objects, o) {
                console.log('box print')
                that.boxPrint = new fabric.PathGroup(objects, o);
                that.boxPrint.set({left: rootPoint.x, top: rootPoint.y});
                that.setPathGroupSize(that.boxPrint, rootSize, 2 * rootSize);
                that.group.add(that.boxPrint);
            });            
        },

        renderWheel: function() {
            var pos = this.wheelBody.GetPosition();
            var rootPoint = this.camera.getRootPoint(pos);
            var rootRadius = this.camera.getRootDistance(0.5);
            var that = this;
            fabric.loadSVGFromString(robotWheelPrint, function(objects, o) {
                that.wheelPrint = new fabric.PathGroup(objects, o);
                that.wheelPrint.set({left: rootPoint.x, top: rootPoint.y})
                that.setPathGroupRadius(that.wheelPrint, rootRadius);
                that.group.add(that.wheelPrint);
            });            
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
            return this.wheelBody;
        },

        createRigidBox: function(world, pos) {
            var bodyDef = new b2BodyDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            bodyDef.position.Set(pos.x, pos.y + 0.5);
            this.boxBody = world.CreateBody(bodyDef);
            var dynamicBox = new b2PolygonShape();
            dynamicBox.SetAsBox(0.5, 0.5);
            var fixtureDef = new b2FixtureDef();
            fixtureDef.shape = dynamicBox;
            fixtureDef.density = 10000;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.2;
            this.boxBody.CreateFixture(fixtureDef);
            this.boxBody.SetFixedRotation(true);
        },

        createBody: function(world, pos) {
            this.createRigidBox(world, pos);
            return this.createWheelBody(world, pos);
        },

        updatePos: function(delta) {
            this.wheelBody.SetAngularVelocity(-10);
            this.pos = this.boxBody.GetPosition();
            var rootPoint = this.camera.getRootPoint({
                x: this.pos.x, y: this.pos.y - 0.5
            });
            if(!_.isUndefined(this.boxPrint)) {
                this.boxPrint.set({
                    left: rootPoint.x,
                    top: rootPoint.y,
                });
            }
            rootPoint = this.camera.getRootPoint(this.wheelBody.GetPosition());
            if(!_.isUndefined(this.wheelPrint)) {
                this.wheelPrint.set({
                    left: rootPoint.x,
                    top: rootPoint.y,
                    angle: this.normalRelativeAngle(this.wheelBody.GetAngle())
                });
            }
        }

    });

    return Robot;
});