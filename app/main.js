require(
    {
        paths: {
            svg: '../svg',
            text: '../lib/require-text'
        }
    }, ['game', 'level'], function(game, Level) {
        Zepto(function($){
            game.initialize();
            game.navigator.setCurrentMode(new Level(1));
        });
    }
);