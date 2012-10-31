define(function() {
    return {
        
        RESOLUTION: [window.innerWidth, window.innerWidth / 3],

        GAME_LOOP_PERIOD: 20, 

        GRAVITY: -9.8,

        CAMERA_TARGET: { x: 20.0, y: 3.0 },

        CAMERA_FIELD_WIDTH: 40.0,
        
        CHUNK_SIZE : { width: 1, height: 1},

        // Game theme :
        // http://www.colourlovers.com/palette/1480885/A_Night_in_Havana
        BACKGROUND: '#2f1335',

        // http://www.jamendo.com/fr/track/374975/midnight-blue?sid=album-a47898
        SOUNDTRACK: '374975'

    };
});