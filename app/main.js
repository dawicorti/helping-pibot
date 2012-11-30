/*global navigator,document*/
/*jslint nomen: true*/

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
            var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
            if (isChrome) {
                game.initialize();
                game.navigator.setCurrentMode(new Level(7));
            } else {
                $('body').append(
                    $('<p></p>')
                        .addClass('chrome-only')
                        .append(
                            $('<span></span>')
                                .addClass('sorry')
                                .html('Sorry.')
                        )
                        .append('for the moment this game is only available on')

                        .append(
                            $('<a></a>')
                                .attr('href', 'https://www.google.com/chrome')
                                .append(
                                    $('<span></span>')
                                        .addClass('chrome')
                                        .html('Chrome browser')
                                )
                        )
                );
            }
        });
    }
);