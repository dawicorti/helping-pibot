define(['settings'], function(settings) {

    var Navigator = function() {

        var root = null;

        this.init = function() {
            _.bindAll(this);
            this.initRoot();
            this.initBackground();
        };

        this.initRoot = function() {
            root = Raphael(
                (window.innerWidth - this.width()) / 2,
                (window.innerHeight - this.height()) / 2,
                this.width(), this.height()
            );
        };

        this.initBackground = function() {
            var background = root.rect(0, 0, this.width(), this.height());
            background.attr({fill: settings.BACKGROUND})
        };

        this.width = function() {
            return settings.RESOLUTION[0];
        };

        this.height = function() {
            return settings.RESOLUTION[1];
        };

        this.init();
    };

    return Navigator;
});