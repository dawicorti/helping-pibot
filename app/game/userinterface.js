/*global define*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        fabric = require('fabric'),
        ControlBoard = require('widgets/controlboard'),
        Volume = require('widgets/volume'),
        CameraLeft = require('widgets/cameraleft'),
        CameraRight = require('widgets/cameraright'),
        dispatcher = require('core/dispatcher'),
        DropDialog = require('dialogs/dropdialog'),
        CloneDialog = require('dialogs/clonedialog');

    function UserInterface() {
        this.init();
    }

    _.extend(UserInterface.prototype, {

        init: function () {
            _.bindAll(this);
            this.group = new fabric.Group();
            var controlBoard = new ControlBoard(this.group);
            this.widgets = [
                new Volume(this.group),
                new CameraLeft(this.group),
                new CameraRight(this.group),
                controlBoard
            ];
            _.each(controlBoard.buttons, function (button) {
                this.widgets.push(button);
            }, this);
            dispatcher.on('button:drop:enable', this.onClickDrop);
            dispatcher.on('button:clone:enable', this.onClickClone);
        },

        onClickDrop: function () {
            var dialog = new DropDialog();
            dialog.show();
        },

        onClickClone: function () {
            var dialog = new CloneDialog();
            dialog.show();
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