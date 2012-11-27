/*global define,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    return {

        resolution: [window.innerWidth, window.innerWidth / 3],

        forkMaxSize: 5,

        gameLoopPeriod: 40,

        gravity: -9.8,

        cameraTarget: { x: 20.0, y: 3.0 },

        cameraFieldWidth: 50.0,

        canvasTop: 200,
        // Game theme : http://www.colourlovers.com/palette/1480885/A_Night_in_Havana
        backgroundColor: '#2f1335',
        // http://www.jamendo.com/fr/track/374975/midnight-blue?sid=album-a47898
        soundtrack: '374975'

    };
});