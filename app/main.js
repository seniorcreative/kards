SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) { 
    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM()); 
};


(function(){

    var root = this;

    require.config({

        baseUrl: "app/",
        paths: {
            "app": "app",
            "underscore": "../bower_components/lodash/dist/lodash.underscore",
            "geometry": "../bower_components/jointjs/src/geometry",
            "vectorizer": "../bower_components/jointjs/src/vectorizer",
            //"template": "../bower_components/lodash-template-loader/loader",
            "jquery": "../bower_components/jquery/dist/jquery",
            "jquery-ui": "../bower_components/jquery-ui/jquery-ui",
            "lodash": "../bower_components/lodash/dist/lodash",
            "backbone": "../bower_components/backbone/backbone",
            "backbone.collectionView": "../bower_components/backbone.collectionView/dist/backbone.collectionView",
            "joint": "../bower_components/jointjs/dist/joint.all.clean.kards",
            "handlebars.runtime": "../bower_components/handlebars/handlebars.runtime" // Compile templates using handlebars --amd app/templates/*.hbs -f app/compiled-templates.js
        },

        shim: {
            lodash: {
                exports: '_'
            },
            backbone: {
                //These script dependencies should be loaded before loading backbone.js.
                deps: ['underscore', 'lodash', 'jquery'],
                //Once loaded, use the global 'Backbone' as the module value.
                exports: 'Backbone'
            },
            joint: {
                deps: ['geometry', 'vectorizer', 'jquery', 'backbone', 'underscore', 'lodash'],
                exports: 'joint',
                init: function(geometry, vectorizer) {
                    // JointJS must export geometry and vectorizer otheriwse
                    // they won't be exported due to the AMD nature of those libs and
                    // so JointJS would be missing them.
                    this.g = geometry;
                    this.V = vectorizer;
                }
            }
        },

        //deps: ["main"]
    });


    // Kick off the application.
    require([
        "app",
        //"router",
        //"modules/chart"
    ],

    function(app) {
        // Define your master router on the application namespace and trigger all
        // navigation from this instance.
        //app.router = new Router();

        //console.log('chart', chart);

        // Trigger the initial route and enable HTML5 History API support, set the
        // root folder to '/' by default.  Change in app.js.
        //Backbone.history.start({ pushState: true, root: app.root });

        app.run();

    });



})();
