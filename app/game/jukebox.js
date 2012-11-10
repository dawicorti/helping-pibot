/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        dispatcher = require('core/dispatcher');

    function Jukebox() {
        this.init();
    }

    _.extend(Jukebox.prototype, {

        init: function () {
            _.bindAll(this);
            this.node = null;
            var that = this;
            dispatcher.on('volume:disable', this.mute);
            dispatcher.on('volume:enable', this.unmute);
        },

        playFromJamendo: function (trackId) {
            this.play([
                'http://api.jamendo.com'
                    + '/get2/stream/track/redirect/'
                    + '?id=' + trackId + '&streamencoding=ogg2'
            ]);
        },

        mute: function () {
            if (!_.isNull(this.node)) {
                this.node.muted = true;
            }
        },

        unmute: function () {
            if (!_.isNull(this.node)) {
                this.node.muted = false;
            }
        },

        play: function (sources) {
            if (!_.isNull(this.node)) {
                this.node.parentNode.removeChild(this.node);
            }
            var audio = document.createElement('audio');
            _.each(sources, function (source) {
                var sourceNode = document.createElement('source');
                sourceNode.setAttribute('src', source);
                audio.appendChild(sourceNode);
            });
            audio.setAttribute('autoplay', 'autoplay');
            document.getElementsByTagName('body')[0].appendChild(audio);
            this.node = audio;
        }

    });

    return Jukebox;
});