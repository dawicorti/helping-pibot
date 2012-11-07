/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    return {
        chunks: [
            {name: 'staticbox', pos: {x: 4.8, y: 0}, options: {width: 10, height: 1}},
            {name: 'staticbox', pos: {x: 10.5, y: -1}, options: {width: 1, height: 1}},
            {name: 'staticbox', pos: {x: 21.2, y: 0}, options: {width: 20, height: 1}},
            {name: 'staticbox', pos: {x: 41.2, y: -0.5}, options: {width: 20, height: 1}},
            {name: 'staticbox', pos: {x: 51.2, y: 0.5}, options: {width: 1, height: 1}},
            {name: 'rigidbox', pos: {x: 9.8, y: 5}}
        ]
    };

});