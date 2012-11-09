/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        $ = require('zepto'),
        Dialog = require('dialog');

    function DropDialog() {
        this.init();
    }

    _.extend(DropDialog.prototype, Dialog.prototype);

    _.extend(DropDialog.prototype, {

        init: function () {
            Dialog.prototype.init.call(
                this,
                {name: 'drop', title: 'drop a chunk'}
            );
        }

    });

    return DropDialog;

});