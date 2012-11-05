define(function(require) {

    var Volume = require('widgets/volume');

    var UserInterface = function() {
        this.init();
    };

    _.extend(UserInterface.prototype, {

        init: function() {
            _.bindAll(this);
            this.group = new fabric.Group();
            this.widgets = [
                new Volume(this.group)
            ];
        },

        onClick: function(x, y) {
            _.each(this.widgets, function(widget) {
                if(widget.contains(x, y)) {
                    widget.onClick();
                }
            }, this);
        },

        update: function(root) {
            root.add(this.group);
        }

    });


    return UserInterface;
});