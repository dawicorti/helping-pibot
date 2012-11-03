define(function(require) {

    var volumeOnPrint = require('text!svg/volume_on.svg');

    var Interface = function() {
        this.init();
    };

    _.extend(Interface.prototype, {

        init: function() {
            _.bindAll(this);
            this.widgets = [];
            this.addWidget(volumeOnPrint, {
                left: window.innerWidth - 10, top: 30, scaleX: 0.5, scaleY: 0.5
            });
        },

        onMouseDown: function() {
            console.log('mouse down');
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