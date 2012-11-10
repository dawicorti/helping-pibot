/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        Dialog = require('dialog'),
        dispatcher = require('dispatcher');

    function DropDialog() {
        this.init();
    }

    _.extend(DropDialog.prototype, Dialog.prototype);

    _.extend(DropDialog.prototype, {

        init: function () {
            Dialog.prototype.init.call(
                this,
                {name: 'drop', title: 'drop a chunk'}
            );
            this.chunks = [];
            this.selectedChunk = 0;
            dispatcher.on('send:game:chunks', this.onGameChunksReceived);
        },

        onGameChunksReceived: function (event) {
            var chunks = event.data,
                chunkNode = {};
            _.each(chunks, function (chunk) {
                chunkNode = $('<div></div>').addClass('chunk');
                // temp hardcoded chunk part
                chunkNode.append(
                    $('<span></span>')
                        .css('position', 'absolute')
                        .css('width', '50%')
                        .css('height', '50%')
                        .css('left', '25%')
                        .css('top', '25%')
                        .css('background-color', '#ff6e49')
                );
                $('.chunk-list .wrapper').append(chunkNode);
            });
        },

        fill: function () {
            Dialog.prototype.fill.call(this);
            this.node
                .append($('<div></div>').addClass('chunk-list'))
                .append($('<div></div>').addClass('left-arrow'))
                .append($('<div></div>').addClass('right-arrow'));
            $('.chunk-list')
                .append(
                    $('<div></div>')
                        .addClass('wrapper')
                        .css('left', '45%')
                        .append($('<div></div>').addClass('selection'))
                );
            dispatcher.trigger('get:game:chunks');
        }

    });

    return DropDialog;

});