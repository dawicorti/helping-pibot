/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var fabric = require('fabric'),
        _ = require('underscore'),
        utils = require('core/utils');

    function Chunk(world, camera, pos, group, body) {
        this.init(world, camera, pos, group, body);
    }

    _.extend(Chunk.prototype, {

        init: function (world, camera, pos, group, body) {
            this.group = new fabric.Group();
            this.camera = camera;
            this.world = world;
            this.pos = pos;
            this.body = body;
            this.lastAngle = 0;
            this.bufferTr = {x: 0, y: 0};
            this.oldPoint = this.camera.getRootPoint(this.pos);
        },

        show: function () {
            this.group.show();
        },

        hide: function () {
            this.group.hide();
        },

        normalRelativeAngle: function (newAngle) {
            return -newAngle * 180 / Math.PI % 360;
        },

        setPathGroupSize: function (pathGroup, width, height) {
            utils.setPathGroupSize(pathGroup, width, height);
        },

        setPathGroupRadius: function (pathGroup, radius) {
            utils.setPathGroupRadius(pathGroup, radius);
        },

        updatePos: function (delta) {},

        update: function (delta, root) {
            this.updatePos(delta);
            root.add(this.group);
        }

    });

    return Chunk;

});