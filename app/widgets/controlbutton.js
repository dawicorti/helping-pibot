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

        init: function (parent, name, options) {
            _.bindAll(this);
            this.options = options;
            this.initialized = false;
            this.enable = false;
            this.name = name;
            this.parent = parent;
            require(
                [
                    'text!svg/' + name + '_button_on.svg',
                    'text!svg/' + name + '_button_off.svg'
                ],
                this.onInitialize
            );
            dispatcher.on('button:' + name + ':force:enable', this.forceEnable);
            dispatcher.on('button:' + name + ':force:disable', this.forceDisable);
        },

        onInitialize: function (buttonOnPrint, buttonOffPrint) {
            this.buttonOn = new Widget(buttonOnPrint, null, this.options);
            this.buttonOff = new Widget(buttonOffPrint, null, this.options);
            this.setFromWidget(this.buttonOff);
            this.parent.add(this.group);
            this.initialized = true;
        },

        forceDisable: function () {
            this.setEnable(false);
        },

        forceEnable: function () {
            this.setEnable(true);
        },

        setEnable: function (status) {
            this.parent.remove(this.group);
            if (status === true) {
                this.setFromWidget(this.buttonOn);
                dispatcher.trigger('button:' + this.name + ':enable');
                this.enable = true;
            } else {
                this.setFromWidget(this.buttonOff);
                dispatcher.trigger('button:' + this.name + ':disable');
                this.enable = false;
            }
            this.parent.add(this.group);
        },

        onClick: function () {
            if (this.initialized) {
                if (this.enable) {
                    this.setEnable(false);
                } else {
                    this.setEnable(true);
                }
            }
        },

        update: function () {
            if (this.initialized) {
                Widget.prototype.update.call(this);
            }
        }

    });

    return ControlButton;

});