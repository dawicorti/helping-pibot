require(
    {
        paths: {
            svg: '../svg',
            text: '../lib/require-text'
        }
    }, ['app'], function(App) {
        var app = new App();
        app.run();
    }
);
