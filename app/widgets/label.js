/*global define,document,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        fabric = require('fabric'),
        Widget = require('widgets/widget'),
        dispatcher = require('core/dispatcher');


    function Label(parent, text, pos) {
        this.init(parent, text, pos);
    }

    _.extend(Label.prototype, Widget.prototype);

    _.extend(Label.prototype, {

        init: function (parent, text, pos) {
            _.bindAll(this);
            Widget.prototype.init.call(
                this,
                null,
                null,
                {pos: pos}
            );
            this.fontSize = 0.02;
            this.group = new fabric.Text(text, {
                fill: 'white',
                fontFamily: 'Economica'
            });
            this.text = text;
            parent.add(this.group);
        },

        setText: function (text) {
            this.group.setText(text);
        },

        update: function () {
            var fontSize = window.innerWidth * this.fontSize;
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

    return Label;

});

