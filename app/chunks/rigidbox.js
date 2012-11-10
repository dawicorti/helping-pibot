/*global define*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        game = require('game/game'),
        Chunk = require('chunks/chunk'),
        Box2D = require('box2d'),
        fabric = require('fabric'),
        B2BodyDef = Box2D.Dynamics.b2BodyDef,
        B2Body = Box2D.Dynamics.b2Body,
        B2World = Box2D.Dynamics.b2World,
        B2Vec2 = Box2D.Common.Math.b2Vec2,
        B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        B2Fixture = Box2D.Dynamics.b2Fixture,
        B2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    function RigidBox(world, camera, pos, group) {
        this.init(world, camera, pos, group);
    }

    _.extend(RigidBox.prototype, Chunk.prototype);

    _.extend(RigidBox.prototype, {

        init: function (world, camera, pos, group) {
            Chunk.prototype.init.call(
                this,
                world,
                camera,
                pos,
                group,
                this.createBody(world, pos)
            );
        },

        render: function () {
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

        createBody: function (world, pos) {
            var bodyDef = new B2BodyDef(),
                body = {},
                dynamicBox = {},
                fixtureDef = {};
            bodyDef.type = B2Body.b2_dynamicBody;
            bodyDef.position.Set(pos.x, pos.y);
            body = world.CreateBody(bodyDef);
            dynamicBox = new B2PolygonShape();
            dynamicBox.SetAsBox(0.5, 0.5);
            fixtureDef = new B2FixtureDef();
            fixtureDef.shape = dynamicBox;
            fixtureDef.density = 10000;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.2;
            body.CreateFixture(fixtureDef);
            return body;
        },

        updatePos: function (delta) {
            var rootPoint = this.camera.getRootPoint(this.body.GetPosition());
            this.rect.set({
                left: rootPoint.x,
                top: rootPoint.y,
                width: this.camera.getRootDistance(1),
                height: this.camera.getRootDistance(1),
                angle: this.normalRelativeAngle(this.body.GetAngle())
            });
        }

    });

    return RigidBox;
});