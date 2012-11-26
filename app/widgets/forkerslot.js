/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Widget = require('widgets/widget'),
        forkerSlotPrint = require('text!svg/forker_slot.svg'),
        forkerBadSlotPrint = require('text!svg/forker_bad_slot.svg'),
        dispatcher = require('core/dispatcher');


    function ForkerSlot(parent, options) {
        this.init(parent, options);
    }

    _.extend(ForkerSlot.prototype, Widget.prototype);

    _.extend(ForkerSlot.prototype, {

        init: function (parent, options) {
            _.bindAll(this);
            Widget.prototype.init.call(
                this,
                forkerSlotPrint,
                parent,
                options
            );
            this.overPrint = null;
            this.row = options.row;
            this.col = options.col;
        },

        onMouseDown: function () {
            dispatcher.trigger('forker:slot:click', {
                slot: this
            });
        },

        setAsBadChoice: function () {
            this.overPrint = new Widget(
                forkerBadSlotPrint,
                this.parent,
                this.options
            );
            _.delay(this.reset, 300);
        },

        reset: function () {
            if (_.isObject(this.overPrint) && _.isObject(this.overPrint.group)) {
                this.parent.remove(this.overPrint.group);
                this.overPrint = null;
            }
        },

        update: function () {
            Widget.prototype.update.call(this);
            if (_.isObject(this.overPrint) && _.isObject(this.overPrint.group)) {
                this.overPrint.update();
            }
        }



    });

    return ForkerSlot;

});