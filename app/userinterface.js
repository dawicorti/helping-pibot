/*global define*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        fabric = require('fabric'),
        Volume = require('widgets/volume');

    function UserInterface() {
        this.init();
    }

    _.extend(UserInterface.prototype, {

        init: function () {
            _.bindAll(this);
            this.group = new fabric.Group();
            this.widgets = [
                new Volume(this.group)
            ];
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
                widget.update();
            });
            root.add(this.group);
        }

    });


    return UserInterface;
});