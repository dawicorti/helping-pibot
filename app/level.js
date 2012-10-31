define(function(require) {

    var settings = require('settings');
    var Mode = require('mode');
    var game = require('game');
    var Camera = require('camera');
    var ChunkFactory = require('chunkfactory');
    var Robot = require('robot');

    // Box2D aliases
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    
    var Level = function(index) {
        this.init(index);
    };

    _.extend(Level.prototype, Mode.prototype);

    _.extend(Level.prototype, {
        
        init: function (index) {
            _.bindAll(this);
            require(['levels/level' + index], this.render);
            this.rendered = false;
        },

        render: function(config) {
            Mode.prototype.init.call(this);
            this.camera = new Camera(
                settings.CAMERA_TARGET, settings.CAMERA_FIELD_WIDTH
            ); 
            this.world = new b2World(new b2Vec2(0, settings.GRAVITY), true);
            this.chunks = [];
            this.chunkFactory = new ChunkFactory(this.world, this.camera, this.group);
            _.each(config['chunks'], function(chunk) {
                this.chunkFactory.newChunk(
                    chunk.name, chunk.pos, this.onChunkCreated, chunk.options
                );
            }, this);
            this.robot = new Robot(this.world, this.camera, {x: 2, y: 7}, this.group);
            this.rendered = true;
        },

        onChunkCreated: function(chunk) {
            chunk.render();
            this.chunks.push(chunk);
        },

        update: function(delta) {
            if(this.rendered) {
                this.world.Step(delta / 1000.0, 8, 1);
                _.each(this.chunks, function(box) {
                    box.update(delta);
                });
                this.robot.update();
            }
        }

    });

    return Level;

});