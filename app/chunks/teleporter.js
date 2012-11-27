/*global define*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        game = require('game/game'),
        Chunk = require('chunks/chunk'),
        Box2D = require('box2d'),
        fabric = require('fabric'),
        print = require('text!svg/teleporter.svg'),
        utils = require('core/utils'),
        dispatcher = require('core/dispatcher'),
        B2BodyDef = Box2D.Dynamics.b2BodyDef,
        B2Body = Box2D.Dynamics.b2Body,
        B2World = Box2D.Dynamics.b2World,
        B2Vec2 = Box2D.Common.Math.b2Vec2,
        B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        B2Fixture = Box2D.Dynamics.b2Fixture,
        B2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    function Teleporter(world, camera, pos, group) {
        this.init(world, camera, pos, group);
    }

    _.extend(Teleporter.prototype, Chunk.prototype);

    _.extend(Teleporter.prototype, {

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
            this.opacity = 1.0;
            this.increaser = 0.05;
            this.used = false;
        },

        render: function () {
            var that = this;
            fabric.loadSVGFromString(print, function (objects, o) {
                that.rect = new fabric.PathGroup(objects, o);
                that.group.add(that.rect);
                _.delay(that.animate, 100);
            });
        },

        animate: function () {
            var index = 0;
            this.opacity += this.increaser;
            if (this.opacity >= 1.0) {
                this.opacity = 0.9;
                this.increaser = -0.05;
            } else if (this.opacity <= 0.4) {
                this.opacity = 0.5;
                this.increaser = 0.05;
            }
            this.group.set({opacity: this.opacity});
            _.delay(this.animate, 100);
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
            dynamicBox.SetAsBox(0.5, 0.1);
            fixtureDef = new B2FixtureDef();
            fixtureDef.shape = dynamicBox;
            fixtureDef.density = 10000;
            fixtureDef.friction = 0.3;
            fixtureDef.restitution = 0;
            body.CreateFixture(fixtureDef);
            body.SetUserData(this);
            return body;
        },

        onCollision: function (other) {
            if (!_.isNull(other) && this.used === false && other.getName() === 'robot') {
                this.used = true;
                dispatcher.trigger('level:next');
            }
        },

        updatePos: function (delta) {
            var rootPoint = this.camera.getRootPoint({
                x: this.body.GetPosition().x,
                y: this.body.GetPosition().y + 1.4
            });
            this.rect.set({
                left: rootPoint.x,
                top: rootPoint.y,
                angle: this.normalRelativeAngle(this.body.GetAngle())
            });
            utils.setPathGroupRadius(this.rect, this.camera.getRootDistance(0.5));
        }

    });

    return Teleporter;
});