/*global define,document,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        fabric = require('fabric'),
        Widget = require('widgets/widget'),
        volumeOnPrint = require('text!svg/volume_on.svg'),
        volumeOffPrint = require('text!svg/volume_off.svg'),
        dispatcher = require('core/dispatcher');


    function Selector(parent, text, pos) {
        this.init(parent, text, pos);
    }

    _.extend(Selector.prototype, Widget.prototype);

    _.extend(Selector.prototype, {

        init: function (parent, text, pos) {
            _.bindAll(this);
            Widget.prototype.init.call(
                this,
                null,
                null,
                {pos: pos}
            );
            this.group = new fabric.Text(text, {
                fill: 'white',
                fontFamily: 'Economica'
            });
            this.text = text;
            parent.add(this.group);
            this.group.set({opacity: 0.2});
            dispatcher.on('selector:select', this.onSelectOther);
        },

        onSelectOther: function (event) {
            if (event.data !== this.text) {
                this.group.set({opacity: 0.2});
            }
        },

        onClick: function () {
            dispatcher.trigger('selector:select', this.text);
            this.group.set({opacity: 0.6});
        },

        update: function () {
            var fontSize = window.innerWidth * 0.014;
            Widget.prototype.update.call(this);
            this.group.setFontsize(fontSize);
            this.size = {
                width: fontSize * this.text.length,
                height: fontSize
            };
            this.pos = {
                left: this.pos.left + this.size.width / 4,
                top: this.pos.top
            };
        }

    });

    return Selector;

});

