define(['game'], function(game) {

    var App = function() {

        this.onDOMReady = function() {
            game.initialize();
        };
        
        this.run = function() {
            var that = this;
            // Thanks StackOverflow (3989095) !
            if ( document.addEventListener ) {
                DOMContentLoaded = function() {
                    document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                    that.onDOMReady();
                };
            } else if ( document.attachEvent ) {
                DOMContentLoaded = function() {
                    if ( document.readyState === "complete" ) {
                        document.detachEvent( "onreadystatechange", DOMContentLoaded );
                        that.onDOMReady();
                    }
                };
            }
            if ( document.readyState === "complete" ) {
                setTimeout(that.onDOMReady, 1 );
            }
            if ( document.addEventListener ) {
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                window.addEventListener( "load", that.onDOMReady, false);
            } else if ( document.attachEvent ) {
                document.attachEvent("onreadystatechange", DOMContentLoaded);
                window.attachEvent( "onload", that.onDOMReady);

            }        
        };

        _.bindAll(this);
    };

    return App;
});