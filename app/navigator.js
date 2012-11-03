define(function(require) {

    var settings = require('settings');

    var Navigator = function() {
        this.init();
    };

    _.extend(Navigator.prototype, {
        
        init: function() {
            var node = document.createElement('canvas');
            node.setAttribute('width', settings.RESOLUTION[0]);
            node.setAttribute('height', settings.RESOLUTION[1]);
            node.setAttribute('id', 'root');
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(node);
            this.root = new fabric.Canvas('root', {
                'width': settings.RESOLUTION[0],
                'height': settings.RESOLUTION[1]
            });
            this.root.backgroundColor = settings.BACKGROUND;
            _.each(body.childNodes, function(child) {
                if (!_.isUndefined(child.getAttribute)
                         && child.getAttribute('class') == 'canvas-container') {
                    child.setAttribute('style', 'position: absolute; left: 0; top: 200px');
                }
            });
        },

        update: function(delta) {
            this.root.clear();
            if (_.isObject(this.currentMode)) {
                this.currentMode.update(delta, this.root);
            }
        },

        setCurrentMode: function(mode) {
            if (_.isObject(this.currentMode)) {
                this.currentMode.unload();
            }
            this.currentMode = mode;
            this.currentMode.load();
        },

        width: function() {
            return settings.RESOLUTION[0];
        },

        height: function() {
            return settings.RESOLUTION[1];
        }
    });

    return Navigator;
});