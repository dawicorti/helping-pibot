/*global define,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Box2D = require('box2d'),
        jukebox = require('game/jukebox'),
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
            if (index < 6) {
                jukebox.playFromJamendo(settings.firstSoundtrack);
            } else {
                jukebox.playFromJamendo(settings.secondSoundTrack);
            }
            this.index = index;
            require(['levels/level' + index], this.render);
            this.rendered = false;
            this.loaded = true;
            this.contactListener = {
                PreSolve: this.preSolveContact,
                PostSolve: this.postSolveContact,
                BeginContact: this.beginContact,
                EndContact: this.endContact
            };
        },

        preSolveContact: function (contact, manifold) {
            var chunkA = contact.GetFixtureA().GetBody().GetUserData(),
                chunkB = contact.GetFixtureB().GetBody().GetUserData();
            if (_.isObject(chunkA)) {
                chunkA.onCollision(chunkB);
            }
            if (_.isObject(chunkB)) {
                chunkB.onCollision(chunkA);
            }
        },

        next: function () {
            var newLevel = this;
            if (this.index + 1 <= settings.levelsCount) {
                newLevel = new Level(this.index + 1);
            } else {
                dispatcher.trigger('game:over');
            }
            return newLevel;
        },

        beginContact: function () {},
        endContact: function () {},
        postSolveContact: function () {},

        unload: function () {
            this.loaded = false;
            this.droper.disable();
        },

        newMe: function () {
            return new Level(this.index);
        },

        render: function (config) {
            this.camera = new Camera(
                _.clone(settings.cameraTarget),
                settings.cameraFieldWidth
            );
            this.droper = new Droper(this.camera);
            this.world = new B2World(new B2Vec2(0, settings.gravity), true);
            this.world.SetContactListener(this.contactListener);
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
            if (this.loaded) {
                dispatcher.trigger('button:lock:force:enable');
            }
        },

        onUnlockCamera: function () {
            if (this.loaded) {
                this.camera.unlock();
            }
        },

        onLockCamera: function () {
            if (this.loaded) {
                this.camera.lock(this.robot);
            }
        },

        onDrop: function (event) {
            if (this.loaded) {
                this.chunkFactory.newChunk(
                    event.data.type,
                    event.data.pos,
                    this.onChunkCreated
                );
            }
        },

        onChunkCreated: function (chunk) {
            if (this.loaded) {
                chunk.render();
                this.chunks.push(chunk);
            }
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