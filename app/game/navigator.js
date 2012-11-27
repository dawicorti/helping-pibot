/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var $ = require('zepto'),
        _ = require('underscore'),
        fabric = require('fabric'),
        settings = require('core/settings'),
        dispatcher = require('core/dispatcher');

    function Navigator() {
        this.init();
    }

    _.extend(Navigator.prototype, {

        init: function () {
            _.bindAll(this);
            $('#root')
                .attr('width', settings.resolution[0])
                .attr('height', settings.resolution[1]);
            this.root = new fabric.Canvas('root', {
                'width': settings.resolution[0],
                'height': settings.resolution[1]
            });
            this.root.backgroundColor = settings.backgroundColor;
            $('.canvas-container')
                .css('position', 'absolute')
                .css('left', '0px')
                .css('top', settings.canvasTop + 'px');
            dispatcher.on('button:reload:enable', this.onReload);
            dispatcher.on('level:next', this.onNextLevel);
        },

        onReload: function () {
            this.setCurrentMode(this.currentMode.newMe());
        },

        onNextLevel: function () {
            this.setCurrentMode(this.currentMode.next());
        },

        update: function (delta) {
            this.root.clear();
            if (_.isObject(this.currentMode)) {
                this.currentMode.update(delta, this.root);
            }
        },

        setCurrentMode: function (mode) {
            dispatcher.trigger('button:all:reset');
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