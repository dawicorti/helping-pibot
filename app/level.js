define(
    [
        'settings', 'mode', 'game', 'camera', 
        'chunk/rigidbox', 'chunk/staticbox', 'generated/robot'
    ], function(settings, Mode, game, Camera, RigidBox, StaticBox, drawRobot) {

    // Box2D aliases
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    
    var Level = function() {
        this.init();
    };

    _.extend(Level.prototype, Mode.prototype);

    _.extend(Level.prototype, {
        
        init: function() {
            Mode.prototype.init.call(this);
            this.camera = new Camera(
                settings.CAMERA_TARGET, settings.CAMERA_FIELD_WIDTH
            ); 
            this.world = new b2World(new b2Vec2(0, settings.GRAVITY), true);
            // test
            this.ground = new StaticBox(
                this.world, this.camera,
                {x: 0, y: -25}, this.group,
                {width: 100, height: 50}
            );
            // this.group.push(drawRobot(game.root));
            this.boxes = [];

            this.gBoxes = [];

            for(x = 3; x <= 12; x += 3) {
                this.gBoxes.push(new StaticBox(
                    this.world, this.camera,
                    {x: x, y: 4}, this.group,
                    {width: 1, height: 1}
                ));                
            }

            for(x = 5; x <= 15; x += 2) {
                for(y = 10; y < 30; y += 2) {
                    this.boxes.push(new RigidBox(
                        this.world,
                        this.camera,
                        {x: x, y: y},
                        this.group
                    ));
                }
            }
        },

        update: function(delta) {
            this.world.Step(delta / 1000.0, 8, 1);
            _.each(this.boxes, function(box) {
                box.update(delta);
            });
        }

    });

    return Level;

});