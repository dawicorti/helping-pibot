/*global define*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        game = require('game/game'),
        Chunk = require('chunks/chunk'),
        dispatcher = require('core/dispatcher'),
        Box2D = require('box2d'),
        fabric = require('fabric'),
        B2BodyDef = Box2D.Dynamics.b2BodyDef,
        B2Body = Box2D.Dynamics.b2Body,
        B2World = Box2D.Dynamics.b2World,
        B2Vec2 = Box2D.Common.Math.b2Vec2,
        B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        B2Fixture = Box2D.Dynamics.b2Fixture,
        B2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    function Platform(world, camera, pos, group, options) {
        this.init(world, camera, pos, group, options);
    }

    _.extend(Platform.prototype, Chunk.prototype);

    _.extend(Platform.prototype, {

        init: function (world, camera, pos, group, options) {
            _.bindAll(this);
            Chunk.prototype.init.call(
                this,
                world,
                camera,
                pos,
                group,
                this.createBody(world, pos, options)
            );
            console.log(options);
            this.options = options;
            this.identity = options.identity;
            this.target = options.target;
            this.velocity = options.velocity;
            this.used = false;
            this.moving = false;
            dispatcher.on('platform:move', this.onPlatformMove);
        },

        onPlatformMove: function (event) {
            if (this.used === false && this.identity === event.data) {
                this.incX = (this.target.x - this.pos.x) * this.velocity;
                this.incY = (this.target.y - this.pos.y) * this.velocity;
                this.targetRect = {
                    x: this.target.x - this.velocity / 2.0,
                    y: this.target.y + this.velocity / 2.0,
                    width: this.velocity,
                    height: this.velocity
                };
                this.used = true;
                this.moving = true;
            }
        },

        destinationReached: function () {
            return (this.pos.x > this.targetRect.x
                && this.pos.x < this.targetRect.x + this.targetRect.width
                && this.pos.y < this.targetRect.y
                && this.pos.y > this.targetRect.y - this.targetRect.height);
        },

        render: function () {
            var rootPoint = this.camera.getRootPoint(this.pos);
            this.rect = new fabric.Rect({
                left: rootPoint.x,
                top: rootPoint.y,
                width: this.camera.getRootDistance(this.options.width),
                height: this.camera.getRootDistance(this.options.height),
                fill: '#CE3762',
                stroke: '#FF6E49'
            });
            this.group.add(this.rect);
        },

        createBody: function (world, pos, options) {
            var bodyDef = new B2BodyDef(),
                body = {},
                box = {},
                fixtureDef = {};
            bodyDef.type = B2Body.b2_kinematicBody;
            bodyDef.position.Set(pos.x, pos.y);
            body = world.CreateBody(bodyDef);
            box = new B2PolygonShape();
            box.SetAsBox(
                options.width / 2.0,
                options.height / 2.0
            );
            fixtureDef = new B2FixtureDef();
            fixtureDef.shape = box;
            body.CreateFixture(fixtureDef);
            body.SetLinearVelocity(new B2Vec2(0, 0));
            return body;
        },

        move: function () {
            this.body.SetAwake(true);
            this.body.SetLinearVelocity(new B2Vec2(this.incX, this.incY));
            if (this.destinationReached()) {
                this.moving = false;
                this.body.SetLinearVelocity(new B2Vec2(0, 0));
            }
        },

        updatePos: function (delta) {
            this.pos = this.body.GetPosition();
            if (this.moving) {
                this.move();
            }
            var rootPoint = this.camera.getRootPoint(this.pos);
            this.rect.set({
                left: rootPoint.x,
                top: rootPoint.y,
                width: this.camera.getRootDistance(this.options.width),
                height: this.camera.getRootDistance(this.options.height)
            });
        }

    });

    return Platform;
});