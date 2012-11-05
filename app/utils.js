define(function() {

    return {
        setPathGroupSize: function(pathGroup, width, height) {
            pathGroup.set({
                scaleX: width / (pathGroup.getBoundingRectWidth() * 1.0),
                scaleY: height / (pathGroup.getBoundingRectHeight() * 1.0)
            });
        },

        setPathGroupRadius: function(pathGroup, radius) {
            var scale = radius / (pathGroup.getBoundingRectWidth() / 2.0);
            pathGroup.set({scaleX: scale, scaleY: scale});
        }
    };

});