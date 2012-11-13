/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Widget = require('widgets/widget'),
        cameraLeftPrint = require('text!svg/camera_left.svg'),
        dispatcher = require('core/dispatcher');


    function CameraLeft(parent) {
        this.init(parent);
    }

    _.extend(CameraLeft.prototype, Widget.prototype);

    _.extend(CameraLeft.prototype, {

        init: function (parent) {
            Widget.prototype.init.call(
                this,
                cameraLeftPrint,
                parent,
                {pos: {left: '5%', top: '50%'}, radius: '5%'}
            );
            this.activated = false;
            this.group.set({opacity: 0.5});
            dispatcher.on('button:lock:disable', this.onDisableLock);
            dispatcher.on('button:lock:enable', this.onEnableLock);
            this.resetTimer();
        },

        resetTimer: function () {
            _.delay(this.onTick, 20);
        },

        onTick: function () {
            if (this.activated) {
                dispatcher.trigger('camera:move:left');
            }
            this.resetTimer();
        },

        onDisableLock: function () {
            this.parent.add(this.group);
            this.visible = true;
        },

        onEnableLock: function () {
            this.parent.remove(this.group);
            this.visible = false;
        },

        onMouseDown: function () {
            this.group.set({opacity: 1});
            this.activated = true;
        },

        onMouseUp: function () {
            this.group.set({opacity: 0.5});
            this.activated = false;
        }

    });

    return CameraLeft;

});