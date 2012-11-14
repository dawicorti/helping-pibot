/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        ControlButton = require('widgets/controlbutton'),
        playPrint = require('text!svg/play.svg'),
        dispatcher = require('core/dispatcher');


    function Play(parent) {
        this.init(parent);
    }

    _.extend(Play.prototype, ControlButton.prototype);

    _.extend(Play.prototype, {

        init: function (parent) {
            ControlButton.prototype.init.call(
                this,
                'play',
                parent,
                playPrint,
                {pos: {left: '50%', top: '92%'}, radius: '2%'}
            );
        },

    });

    return Play;

});