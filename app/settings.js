define(function() {
    return {
        
        RESOLUTION: [window.innerWidth, window.innerWidth / 3],
        
        GAME_LOOP_PERIOD: 16, 

        GRAVITY: -9.8,

        CAMERA_TARGET: { x: 20, y: 3 },

        CAMERA_FIELD_WIDTH: 40,
        
        CHUNK_SIZE : { width: 1, height: 1},

        BACKGROUND: '#2f1335'

    };
});