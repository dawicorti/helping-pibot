define(function(require) {

    var utils = require('utils');

    var Widget = function(svgString, parent, options) {
        this.init(svgString, parent, options);
    };

    _.extend(Widget.prototype, {

        init: function(svgString, parent, options) {
            var that = this;
            this.pos = {left: 0, top: 0};
            this.size = {width: 1, height: 1};
            fabric.loadSVGFromString(svgString, function(objects, o) {
                that.group = new fabric.PathGroup(objects, o);
                if(_.isObject(options)) {
                    if(_.isObject(options.pos)) {
                        that.pos = options.pos;
                        that.group.set(options.pos);
                    }
                    if(_.isNumber(options.radius)) {
                        utils.setPathGroupRadius(that.group, options.radius);
                        that.size = {width: options.radius * 2 , height: options.radius * 2};
                    } else if (_.isObject(options.size)) {
                        utils.setPathGroupSize(that.group, options.size.width, options.size.height);
                        that.size = options.size;
                    }
                }
                if(_.isObject(parent)) {
                    parent.add(that.group);
                }
            });
        },

        setFromWidget: function(widget) {
            this.pos = widget.pos;
            this.size = widget.size;
            this.group = widget.group;
        },

        contains: function(x, y) {
            var widgetX = this.pos.left - this.size.width / 2.0;
            var widgetY = this.pos.top - this.size.height / 2.0;
            if(x >= widgetX && x <= widgetX + this.size.width
                && y >= widgetY && y <= widgetY + this.size.height) {
                return true;
            } else {
                return false;
            }
        },

        onClick: function() {}

    });

    return Widget;
});