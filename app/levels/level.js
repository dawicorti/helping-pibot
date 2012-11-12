/*global define,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Box2D = require('box2d'),
        settings = require('core/settings'),
        dispatcher = require('core/dispatcher'),
        game = require('game/game'),
        Camera = require('levels/camera'),
        ChunkFactory = require('chunks/chunkfactory'),
        Robot = require('game/robot'),
        Droper = require('levels/droper'),
        B2World = Box2D.Dynamics.b2World,
        B2Vec2 = Box2D.Common.Math.b2Vec2;

    function Level(index) {
        this.init(index);
    }

    _.extend(Level.prototype, {

        init: function (index) {
            _.bindAll(this);
            require(['levels/level' + index], this.render);
            this.rendered = false;
        },

        render: function (config) {
            this.camera = new Camera(
                settings.cameraTarget,
                settings.cameraFieldWidth
            );
            this.droper = new Droper(this.camera);
            this.world = new B2World(new B2Vec2(0, settings.gravity), true);
            this.chunks = [];
            this.chunkFactory = new ChunkFactory(this.world, this.camera, this.group);
            _.each(config.chunks, function (chunk) {
                this.chunkFactory.newChunk(
                    chunk.name,
                    chunk.pos,
                    this.onChunkCreated,
                    chunk.options
                );
            }, this);
            this.robot = new Robot(this.world, this.camera, {x: 2, y: 7}, this.group);
            this.robot.render();
            this.rendered = true;
            dispatcher.on('game:drop', this.onDrop);
            dispatcher.on('button:play:enable', this.onPlay);
            dispatcher.on('button:lock:disable', this.onUnlockCamera);
            dispatcher.on('button:lock:enable', this.onLockCamera);
        },

        onPlay: function () {
            dispatcher.trigger('button:lock:force:enable');
        },

        onUnlockCamera: function () {
            this.camera.unlock();
        },

        onLockCamera: function () {
            this.camera.lock(this.robot);
        },

        onDrop: function (event) {
            this.chunkFactory.newChunk(
                event.data.type,
                event.data.pos,
                this.onChunkCreated
            );
        },

        onChunkCreated: function (chunk) {
            chunk.render();
            this.chunks.push(chunk);
        },

        update: function (delta, root) {
            if (this.rendered) {
                this.camera.update();
                this.world.Step(delta / 1000.0, 8, 1);
                _.each(this.chunks, function (box) {
                    box.update(delta, root);
                });
                this.robot.update(delta, root);
                this.droper.update(delta, root);
            }
        }

    });

    return Level;

});