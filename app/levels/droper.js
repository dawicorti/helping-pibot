/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        fabric = require('fabric'),
        dispatcher = require('core/dispatcher');

    function Droper(camera) {
        this.init(camera);
    }

    _.extend(Droper.prototype, {

        init: function (camera) {
            _.bindAll(this);
            this.camera = camera;
            dispatcher.on('chunk:drop', this.onDropRequest);
            this.pos = {x: 0, y: 0};
            this.activated = false;
            this.area = new fabric.Rect({fill: '#ce3762', opacity: 0.5});
            $($('canvas')[1]).on('mousemove', this.onMouseMove);
        },

        onDropRequest: function (event) {
            var chunkId = event.data;
            this.currentChunkId = chunkId;
            this.activated = true;
            $($('canvas')[1]).one('click', this.onDrop);
        },

        onMouseMove: function (event) {
            this.pos = this.camera.getWorldPoint({
                x: event.offsetX,
                y: 0
            });
        },

        onDrop: function () {
            this.activated = false;
            dispatcher.trigger('droper:drop', {
                id: this.currentChunkId,
                pos: _.clone(this.pos)
            });
        },

        update: function (delta, root) {
            var rootPoint = this.camera.getRootPoint(this.pos);
            if (this.activated) {
                this.area.set({
                    left: rootPoint.x,
                    top: 0,
                    width: this.camera.getRootDistance(1),
                    height: this.camera.getRootDistance(
                        this.camera.fieldWidth
                    )
                });
                root.add(this.area);
            }
        }


    });

    return Droper;
});