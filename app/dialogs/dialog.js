/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        dispatcher = require('core/dispatcher');

    function Dialog(options) {
        this.init(options);
    }

    _.extend(Dialog.prototype, {

        init: function (options) {
            _.bindAll(this);
            this.options = options;
            this.node = $('<div></div>')
                .addClass('dialog')
                .addClass(this.options.name);
        },

        fill: function () {
            this.node
                .append($('<h1></h1>').html(this.options.title))
                .append($('<div></div>').addClass('close'));
            $('.close', this.node).click(this.close);
        },

        show: function () {
            $('.canvas-container').append(this.node);
            this.node.animate(
                {height: '30%', opacity: 1},
                {complete: this.fill}
            );
        },

        addChunk: function (parent, chunkDef) {
            var chunkNode = $('<div></div>').addClass('chunk');
            chunkNode.append(
                $('<span></span>')
                    .css('position', 'absolute')
                    .css('width', '50%')
                    .css('height', '50%')
                    .css('left', '25%')
                    .css('top', '25%')
                    .css('background-color', '#ff6e49')
            );
            parent.append(chunkNode);
            return chunkNode;
        },

        close: function () {
            this.node.empty();
            dispatcher.trigger('button:' + this.options.name + ':force:disable');
            this.node.animate(
                {height: 0, opacity: 0},
                {complete: this.destroy}
            );
        },

        destroy: function () {
            this.node.remove();
        }


    });

    return Dialog;

});
