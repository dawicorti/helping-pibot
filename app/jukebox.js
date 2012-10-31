define(function() {

    var Jukebox = function() {
        this.init();
    };

    _.extend(Jukebox.prototype, {

        init: function() {
            this.node = null;
        },

        playFromJamendo: function(trackId) {
            this.play(
                'http://api.jamendo.com'
                + '/get2/stream/track/redirect/'
                + '?id=' + trackId + '&streamencoding=mp31'
            );
        },

        play: function(source) {
            if(!_.isNull(this.node)) {
                this.node.parentNode.removeChild(this.node);
            }
            var audio = document.createElement('audio');
            var sourceNode = document.createElement('source');
            sourceNode.setAttribute('src', source);
            audio.setAttribute('autoplay', 'autoplay');
            audio.appendChild(sourceNode);
            document.getElementsByTagName('body')[0].appendChild(audio);
        }

    });

    return Jukebox;
});