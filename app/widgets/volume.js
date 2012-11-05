define(function(require) {

    var Widget = require('widget');
    var volumeOnPrint = require('text!svg/volume_on.svg');
    var volumeOffPrint = require('text!svg/volume_off.svg');

    var Volume = function(parent) {
        this.init(parent);
    };

    _.extend(Volume.prototype, Widget.prototype);

    _.extend(Volume.prototype, {

        init: function(parent) {
            this.volumeOn = new Widget(volumeOnPrint, null, {
                pos: {left: window.innerWidth - 10, top: 30},
                radius: 24
            });
            this.volumeOff = new Widget(volumeOffPrint, null, {
                pos: {left: window.innerWidth - 10, top: 30},
                radius: 24
            });
            this.enable = true;
            this.parent = parent;
            this.setFromWidget(this.volumeOn);
            parent.add(this.group);
        },

        onClick: function() {
            this.parent.remove(this.group);
            if(this.enable) {
                this.setFromWidget(this.volumeOff);
                this.enable = false;
            } else {
                this.setFromWidget(this.volumeOn);
                this.enable = true;
            }
            this.parent.add(this.group);
        },



    });


    return Volume;

});