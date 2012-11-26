/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    var _ = require('underscore'),
        settings = require('core/settings'),
        Widget = require('widgets/widget'),
        forkerPrint = require('text!svg/forker.svg'),
        ForkerSlot = require('widgets/forkerslot'),
        dispatcher = require('core/dispatcher');


    function Forker(parent, base) {
        this.init(parent, base);
    }

    _.extend(Forker.prototype, Widget.prototype);

    _.extend(Forker.prototype, {

        init: function (parent, base) {
            _.bindAll(this);
            Widget.prototype.init.call(
                this,
                forkerPrint,
                parent,
                {pos: {left: '50%', top: '50%'}, radius: '0%'}
            );
            this.chunkDef = base.def;
            this.chunkId = base.id;
            this.slots = [];
            this.chunks = [];
            dispatcher.on('forker:slot:click', this.onClickSlot);
        },

        onClickSlot: function (event) {
            var slot = event.data.slot,
                isSlotFillable = false,
                alreadyExists = false;
            _.each(this.chunks, function (chunk) {
                if (chunk.options.row === slot.row
                        && Math.abs(chunk.options.col - slot.col) === 1) {
                    isSlotFillable = true;
                } else if (chunk.options.col === slot.col
                        && Math.abs(chunk.options.row - slot.row) === 1) {
                    isSlotFillable = true;
                } else if (chunk.options.col === slot.col
                        && chunk.options.row === slot.row) {
                    alreadyExists = true;
                }
            });

            if (!alreadyExists) {
                if (isSlotFillable) {
                    this.addChunkAt(slot.row, slot.col);
                } else {
                    slot.setAsBadChoice();
                }
            }
        },

        onSVGLoaded: function (objects, o) {
            Widget.prototype.onSVGLoaded.call(this, objects, o);
            this.group.set({opacity: 0.4});
            this.show();
        },

        animate: function () {
            var radius = parseInt(this.options.radius.replace('%', ''), 10);
            if (radius < 10) {
                radius += 2;
                _.delay(this.animate, 100);
            } else {
                radius = 10;
                this.onOpen();
            }
            this.options.radius = radius + '%';
        },

        onOpen: function () {
            this.addSlots();
            this.addChunks();
        },

        addChunkAt: function (row, col) {
            var middle = (settings.forkMaxSize / 2.0) - 0.5,
                name = this.chunkDef;
            if (_.isObject(this.chunkDef)) {
                name = this.chunkDef.name;
            }
            require(['text!svg/' + name + '.svg'], function (print) {
                this.chunks.push(new Widget(
                    print,
                    this.parent,
                    {
                        radius: (8 / settings.forkMaxSize) + '%',
                        pos: {
                            left: (50 + ((col - middle) * (16 / settings.forkMaxSize))) + '%',
                            top: (50 + ((row - middle) * (48 / settings.forkMaxSize))) + '%'
                        },
                        row: row,
                        col: col
                    }
                ));
            }.bind(this));
        },

        addChunks: function () {
            if (_.isString(this.chunkDef)) {
                this.addChunkAt(
                    Math.floor(settings.forkMaxSize / 2),
                    Math.floor(settings.forkMaxSize / 2)
                );
            } else if (_.isObject(this.chunkDef)) {
                _.each(this.chunkDef.slots, function (slot) {
                    this.addChunkAt(
                        Math.floor(settings.forkMaxSize / 2) + slot.y,
                        Math.floor(settings.forkMaxSize / 2) + slot.x
                    );
                }, this);
            }
        },

        addSlots: function () {
            var row = 0,
                col = 0,
                middle = (settings.forkMaxSize / 2.0) - 0.5;
            for (row = 0; row < settings.forkMaxSize; row += 1) {
                for (col = 0; col < settings.forkMaxSize; col += 1) {
                    this.slots.push(new ForkerSlot(
                        this.parent,
                        {
                            radius: (8 / settings.forkMaxSize) + '%',
                            pos: {
                                left: (50 + ((col - middle) * (16 / settings.forkMaxSize))) + '%',
                                top: (50 + ((row - middle) * (48 / settings.forkMaxSize))) + '%'
                            },
                            row: row,
                            col: col
                        }
                    ));

                }
            }
        },

        onClick: function (x, y) {
            _.each(this.slots, function (slot) {
                if (slot.contains(x, y)) {
                    slot.onClick(x, y);
                }
            }, this);
        },

        onMouseDown: function (x, y) {
            _.each(this.slots, function (slot) {
                if (slot.contains(x, y)) {
                    slot.onMouseDown(x, y);
                }
            }, this);
        },

        onMouseUp: function () {
            _.each(this.slots, function (slot) {
                slot.onMouseUp();
            }, this);
        },

        show: function () {
            this.visible = true;
            this.parent.add(this.group);
            _.delay(this.animate, 100);
        },

        hide: function () {
            this.visible = false;
            this.parent.remove(this.group);
            this.options.radius = '0%';
        },

        update: function () {
            Widget.prototype.update.call(this);
            _.each(this.slots, function (slot) {
                slot.update();
            }, this);
            _.each(this.chunks, function (chunk) {
                chunk.update();
            }, this);
        }


    });

    return Forker;

});