/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        ControlButton = require('widgets/controlbutton'),
        cameraLeftPrint = require('text!svg/camera_left.svg'),
        dispatcher = require('core/dispatcher');


    function CameraLeft(parent) {
        this.init(parent);
    }

    _.extend(CameraLeft.prototype, ControlButton.prototype);

    _.extend(CameraLeft.prototype, {

        init: function (parent) {
            ControlButton.prototype.init.call(
                this,
                'left',
                parent,
                cameraLeftPrint,
                {pos: {left: '5%', top: '50%'}, radius: '5%'}
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
                dispatcher.trigger('camera:move:left');
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

    return CameraLeft;

});