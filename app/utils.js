/*global define,window*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    return {
        setPathGroupSize: function (pathGroup, width, height) {
            pathGroup.set({
                scaleX: width / parseFloat(pathGroup.getBoundingRectWidth()),
                scaleY: height / parseFloat(pathGroup.getBoundingRectHeight())
            });
        },

        setPathGroupRadius: function (pathGroup, radius) {
            var scale = radius / (pathGroup.getBoundingRectWidth() / 2.0);
            pathGroup.set({scaleX: scale, scaleY: scale});
        }
    };

});