define(function(require) {

    var volumeOnPrint = require('text!svg/volume_on.svg');

    var Interface = function() {
        this.init();
    };

    _.extend(Interface.prototype, {

        init: function() {
            this.widgets = [];
            this.addWidget(volumeOnPrint, {left: window.innerWidth - 48, top: 48});
        },

        addWidget: function(widgetPrint, options) {
            var that = this;
            fabric.loadSVGFromString(widgetPrint, function(objects, o) {
                var widget = new fabric.PathGroup(objects, o);
                widget.set(options);
                that.widgets.push(widget);
            });
        },

        update: function(root) {
            _.each(this.widgets, function(widget) {
                root.add(widget);
            });
        }

    });


    return Interface;
});