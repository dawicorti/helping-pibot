define(['game', 'level'], function(game, Level) {

    var game = require('game');
    var Level = require('level');

    var App = function() {};

    _.extend(App.prototype, {

        onDOMReady: function() {
            game.initialize();
            var level1 = new Level();
            game.navigator.setCurrentMode(level1);
        },
        
        run: function() {
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
        }

    });

    return App;
});