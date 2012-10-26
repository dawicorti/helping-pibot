require(
    {
        paths: {
            app: 'app'
        }
    }, ['app'], function(App) {
        var app = new App();
        app.run();
    }
);
