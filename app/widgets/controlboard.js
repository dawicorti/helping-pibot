/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        Widget = require('widget'),
        ControlButton = require('widgets/controlbutton'),
        controlBoardPrint = require('text!svg/control_board.svg'),
        dispatcher = require('dispatcher');


    function ControlBoard(parent) {
        this.init(parent);
    }

    _.extend(ControlBoard.prototype, Widget.prototype);

    _.extend(ControlBoard.prototype, {

        init: function (parent) {
            Widget.prototype.init.call(
                this,
                controlBoardPrint,
                parent,
                {
                    pos: {left: '50%', top: '91.5%'},
                    radius: '10%'
                }
            );
            this.buttons = [];
            this.newButton('play', '44%', '90%');
        },

        newButton: function (name, left, top) {
            this.buttons.push(
                new ControlButton(
                    this.parent,
                    name,
                    {
                        pos: {left: left, top: top},
                        radius: '1%'
                    }
                )
            );
        },

        update: function () {
            Widget.prototype.update.call(this);
            this.parent.remove(this.group);
            this.parent.add(this.group);
        }

    });

    return ControlBoard;

});