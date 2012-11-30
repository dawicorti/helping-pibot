/*global define,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    return {

        resolution: [window.innerWidth, window.innerWidth / 3],

        forkMaxSize: 5,

        gameLoopPeriod: 100.0,

        gravity: -9.8,

        cameraTarget: { x: 20.0, y: 3.0 },

        cameraFieldWidth: 50.0,

        canvasTop: 200,

        levelsCount: 7,

        backgroundColor: '#2f1335',

        firstSoundtrack: '374975',
        secondSoundTrack: '374974'

    };
});