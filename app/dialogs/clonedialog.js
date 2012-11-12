/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        Dialog = require('dialogs/dialog'),
        dispatcher = require('core/dispatcher');

    function CloneDialog() {
        this.init();
    }

    _.extend(CloneDialog.prototype, Dialog.prototype);

    _.extend(CloneDialog.prototype, {

        init: function () {
            Dialog.prototype.init.call(
                this,
                {name: 'clone', title: 'clone a chunk'}
            );
            this.chunks = [];
            this.selectedChunk = 0;
            dispatcher.one('send:game:chunks', this.onGameChunksReceived);
        },

        onGameChunksReceived: function (event) {
            this.chunks = event.data;
            _.each(this.chunks, function (chunkDef) {
                this.addChunk($('.chunk-list .wrapper'), chunkDef);
            }, this);
            this.updateWrapper();
        },

        updateWrapper: function () {
            $('.chunk-list .wrapper')
                .animate(
                    {left: 45 - (11 * this.selectedChunk) + '%'},
                    {complete: this.updateSelection, duration: 200}
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

        onClickClone: function () {
            var chunkDef = _.clone(this.chunks[this.selectedChunk]),
                chunkNode = this.addChunk($('.chunk-list .wrapper'), chunkDef);
            chunkNode
                .css('width', '0%')
                .css('height', '0%');
            chunkNode.animate({width: '0.1%', height: '100%'});
            this.chunks.push(chunkDef);
            this.selectedChunk = this.chunks.length - 1;
            this.updateWrapper();
            dispatcher.trigger('chunk:clone', chunkDef);
        },

        fill: function () {
            Dialog.prototype.fill.call(this);
            this.node
                .append($('<div></div>').addClass('chunk-list'))
                .append($('<div></div>').addClass('left-arrow'))
                .append($('<div></div>').addClass('right-arrow'))
                .append($('<button></button>').html('clone'));
            $('.chunk-list')
                .append($('<div></div>').addClass('wrapper'));
            $('.right-arrow').click(this.onClickRightArrow);
            $('.left-arrow').click(this.onClickLeftArrow);
            $('button', this.node).click(this.onClickClone);
            dispatcher.trigger('get:game:chunks');
        }

    });

    return CloneDialog;

});