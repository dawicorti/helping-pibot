define(function(require) {

    var StaticBox = require('chunks/staticbox');
    var RigidBox = require('chunks/rigidbox');

    var CHUNK_TYPES = {
        'staticbox': StaticBox,
        'rigidbox': RigidBox
    };

    var ChunkFactory = function(world, camera, group) {
        this.init(world, camera, group);
    };

    _.extend(ChunkFactory.prototype, {

        init: function(world, camera, group) {
            this.world = world;
            this.camera = camera;
            this.group = group;
        },

        newChunk: function(chunkName, pos, next, options) {
            console.log('in factory : ' + pos.x)
            var chunk = new CHUNK_TYPES[chunkName](
                this.world, this.camera, pos, this.group, options
            );
            next(chunk);
        }

    });

    return ChunkFactory;
});