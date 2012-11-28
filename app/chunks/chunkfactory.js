/*global define*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        game = require('game/game'),
        Chunk = require('chunks/chunk'),
        MultiChunk = require('chunks/multichunk'),
        StaticBox = require('chunks/staticbox'),
        RigidBox = require('chunks/rigidbox'),
        Teleporter = require('chunks/teleporter'),
        Platform = require('chunks/platform'),
        chunkTypes = {
            'staticbox': StaticBox,
            'rigidbox': RigidBox,
            'teleporter': Teleporter,
            'platform': Platform
        };

    function ChunkFactory(world, camera, group) {
        this.init(world, camera, group);
    }

    _.extend(ChunkFactory.prototype, {

        init: function (world, camera, group) {
            this.world = world;
            this.camera = camera;
            this.group = group;
        },

        newChunk: function (chunkDef, pos, next, options) {
            var chunk = null;
            if (_.isString(chunkDef)) {
                chunk = new chunkTypes[chunkDef](
                    this.world,
                    this.camera,
                    pos,
                    this.group,
                    options
                );
            } else if (_.isObject(chunkDef)) {
                chunk = new MultiChunk(
                    this.world,
                    this.camera,
                    pos,
                    this.group,
                    chunkTypes[chunkDef.name],
                    chunkDef.slots
                );
            }
            next(chunk);
        }

    });

    return ChunkFactory;
});