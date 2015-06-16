require.config({
  paths: {
    "underscore": "../bower_components/lodash/dist/lodash.underscore",
    "lodash": "../bower_components/lodash/dist/lodash",
    "geometry": "../bower_components/jointjs/src/geometry",
    "vectorizer": "../bower_components/jointjs/src/vectorizer",
    "template": "../bower_components/lodash-template-loader/loader",
    "jquery": "../bower_components/jquery/dist/jquery",
    "backbone": "../bower_components/backbone/backbone",
    "joint": "../bower_components/jointjs/dist/joint.all.clean.kards",
    "handlebars.runtime": "../bower_components/handlebars/handlebars.runtime"
  },

    shim: {
        backbone: {
            //These script dependencies should be loaded before loading backbone.js.
            deps: ['lodash', 'underscore',  'jquery'],
            //Once loaded, use the global 'Backbone' as the module value.
            exports: 'Backbone'
        },
        lodash: {
            exports: '_'
        },
        joint: {
            deps: ['geometry', 'vectorizer', 'lodash', 'jquery', 'backbone'],
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

  deps: ["main"]
});
