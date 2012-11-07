/*global define*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        game = require('game'),
        Chunk = require('chunk'),
        StaticBox = require('chunks/staticbox'),
        RigidBox = require('chunks/rigidbox'),
        chunkTypes = {
            'staticbox': StaticBox,
            'rigidbox': RigidBox
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

        newChunk: function (chunkName, pos, next, options) {
            var chunk = new chunkTypes[chunkName](
                this.world,
                this.camera,
                pos,
                this.group,
                options
            );
            next(chunk);
        }

    });

    return ChunkFactory;
});