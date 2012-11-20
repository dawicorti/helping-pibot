/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        fabric = require('fabric'),
        Volume = require('widgets/volume'),
        CameraLeft = require('widgets/cameraleft'),
        CameraRight = require('widgets/cameraright'),
        Play = require('widgets/play'),
        Lock = require('widgets/lock'),
        Reload = require('widgets/reload'),
        ChunkItem = require('widgets/chunkitem'),
        Selector = require('widgets/selector'),
        dispatcher = require('core/dispatcher');

    function UserInterface(chunks) {
        this.init(chunks);
    }

    _.extend(UserInterface.prototype, {

        init: function (chunks) {
            var index = 0;
            _.bindAll(this);
            this.group = new fabric.Group();
            this.widgets = {
                volume: new Volume(this.group),
                cameraLeft: new CameraLeft(this.group),
                cameraRight: new CameraRight(this.group),
                play: new Play(this.group),
                reload: new Reload(this.group),
                lock: new Lock(this.group),
                drop: new Selector(this.group, 'drop', {left: '5%', top: '5%'}),
                clone: new Selector(this.group, 'clone', {left: '8%', top: '5%'}),
                fork: new Selector(this.group, 'fork', {left: '11%', top: '5%'})
            };
            this.widgets.drop.onClick();
            this.wrapper = {
                offset: 50
            };
            dispatcher.on('button:drop:enable', this.onClickDrop);
            dispatcher.on('button:clone:enable', this.onClickClone);
            $(document).keydown(this.onKeyDown);
            $(document).keyup(this.onKeyUp);
            _.each(chunks, function (def) {
                this.widgets['item' + index] = new ChunkItem(
                    this.group,
                    index,
                    def,
                    this.wrapper
                );
                this.widgets['item' + index].setSelector('drop');
                index += 1;
            }, this);
            this.selector = 'drop';
            dispatcher.on('selector:select', this.onSelectSelector);
        },

        cloneChunk: function (fromIndex, toIndex) {
            var newChunk = new ChunkItem(
                this.group,
                toIndex,
                this.widgets['item' + fromIndex].def,
                this.wrapper
            );
            newChunk.leftPos = this.widgets['item' + fromIndex].leftPos;
            newChunk.setSelector(this.selector);
            this.widgets['item' + toIndex] = newChunk;
        },

        onSelectSelector: function (event) {
            this.selector = event.data;
        },

        removeChunk: function (chunkId) {
            var lastChunkReached = false,
                index = chunkId,
                currentKey = 'item' + index,
                nextKey = 'item' + (index + 1);
            this.group.remove(this.widgets[currentKey].mainGroup);
            while (!lastChunkReached) {
                if (_.has(this.widgets, nextKey)) {
                    this.widgets[nextKey].setIndex(index);
                    this.widgets[currentKey] = this.widgets[nextKey];
                    index += 1;
                    currentKey = 'item' + index;
                    nextKey = 'item' + (index + 1);
                } else {
                    this.widgets = _.omit(this.widgets, currentKey);
                    lastChunkReached = true;
                }
            }
        },

        onKeyDown: function (event) {
            if (event.keyCode === 39 && this.widgets.cameraRight.isVisible()) {
                this.widgets.cameraRight.onMouseDown();
            }
            if (event.keyCode === 37 && this.widgets.cameraLeft.isVisible()) {
                this.widgets.cameraLeft.onMouseDown();
            }
        },

        onKeyUp: function (event) {
            if (event.keyCode === 39) {
                this.widgets.cameraRight.onMouseUp();
            }
            if (event.keyCode === 37) {
                this.widgets.cameraLeft.onMouseUp();
            }
        },

        onMouseDown: function (x, y) {
            _.each(this.widgets, function (widget) {
                if (widget.contains(x, y)) {
                    widget.onMouseDown();
                }
            }, this);
        },

        onMouseUp: function (x, y) {
            var inWidget = false;
            _.each(this.widgets, function (widget) {
                if (widget.contains(x, y)) {
                    inWidget = true;
                }
                widget.onMouseUp(inWidget);
            }, this);
        },

        onClick: function (x, y) {
            _.each(this.widgets, function (widget) {
                if (widget.contains(x, y)) {
                    widget.onClick();
                }
            }, this);
        },

        update: function (root) {
            if (_.isArray(this.chunks)) {
                this.wrapper.offset = 50 - this.chunks.length * 2.5 / 2;
            }
            _.each(this.widgets, function (widget) {
                if (widget.isVisible()) {
                    widget.update();
                }
            }, this);

            root.add(this.group);
        }

    });


    return UserInterface;
});