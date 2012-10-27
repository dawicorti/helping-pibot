define(['game'], function(game) {

    /*
        A mode is the current controller/view in the root window
        It can be a level, a menu, or any interface
    */

    var Mode = function() {
        this.init();
    };

    Mode.prototype = {

        init: function() {
            this.group = game.root.set();
        },

        load: function() {
            this.group.show();
        },

        unload: function() {
            this.group.hide();
        }

    };


    return Mode;
});