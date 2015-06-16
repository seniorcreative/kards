require.config({
  paths: {
    "underscore": "../bower_components/lodash/dist/lodash.underscore",
    "geometry": "../bower_components/jointjs/src/geometry",
    "vectorizer": "../bower_components/jointjs/src/vectorizer",
    //"template": "../bower_components/lodash-template-loader/loader",
    "jquery": "../bower_components/jquery/dist/jquery",
    "lodash": "../bower_components/lodash/dist/lodash",
    "backbone": "../bower_components/backbone/backbone",
    "joint": "../bower_components/jointjs/dist/joint.all.clean.kards",
    "handlebars.runtime": "../bower_components/handlebars/handlebars.runtime" // Compile templates using handlebars --amd app/templates/*.hbs -f app/compiled-templates.js
  },

    shim: {
        backbone: {
            //These script dependencies should be loaded before loading backbone.js.
            deps: ['underscore', 'lodash', 'jquery'],
            //Once loaded, use the global 'Backbone' as the module value.
            exports: 'Backbone'
        },
        joint: {
            deps: ['geometry', 'vectorizer', 'jquery', 'underscore', 'lodash', 'backbone'],
            exports: 'joint',
            init: function(geometry, vectorizer) {
                // JointJS must export geometry and vectorizer otheriwse
                // they won't be exported due to the AMD nature of those libs and
                // so JointJS would be missing them.
                this.g = geometry;
                this.V = vectorizer;
            }
        },
        lodash: {
            exports: '_'
        }
    },

  deps: ["main"]
});
