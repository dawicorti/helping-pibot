/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var $ = require('zepto'),
        _ = require('underscore'),
        fabric = require('fabric'),
        settings = require('settings');

    function Navigator() {
        this.init();
    }

    _.extend(Navigator.prototype, {

        init: function () {
            $('body').append(
                $('<canvas></canvas>')
                    .attr('width', settings.resolution[0])
                    .attr('height', settings.resolution[1])
                    .attr('id', 'root')
            );
            this.root = new fabric.Canvas('root', {
                'width': settings.resolution[0],
                'height': settings.resolution[1]
            });
            this.root.backgroundColor = settings.backgroundColor;
            _.each($('body')[0].childNodes, function (child) {
                $(child)
                    .css('position', 'absolute')
                    .css('left', '0')
                    .css('top', settings.canvasTop + 'px');
            });
        },

        update: function (delta) {
            this.root.clear();
            if (_.isObject(this.currentMode)) {
                this.currentMode.update(delta, this.root);
            }
        },

        setCurrentMode: function (mode) {
            if (_.isObject(this.currentMode)) {
                this.currentMode.unload();
            }
            this.currentMode = mode;
        },

        width: function () {
            return settings.resolution[0];
        },

        height: function () {
            return settings.resolution[1];
        }
    });

    return Navigator;
});