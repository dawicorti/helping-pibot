/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        dispatcher = require('dispatcher');

    function Dialog(options) {
        this.init(options);
    }

    _.extend(Dialog.prototype, {

        init: function (options) {
            _.bindAll(this);
            this.options = options;
            this.node = $('<div></div>')
                .addClass('dialog')
                .addClass(options.name)
                .append($('<h1></h1>').html(options.title))
                .append($('<div></div>').addClass('close'));
            $('.close', this.node).click(this.close);
        },

        show: function () {
            $('.canvas-container').append(this.node);
            this.node.animate({height: '50%', opacity: 1});
        },

        close: function () {
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
