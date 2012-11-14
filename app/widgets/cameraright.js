/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Widget = require('widgets/widget'),
        cameraRightPrint = require('text!svg/camera_right.svg'),
        dispatcher = require('core/dispatcher');


    function CameraRight(parent) {
        this.init(parent);
    }

    _.extend(CameraRight.prototype, Widget.prototype);

    _.extend(CameraRight.prototype, {

        init: function (parent) {
            Widget.prototype.init.call(
                this,
                cameraRightPrint,
                parent,
                {pos: {left: '95%', top: '50%'}, radius: '5%'}
            );
            this.activated = false;
            this.group.set({opacity: 0.2});
            dispatcher.on('button:lock:disable', this.onDisableLock);
            dispatcher.on('button:lock:enable', this.onEnableLock);
            this.resetTimer();
        },

        resetTimer: function () {
            _.delay(this.onTick, 20);
        },

        onTick: function () {
            if (this.activated) {
                dispatcher.trigger('camera:move:right');
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
            this.group.set({opacity: 0.6});
            this.activated = true;
        },

        onMouseUp: function () {
            this.group.set({opacity: 0.2});
            this.activated = false;
        }

    });

    return CameraRight;

});