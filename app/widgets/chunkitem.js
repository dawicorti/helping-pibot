/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        fabric = require('fabric'),
        Widget = require('widgets/widget'),
        print = require('text!svg/chunk_item.svg'),
        dispatcher = require('core/dispatcher');


    function ChunkItem(parent, index, def, wrapper) {
        this.init(parent, index, def, wrapper);
    }

    _.extend(ChunkItem.prototype, Widget.prototype);

    _.extend(ChunkItem.prototype, {

        init: function (parent, index, def, wrapper) {
            _.bindAll(this);
            this.index = index;
            this.wrapper = wrapper;
            this.def = def;
            this.subWidgets = [];
            this.leftPos = 50;
            this.mainGroup = new fabric.Group();
            parent.add(this.mainGroup);
            Widget.prototype.init.call(
                this,
                print,
                this.mainGroup
            );
            this.selected = false;
            this.selector = 'drop';
            dispatcher.on('selector:select', this.onSelectSelector);
        },

        onSelectSelector: function (event) {
            this.selector = event.data;
        },

        setSelector: function (selector) {
            this.selector = selector;
        },

        setIndex: function (index) {
            this.index = index;
        },

        onSVGLoaded: function (objects, o) {
            var subwidget = {};
            Widget.prototype.onSVGLoaded.call(this, objects, o);
            if (_.isString(this.def)) {
                require(['text!svg/' + this.def + '.svg'], function (print) {
                    subwidget = new Widget(print, this.mainGroup);
                    subwidget.relative = {
                        radius: 1.0,
                        pos: {left: 0, top: 0}
                    };
                    this.subWidgets.push(subwidget);
                }.bind(this));
            } else if (_.isObject(this.def)) {
                this.addMultiChunk();
            }
        },

        getSize: function () {
            var size = 0;
            _.each(this.def.slots, function (slot) {
                if (Math.abs(slot.x) * 2 + 1 > size) {
                    size = Math.abs(slot.x) * 2 + 1;
                }
                if (Math.abs(slot.y) * 2 + 1 > size) {
                    size = Math.abs(slot.y) * 2 + 1;
                }
            }, this);
            return size;
        },

        addMultiChunk: function () {
            var size = this.getSize(),
                subwidget = {};
            require(['text!svg/' + this.def.name + '.svg'], function (print) {
                _.each(this.def.slots, function (slot) {
                    subwidget = new Widget(print, this.mainGroup);
                    subwidget.relative = {
                        radius: 1.0 / size,
                        pos: {
                            left: slot.x * (2.0 / size),
                            top: slot.y * (6.0 / size)
                        }
                    };
                    this.subWidgets.push(subwidget);
                }, this);
            }.bind(this));
        },

        onClick: function () {
            dispatcher.trigger('chunk:' + this.selector, this.index);
            this.selected = true;
            _.delay(this.unselect, 200);
        },

        unselect: function () {
            this.selected = false;
        },

        update: function () {
            var newLeftPos = this.wrapper.offset + (2.5 * this.index),
                left = this.leftPos + '%',
                distance = newLeftPos - this.leftPos;
            if (distance > 0.7) {
                distance = 0.7;
            }
            this.leftPos += distance;
            left = this.leftPos + '%';
            this.options = {
                radius: '1%',
                pos: {left: left, top: '5%'}
            };
            if (this.selected) {
                this.group.set({opacity: 0.6});
            } else {
                this.group.set({opacity: 0.2});
            }
            _.each(this.subWidgets, function (subWidget) {
                subWidget.options = {
                    pos: {
                        left: this.leftPos + subWidget.relative.pos.left + '%',
                        top: 5 + subWidget.relative.pos.top + '%'
                    },
                    radius: subWidget.relative.radius + '%'
                };
                subWidget.update();
            }, this);
            Widget.prototype.update.call(this);
        },

    });

    return ChunkItem;

});