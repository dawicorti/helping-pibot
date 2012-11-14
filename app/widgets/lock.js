/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        ControlButton = require('widgets/controlbutton'),
        lockPrint = require('text!svg/lock.svg'),
        dispatcher = require('core/dispatcher');


    function Lock(parent) {
        this.init(parent);
    }

    _.extend(Lock.prototype, ControlButton.prototype);

    _.extend(Lock.prototype, {

        init: function (parent) {
            ControlButton.prototype.init.call(
                this,
                'lock',
                parent,
                lockPrint,
                {pos: {left: '43%', top: '92%'}, radius: '2%'}
            );
        },

    });

    return Lock;

});