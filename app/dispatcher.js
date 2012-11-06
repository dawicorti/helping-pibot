define(function() {

    return {

        on: function(name, callback) {
            $('#main').on(name, callback);
        },

        trigger: function(name, options) {
            $('#main').trigger(name, options);  
        }

    };

});