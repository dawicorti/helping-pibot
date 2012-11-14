/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        ControlButton = require('widgets/controlbutton'),
        reloadPrint = require('text!svg/reload.svg'),
        dispatcher = require('core/dispatcher');


    function Reload(parent) {
        this.init(parent);
    }

    _.extend(Reload.prototype, ControlButton.prototype);

    _.extend(Reload.prototype, {

        init: function (parent) {
            ControlButton.prototype.init.call(
                this,
                'reload',
                parent,
                reloadPrint,
                {pos: {left: '57%', top: '92%'}, radius: '2%'}
            );
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

    return Reload;

});