define(function(require) {

    var settings = require('settings');
    var Mode = require('mode');
    var Game = require('game');
    var Camera = require('camera');
    var ChunkFactory = require('chunkfactory');
    var Hero = require('hero');

    // Box2D aliases
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    
    var Level = function() {
        this.init();
    };

    _.extend(Level.prototype, Mode.prototype);

    _.extend(Level.prototype, {
        
        init: function() {
            _.bindAll(this);
            Mode.prototype.init.call(this);
            this.camera = new Camera(
                settings.CAMERA_TARGET, settings.CAMERA_FIELD_WIDTH
            ); 
            this.world = new b2World(new b2Vec2(0, settings.GRAVITY), true);
            this.chunks = [];
            this.chunkFactory = new ChunkFactory(this.world, this.camera, this.group);

            this.chunkFactory.newChunk(
                'staticbox', {x: 4.9, y: 0}, this.onChunkCreated, {width: 10, height: 1}
            );

            this.chunkFactory.newChunk(
                'staticbox', {x: 10.5, y: -1.1}, this.onChunkCreated, {width: 1, height: 1}
            );
            this.chunkFactory.newChunk(
                'staticbox', {x: 21.1, y: 0}, this.onChunkCreated, {width: 20, height: 1}
            );

            this.chunkFactory.newChunk(
                'rigidbox', {x: 10.5, y: 8}, this.onChunkCreated
            );

            //this.hero = new Hero(this.world, this.camera, {x: 0, y: 0}, this.group);

        },

        onChunkCreated: function(chunk) {
            chunk.render();
            this.chunks.push(chunk);
        },

        update: function(delta) {
            this.world.Step(delta / 1000.0, 8, 1);
            _.each(this.chunks, function(box) {
                box.update(delta);
            });
        }

    });

    return Level;

});