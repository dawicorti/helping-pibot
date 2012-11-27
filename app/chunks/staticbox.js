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

    function StaticBox(world, camera, pos, group, options) {
        this.init(world, camera, pos, group, options);
    }

    _.extend(StaticBox.prototype, Chunk.prototype);

    _.extend(StaticBox.prototype, {

        init: function (world, camera, pos, group, options) {
            Chunk.prototype.init.call(
                this,
                world,
                camera,
                pos,
                group,
                this.createBody(world, pos, options)
            );
            this.options = options;
        },

        render: function () {
            var rootPoint = this.camera.getRootPoint(this.pos);
            this.rect = new fabric.Rect({
                left: rootPoint.x,
                top: rootPoint.y,
                width: this.camera.getRootDistance(this.options.width),
                height: this.camera.getRootDistance(this.options.height),
                fill: '#620e5d',
                stroke: '#4a1a47'
            });
            this.group.add(this.rect);
        },

        createBody: function (world, pos, options) {
            var bodyDef = new B2BodyDef(),
                body = {},
                box = {},
                fixtureDef = {};
            bodyDef.position.Set(pos.x, pos.y);
            body = world.CreateBody(bodyDef);
            box = new B2PolygonShape();
            box.SetAsBox(
                options.width / 2.0,
                options.height / 2.0
            );
            fixtureDef = new B2FixtureDef();
            fixtureDef.shape = box;
            fixtureDef.density = 10000;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.01;
            body.CreateFixture(fixtureDef);
            return body;
        },

        updatePos: function (delta) {
            var rootPoint = this.camera.getRootPoint(this.pos);
            this.rect.set({
                left: rootPoint.x,
                top: rootPoint.y,
                width: this.camera.getRootDistance(this.options.width),
                height: this.camera.getRootDistance(this.options.height)
            });
        }

    });

    return StaticBox;
});