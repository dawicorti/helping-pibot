/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        fabric = require('fabric'),
        utils = require('utils'),
        settings = require('settings');

    function Widget(svgString, parent, options) {
        this.init(svgString, parent, options);
    }

    _.extend(Widget.prototype, {

        init: function (svgString, parent, options) {
            _.bindAll(this);
            var that = this;
            this.pos = {left: 0, top: 0};
            this.size = {width: 1, height: 1};
            this.heightBox = 1.0;
            if (_.isObject(options) && _.isNumber(options.heightBox)) {
                this.heightBox = options.heightBox;
            }
            this.options = options;
            this.parent = parent;
            fabric.loadSVGFromString(svgString, function (objects, o) {
                that.group = new fabric.PathGroup(objects, o);
                if (_.isObject(parent)) {
                    parent.add(that.group);
                }
            });
        },

        getWidthPercentValue: function (value) {
            return parseFloat(value.replace('%', '')) * settings.resolution[0] / 100.0;
        },

        getHeightPercentValue: function (value) {
            return parseFloat(value.replace('%', '')) * settings.resolution[1] / 100.0;
        },

        setFromWidget: function (widget) {
            this.group = widget.group;
            this.heightBox = widget.heightBox;
        },

        contains: function (x, y) {
            if (!_.isNumber(this.heightBox)) {
                this.heightBox = 1.0;
            }
            console.log(this.heightBox);
            var height = this.size.height * this.heightBox,
                widgetX = this.pos.left - this.size.width / 2.0,
                widgetY = this.pos.top - height / 2.0,
                contained = false;
            if (x >= widgetX && x <= widgetX + this.size.width
                    && y >= widgetY && y <= widgetY + height) {
                contained = true;
            }
            return contained;
        },

        update: function () {
            var options = this.options,
                left = 0,
                top = 0,
                pos = {},
                radius = 0;
            if (_.isObject(options)) {
                if (_.isObject(options.pos)) {
                    left = options.pos.left;
                    if (_.isString(left)) {
                        left = this.getWidthPercentValue(left);
                    }
                    top = options.pos.top;
                    if (_.isString(top)) {
                        top = this.getHeightPercentValue(top);
                    }
                    pos = {left: left, top: top};
                    this.group.set(pos);
                    this.pos = pos;
                }
                if (_.isNumber(options.radius) || _.isString(options.radius)) {
                    radius = options.radius;
                    if (_.isString(radius)) {
                        radius = this.getWidthPercentValue(radius);
                    }
                    utils.setPathGroupRadius(this.group, radius);
                    this.size = {width: radius * 2, height: radius * 2};
                } else if (_.isObject(options.size)) {
                    utils.setPathGroupSize(this.group, options.size.width, options.size.height);
                    this.size = options.size;
                }
            }
        },

        onClick: function () {}

    });

    return Widget;
});