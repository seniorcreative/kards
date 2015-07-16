define(
    ['jquery',
    'modules/helpers',
    'modules/style'],

    function($, helpers, style) {

        // Setter functions (accept that for global scope) - where 'that' should be

        var that, paper, graph;

        var init = function (_scope, _paper, _graph) {

            that    = _scope;
            paper   = _paper;
            graph   = _graph;

            helpers.init(that, paper, graph);

        };


        return {
            init: init
        }


    }
);