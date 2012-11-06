define(function(require) {

    var Widget = require('widget');
    var volumeOnPrint = require('text!svg/volume_on.svg');
    var volumeOffPrint = require('text!svg/volume_off.svg');
    var dispatcher = require('dispatcher'); 


    var Volume = function(parent) {
        this.init(parent);
    };

    _.extend(Volume.prototype, Widget.prototype);

    _.extend(Volume.prototype, {

        init: function(parent) {
            var options = {pos: {left: '98%', top: '8%'}, radius: '2%'};

            this.volumeOn = new Widget(volumeOnPrint, null, options);
            this.volumeOff = new Widget(volumeOffPrint, null, options);
            this.enable = true;
            this.parent = parent;
            this.setFromWidget(this.volumeOn);
            parent.add(this.group);
        },

        onClick: function() {
            this.parent.remove(this.group);
            if(this.enable) {
                this.setFromWidget(this.volumeOff);
                dispatcher.trigger('volume:disable');
                this.enable = false;
            } else {
                this.setFromWidget(this.volumeOn);
                dispatcher.trigger('volume:enable');
                this.enable = true;
            }
            this.parent.add(this.group);
        },



    });


    return Volume;

});