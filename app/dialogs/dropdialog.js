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
            dispatcher.one('send:game:chunks', this.onGameChunksReceived);
        },

        onGameChunksReceived: function (event) {
            var chunkNode = {};
            this.chunks = event.data;
            _.each(this.chunks, function (chunk) {
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
            this.updateWrapper();
        },

        updateWrapper: function () {
            $('.chunk-list .wrapper')
                .animate(
                    {left: 45 - (11 * this.selectedChunk) + '%'},
                    {complete: this.updateSelection}
                );
        },

        updateSelection: function () {
            $('.wrapper .chunk.selected').removeClass('selected');
            $($('.wrapper .chunk')[this.selectedChunk]).addClass('selected');
        },

        onClickRightArrow: function () {
            if (this.selectedChunk < this.chunks.length - 1) {
                this.selectedChunk += 1;
                this.updateWrapper();
            }
        },

        onClickLeftArrow: function () {
            if (this.selectedChunk > 0) {
                this.selectedChunk -= 1;
                this.updateWrapper();
            }
        },

        onClickDrop: function () {
            dispatcher.trigger('chunk:drop', this.selectedChunk);
            this.close();
        },

        fill: function () {
            Dialog.prototype.fill.call(this);
            this.node
                .append($('<div></div>').addClass('chunk-list'))
                .append($('<div></div>').addClass('left-arrow'))
                .append($('<div></div>').addClass('right-arrow'))
                .append($('<button></button>').html('drop'));
            $('.chunk-list')
                .append($('<div></div>').addClass('wrapper'));
            $('.right-arrow').click(this.onClickRightArrow);
            $('.left-arrow').click(this.onClickLeftArrow);
            $('button', this.node).click(this.onClickDrop);
            dispatcher.trigger('get:game:chunks');
        }

    });

    return DropDialog;

});