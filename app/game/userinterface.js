/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        fabric = require('fabric'),
        Volume = require('widgets/volume'),
        CameraLeft = require('widgets/cameraleft'),
        CameraRight = require('widgets/cameraright'),
        Play = require('widgets/play'),
        dispatcher = require('core/dispatcher');

    function UserInterface() {
        this.init();
    }

    _.extend(UserInterface.prototype, {

        init: function () {
            var index = 0;
            _.bindAll(this);
            this.group = new fabric.Group();
            this.widgets = {
                volume: new Volume(this.group),
                cameraLeft: new CameraLeft(this.group),
                cameraRight: new CameraRight(this.group),
                play: new Play(this.group),
            };
            dispatcher.on('button:drop:enable', this.onClickDrop);
            dispatcher.on('button:clone:enable', this.onClickClone);
            $(document).keydown(this.onKeyDown);
            $(document).keyup(this.onKeyUp);
        },

        onKeyDown: function (event) {
            if (event.keyCode === 39 && this.widgets.cameraRight.isVisible()) {
                this.widgets.cameraRight.onMouseDown();
            }
            if (event.keyCode === 37 && this.widgets.cameraLeft.isVisible()) {
                this.widgets.cameraLeft.onMouseDown();
            }
        },

        onKeyUp: function (event) {
            if (event.keyCode === 39) {
                this.widgets.cameraRight.onMouseUp();
            }
            if (event.keyCode === 37) {
                this.widgets.cameraLeft.onMouseUp();
            }
        },

        onMouseDown: function (x, y) {
            _.each(this.widgets, function (widget) {
                if (widget.contains(x, y)) {
                    widget.onMouseDown();
                }
            }, this);
        },

        onMouseUp: function (x, y) {
            var inWidget = false;
            _.each(this.widgets, function (widget) {
                if (widget.contains(x, y)) {
                    inWidget = true;
                }
                widget.onMouseUp(inWidget);
            }, this);
        },

        onClick: function (x, y) {
            _.each(this.widgets, function (widget) {
                if (widget.contains(x, y)) {
                    widget.onClick();
                }
            }, this);
        },

        update: function (root) {
            _.each(this.widgets, function (widget) {
                if (!_.isBoolean(widget.visible) || widget.visible) {
                    widget.update();
                }
            });

            root.add(this.group);
        }

    });


    return UserInterface;
});