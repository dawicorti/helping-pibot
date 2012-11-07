/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var $ = require('zepto');

    return {

        on: function (name, callback) {
            $('#main').on(name, callback);
        },

        trigger: function (name, options) {
            $('#main').trigger(name, options);
        }

    };

});