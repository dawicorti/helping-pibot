define(function(require) {

    // Game theme :
    // http://www.colourlovers.com/palette/1480885/A_Night_in_Havana

    var settings = require('settings');
    var Mode = require('mode');
    var Game = require('game');
    var Camera = require('camera');
    var ChunkFactory = require('chunkfactory');
    var Robot = require('robot');

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
                'staticbox', {x: 4.8, y: 0}, this.onChunkCreated, {width: 10, height: 1}
            );

            this.chunkFactory.newChunk(
                'staticbox', {x: 10.5, y: -1.1}, this.onChunkCreated, {width: 1, height: 1}
            );
            this.chunkFactory.newChunk(
                'staticbox', {x: 21.2, y: 0}, this.onChunkCreated, {width: 20, height: 1}
            );

            this.robot = new Robot(this.world, this.camera, {x: 2, y: 7}, this.group);

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
            this.robot.update();
        }

    });

    return Level;

});