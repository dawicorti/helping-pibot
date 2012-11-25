/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var fabric = require('fabric'),
        _ = require('underscore'),
        Box2D = require('box2d'),
        Chunk = require('chunks/chunk'),
        B2Vec2 = Box2D.Common.Math.b2Vec2,
        B2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

    function MultiChunk(world, camera, pos, group, Type, slots) {
        this.init(world, camera, pos, group, Type, slots);
    }

    _.extend(MultiChunk.prototype, Chunk.prototype);

    _.extend(MultiChunk.prototype, {

        init: function (world, camera, pos, group, Type, slots) {
            _.bindAll(this);
            Chunk.prototype.init.call(
                this,
                world,
                camera,
                pos,
                null,
                null
            );
            this.group = group;
            this.chunks = [];
            this.lastChunk = null;
            _.each(slots, function (slot) {
                this.addChunk(slot, Type);
            }, this);
        },

        render: function () {
            _.each(this.chunks, function (chunk) {
                chunk.render();
            }, this);
        },

        findChunkAndGlue: function (chunk) {
            var joint = null;
            _.each(this.chunks, function (other) {
                if (_.isNull(joint)) {
                    if (other.pos.x === chunk.pos.x && other.pos.y - 1 === chunk.pos.y) {
                        // Other is up
                        joint = this.joinChunks(
                            chunk,
                            other,
                            {x: 0, y: -0.5},
                            {x: 0, y: 0.5}
                        );
                    } else if (other.pos.x === chunk.pos.x && other.pos.y + 1 === chunk.pos.y) {
                        // Other is down
                        joint = this.joinChunks(
                            chunk,
                            other,
                            {x: 0, y: 0.5},
                            {x: 0, y: -0.5}
                        );
                    } else if (other.pos.y === chunk.pos.y && other.pos.x + 1 === chunk.pos.x) {
                        // Other is left
                        joint = this.joinChunks(
                            chunk,
                            other,
                            {x: -0.5, y: 0},
                            {x: 0.5, y: 0}
                        );
                    } else if (other.pos.y === chunk.pos.y && other.pos.x - 1 === chunk.pos.x) {
                        // Other is left
                        joint = this.joinChunks(
                            chunk,
                            other,
                            {x: 0.5, y: 0},
                            {x: -0.5, y: 0}
                        );
                    }
                }
            }, this);
        },

        addChunk: function (slot, Type) {
            var chunk = new Type(
                this.world,
                this.camera,
                {x: this.pos.x + slot.x, y: this.pos.y + slot.y},
                this.group
            );
            this.findChunkAndGlue(chunk);
            this.chunks.push(chunk);
        },

        joinChunks: function (chunkA, chunkB, anchorA, anchorB) {
            var jointDef = new B2WeldJointDef();
            jointDef.bodyA = chunkA.body;
            jointDef.bodyB = chunkB.body;
            jointDef.localAnchorA.Set(anchorA.x, anchorA.y);
            jointDef.localAnchorB.Set(anchorB.x, anchorB.y);
            return this.world.CreateJoint(jointDef);
        },

        update: function (delta, root) {
            _.each(this.chunks, function (chunk) {
                chunk.update(delta, root);
            }, this);
        }

    });

    return MultiChunk;

});