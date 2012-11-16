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
            this.index = index;
            this.wrapper = wrapper;
            this.def = def;
            this.subWidgets = [];
            this.leftPos = 50;
            this.updatedIndex = index;
            this.mainGroup = new fabric.Group();
            parent.add(this.mainGroup);
            Widget.prototype.init.call(
                this,
                print,
                this.mainGroup
            );
            this.selected = false;
        },

        setIndex: function (index) {
            this.updatedIndex = index;
        },

        onSVGLoaded: function (objects, o) {
            var subwidget = {};
            Widget.prototype.onSVGLoaded.call(this, objects, o);
            if (_.isString(this.def)) {
                require(['text!svg/' + this.def + '.svg'], function (print) {
                    subwidget = new Widget(print, this.mainGroup);
                    subwidget.relative = {
                        radius: 0.8,
                        pos: {left: 0, top: 0}
                    };
                    this.subWidgets.push(subwidget);
                }.bind(this));
            }
        },

        onClick: function () {
            dispatcher.trigger('chunk:drop', this.index);
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
            if (distance > 0.5) {
                distance = 0.5;
            }
            this.leftPos += distance;
            left = this.leftPos + '%';
            this.index = this.updatedIndex;
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
                    pos: this.options.pos,
                    radius: this.options.radius.replace('%', '') * subWidget.relative.radius + '%'
                };
                subWidget.update();
            }, this);
            Widget.prototype.update.call(this);
        },

    });

    return ChunkItem;

});