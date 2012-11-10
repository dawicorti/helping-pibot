require(
    {
        paths: {
            svg: '../svg',
            text: '../lib/require-text',
            underscore: '../lib/underscore',
            box2d: '../lib/box2d',
            fabric: '../lib/fabric',
            zepto: '../lib/zepto'
        },
        shim: {
            underscore: {
                exports: '_'
            },
            box2d: {
                exports: 'Box2D'
            },
            fabric: {
                exports: 'fabric'
            },
            zepto: {
                exports: '$'
            },
            myApp: {
                deps: ['zepto', 'underscore', 'box2d', 'fabric']
            }
        }
    },
    [
        'game/game',
        'levels/level'
    ],
    function (game, Level) {
        "use strict";

        var $ = require('zepto');
        $(function () {
            game.initialize();
            game.navigator.setCurrentMode(new Level(1));
        });
    }
);