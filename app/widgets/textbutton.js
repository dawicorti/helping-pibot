/*global define,document,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        fabric = require('fabric'),
        Widget = require('widgets/widget'),
        dispatcher = require('core/dispatcher');


    function TextButton(parent, text, pos) {
        this.init(parent, text, pos);
    }

    _.extend(TextButton.prototype, Widget.prototype);

    _.extend(TextButton.prototype, {

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
        },

        onMouseDown: function () {
            this.group.set({opacity: 0.6});
            _.delay(this.unSelect, 300);
        },

        unSelect: function () {
            this.group.set({opacity: 0.2});
            dispatcher.trigger('button:' + this.text + ':click');
        },

        update: function () {
            var fontSize = window.innerWidth * 0.05;
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

    return TextButton;

});

