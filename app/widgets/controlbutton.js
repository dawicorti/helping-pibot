/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Widget = require('widgets/widget'),
        dispatcher = require('core/dispatcher');


    function ControlButton(parent, name, options) {
        this.init(parent, name, options);
    }

    _.extend(ControlButton.prototype, Widget.prototype);

    _.extend(ControlButton.prototype, {

        opacity: {
            enable: 0.7,
            disable: 0.1
        },

        init: function (name, parent, print, options) {
            _.bindAll(this);
            Widget.prototype.init.call(
                this,
                print,
                parent,
                options
            );
            this.name = name;
            this.enable = false;
            this.group.set({opacity: this.opacity.disable});
            dispatcher.on('button:' + name + ':force:enable', this.forceEnable);
            dispatcher.on('button:' + name + ':force:disable', this.forceDisable);
            dispatcher.on('button:all:reset', this.forceDisable);
        },

        show: function () {
            this.visible = true;
            this.group.set({opacity: this.opacity.disable});
        },

        hide: function () {
            this.visible = false;
            this.group.set({opacity: 0});
        },


        forceDisable: function () {
            this.setEnable(false);
        },

        forceEnable: function () {
            this.setEnable(true);
        },

        setEnable: function (status) {
            if (this.isVisible()) {
                if (status === true) {
                    this.group.set({opacity: this.opacity.enable});
                    dispatcher.trigger('button:' + this.name + ':enable');
                    this.enable = true;
                } else {
                    this.group.set({opacity: this.opacity.disable});
                    dispatcher.trigger('button:' + this.name + ':disable');
                    this.enable = false;
                }
            }
        },

        onClick: function () {
            if (this.enable) {
                this.setEnable(false);
            } else {
                this.setEnable(true);
            }
        },

    });

    return ControlButton;

});