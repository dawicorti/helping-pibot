define(function(require) {

    var settings = require('settings');

    var Navigator = function() {
        this.initNavigator();
    };

    _.extend(Navigator.prototype, {
        
        initNavigator: function() {
            this.initRoot();
            this.initBackground();
        },

        initRoot: function() {
            this.root = Raphael(
                (window.innerWidth - this.width()) / 2,
                (window.innerHeight - this.height()) / 2,
                this.width(), this.height()
            );
        },

        initBackground: function() {
            var background = this.root.rect(0, 0, this.width(), this.height());
            background.attr({fill: settings.BACKGROUND})
        },

        update: function(delta) {
            if (_.isObject(this.currentMode)) {
                this.currentMode.update(delta);
            }
        },

        setCurrentMode: function(mode) {
            if (_.isObject(this.currentMode)) {
                this.currentMode.unload();
            }
            this.currentMode = mode;
            this.currentMode.load();
        },

        width: function() {
            return settings.RESOLUTION[0];
        },

        height: function() {
            return settings.RESOLUTION[1];
        }
    });

    return Navigator;
});