/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Widget = require('widgets/widget'),
        volumeOnPrint = require('text!svg/volume_on.svg'),
        volumeOffPrint = require('text!svg/volume_off.svg'),
        dispatcher = require('core/dispatcher');


    function Volume(parent) {
        this.init(parent);
    }

    _.extend(Volume.prototype, Widget.prototype);

    _.extend(Volume.prototype, {

        init: function (parent) {
            this.options = {pos: {left: '98%', top: '8%'}, radius: '2%'};
            this.volumeOn = new Widget(volumeOnPrint);
            this.volumeOff = new Widget(volumeOffPrint);
            this.enable = true;
            this.parent = parent;
            this.setFromWidget(this.volumeOn);
            parent.add(this.group);
        },

        onClick: function () {
            this.parent.remove(this.group);
            if (this.enable) {
                this.setFromWidget(this.volumeOff);
                dispatcher.trigger('volume:disable');
                this.enable = false;
            } else {
                this.setFromWidget(this.volumeOn);
                dispatcher.trigger('volume:enable');
                this.enable = true;
            }
            this.parent.add(this.group);
        },

    });

    return Volume;

});