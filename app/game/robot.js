/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        fabric = require('fabric'),
        Box2D = require('box2d'),
        game = require('game/game'),
        dispatcher = require('core/dispatcher'),
        Chunk = require('chunks/chunk'),
        robotWheelPrint = require('text!svg/robot_wheel.svg'),
        robotBoxPrint = require('text!svg/robot_box.svg'),
        B2BodyDef = Box2D.Dynamics.b2BodyDef,
        B2Body = Box2D.Dynamics.b2Body,
        B2World = Box2D.Dynamics.b2World,
        B2Vec2 = Box2D.Common.Math.b2Vec2,
        B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        B2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        B2Fixture = Box2D.Dynamics.b2Fixture,
        B2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        B2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;


    function Robot(world, camera, pos, group) {
        this.init(world, camera, pos, group);
    }

    _.extend(Robot.prototype, Chunk.prototype);

    _.extend(Robot.prototype, {

        init: function (world, camera, pos, group) {
            _.bindAll(this);
            Chunk.prototype.init.call(
                this,
                world,
                camera,
                pos,
                group,
                this.createBody(world, pos)
            );
            this.moving = false;
            this.createJoint();
            dispatcher.on('button:play:enable', this.onPlay);
            dispatcher.on('button:play:disable', this.onStop);
        },

        onPlay: function () {
            this.moving = true;
        },

        onStop: function () {
            this.moving = false;
            this.wheelBody.SetAngularVelocity(0);
        },

        createJoint: function () {
            var jointDef = new B2RevoluteJointDef();
            jointDef.bodyA = this.boxBody;
            jointDef.bodyB = this.wheelBody;
            jointDef.collideConnected = false;
            jointDef.localAnchorA.Set(0, -1);
            jointDef.localAnchorB.Set(0, 0.01);
            this.joint = this.world.CreateJoint(jointDef);
        },

        render: function () {
            this.renderRigidBox();
            this.renderWheel();
        },

        renderRigidBox: function () {
            var pos = this.boxBody.GetPosition(),
                rootPoint = this.camera.getRootPoint({
                    x: pos.x,
                    y: pos.y - 0.5
                }),
                rootSize = this.camera.getRootDistance(1),
                that = this;
            fabric.loadSVGFromString(robotBoxPrint, function (objects, o) {
                that.boxPrint = new fabric.PathGroup(objects, o);
                that.boxPrint.set({left: rootPoint.x, top: rootPoint.y});
                that.setPathGroupSize(that.boxPrint, rootSize, 2 * rootSize);
                that.group.add(that.boxPrint);
            });
        },

        renderWheel: function () {
            var pos = this.wheelBody.GetPosition(),
                rootPoint = this.camera.getRootPoint(pos),
                rootRadius = this.camera.getRootDistance(0.5),
                that = this;
            fabric.loadSVGFromString(robotWheelPrint, function (objects, o) {
                that.wheelPrint = new fabric.PathGroup(objects, o);
                that.wheelPrint.set({left: rootPoint.x, top: rootPoint.y});
                that.setPathGroupRadius(that.wheelPrint, rootRadius);
                that.group.add(that.wheelPrint);
            });
        },

        createWheelBody: function (world, pos) {
            var bodyDef = new B2BodyDef(),
                wheel = new B2CircleShape(0.5),
                fixtureDef = new B2FixtureDef();
            bodyDef.type = B2Body.b2_dynamicBody;
            bodyDef.position.Set(pos.x, pos.y - 0.5);
            this.wheelBody = world.CreateBody(bodyDef);
            fixtureDef.shape = wheel;
            fixtureDef.density = 8000;
            fixtureDef.friction = 1.0;
            fixtureDef.restitution = 0.1;
            this.wheelBody.CreateFixture(fixtureDef);
            this.wheelBody.SetUserData(this);
            return this.wheelBody;
        },

        getName: function () {
            return 'robot';
        },

        onCollision: function () {},

        createRigidBox: function (world, pos) {
            var bodyDef = new B2BodyDef(),
                dynamicBox = new B2PolygonShape(),
                fixtureDef = new B2FixtureDef();
            bodyDef.type = B2Body.b2_dynamicBody;
            bodyDef.position.Set(pos.x, pos.y + 0.5);
            this.boxBody = world.CreateBody(bodyDef);
            dynamicBox.SetAsBox(0.5, 0.5);
            fixtureDef.shape = dynamicBox;
            fixtureDef.density = 10000;
            fixtureDef.friction = 0.1;
            fixtureDef.restitution = 0.2;
            this.boxBody.CreateFixture(fixtureDef);
            this.boxBody.SetFixedRotation(true);
        },

        createBody: function (world, pos) {
            this.createRigidBox(world, pos);
            return this.createWheelBody(world, pos);
        },

        updatePos: function (delta) {
            if (this.moving) {
                this.wheelBody.SetAwake(true);
                this.wheelBody.SetAngularVelocity(-5.0);
            }
            this.pos = this.wheelBody.GetPosition();
            var rootPoint = {},
                rootSize = 0,
                rootRadius = 0;
            rootPoint = this.camera.getRootPoint({
                x: this.boxBody.GetPosition().x,
                y: this.boxBody.GetPosition().y - 0.5
            });
            rootSize = this.camera.getRootDistance(1);
            if (!_.isUndefined(this.boxPrint)) {
                this.boxPrint.set({
                    left: rootPoint.x,
                    top: rootPoint.y,
                });
                this.setPathGroupSize(this.boxPrint, rootSize, 2 * rootSize);
            }
            rootPoint = this.camera.getRootPoint(this.wheelBody.GetPosition());
            rootRadius = this.camera.getRootDistance(0.5);
            if (!_.isUndefined(this.wheelPrint)) {
                this.wheelPrint.set({
                    left: rootPoint.x,
                    top: rootPoint.y,
                    angle: this.normalRelativeAngle(this.wheelBody.GetAngle())
                });
                this.setPathGroupRadius(this.wheelPrint, rootRadius);
            }
        }

    });

    return Robot;
});