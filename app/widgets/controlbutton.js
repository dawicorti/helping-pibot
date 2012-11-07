/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Widget = require('widget'),
        dispatcher = require('dispatcher');


    function ControlButton(parent, name, options) {
        this.init(parent, name, options);
    }

    _.extend(ControlButton.prototype, Widget.prototype);

    _.extend(ControlButton.prototype, {

        init: function (parent, name, options) {
            _.bindAll(this);
            this.options = options;
            console.log(this.options);
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
        },

        onInitialize: function (buttonOnPrint, buttonOffPrint) {
            this.buttonOn = new Widget(buttonOnPrint);
            this.buttonOff = new Widget(buttonOffPrint);
            this.setFromWidget(this.buttonOff);
            this.parent.add(this.group);
            this.initialized = true;
        },

        onClick: function () {
            if (this.initialized) {
                this.parent.remove(this.group);
                if (this.enable) {
                    this.setFromWidget(this.buttonOff);
                    dispatcher.trigger('button:' + this.name + ':disable');
                    this.enable = false;
                } else {
                    this.setFromWidget(this.buttonOn);
                    dispatcher.trigger('button:' + this.name + ':enable');
                    this.enable = true;
                }
                this.parent.add(this.group);
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