/*global define*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        game = require('game/game'),
        Chunk = require('chunks/chunk'),
        Box2D = require('box2d'),
        fabric = require('fabric'),
        print = require('text!svg/switch.svg'),
        utils = require('core/utils'),
        dispatcher = require('core/dispatcher'),
        B2BodyDef = Box2D.Dynamics.b2BodyDef,
        B2Body = Box2D.Dynamics.b2Body,
        B2World = Box2D.Dynamics.b2World,
        B2Vec2 = Box2D.Common.Math.b2Vec2,
        B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        B2Fixture = Box2D.Dynamics.b2Fixture,
        B2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    function Switch(world, camera, pos, group, options) {
        this.init(world, camera, pos, group, options);
    }

    _.extend(Switch.prototype, Chunk.prototype);

    _.extend(Switch.prototype, {

        init: function (world, camera, pos, group, options) {
            Chunk.prototype.init.call(
                this,
                world,
                camera,
                pos,
                group,
                this.createBody(world, pos)
            );
            this.identity = options.identity;
            this.used = false;
        },

        getName: function () {
            return 'switch';
        },

        onCollision: function (other) {
            if (!_.isNull(other) && this.used === false) {
                console.log('switch on');
                this.group.set({opacity: 0.9});
                this.used = true;
                dispatcher.trigger('platform:move', this.identity);
            }
        },

        render: function () {
            var that = this;
            fabric.loadSVGFromString(print, function (objects, o) {
                that.rect = new fabric.PathGroup(objects, o);
                that.group.add(that.rect);
                that.group.set({opacity: 0.3});
            });
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
            body.SetUserData(this);
            return body;
        },

        updatePos: function (delta) {
            var rootPoint = this.camera.getRootPoint(this.body.GetPosition());
            this.rect.set({
                left: rootPoint.x,
                top: rootPoint.y,
                angle: this.normalRelativeAngle(this.body.GetAngle())
            });
            utils.setPathGroupRadius(this.rect, this.camera.getRootDistance(0.5));
        }

    });

    return Switch;
});