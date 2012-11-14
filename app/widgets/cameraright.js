/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        ControlButton = require('widgets/controlbutton'),
        cameraRightPrint = require('text!svg/camera_right.svg'),
        dispatcher = require('core/dispatcher');


    function CameraRight(parent) {
        this.init(parent);
    }

    _.extend(CameraRight.prototype, ControlButton.prototype);

    _.extend(CameraRight.prototype, {

        init: function (parent) {
            ControlButton.prototype.init.call(
                this,
                'right',
                parent,
                cameraRightPrint,
                {pos: {left: '95%', top: '50%'}, radius: '5%'}
            );
            dispatcher.on('button:lock:disable', this.show);
            dispatcher.on('button:lock:enable', this.hide);
            this.resetTimer();
        },

        resetTimer: function () {
            _.delay(this.onTick, 20);
        },

        onTick: function () {
            if (this.enable) {
                dispatcher.trigger('camera:move:right');
            }
            this.resetTimer();
        },

        onClick: function () {
        },

        onMouseDown: function () {
            this.setEnable(true);
        },

        onMouseUp: function () {
            this.setEnable(false);
        }

    });

    return CameraRight;

});