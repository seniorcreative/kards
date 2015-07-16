define(
    ['jquery',
    'modules/helpers',
    'modules/style'],

    function($, helpers, style) {

        // Setter functions (accept that for global scope) - where 'that' should be

        var that, paper, graph;

        var contentPathChosenModels = [];

        var init = function (_scope, _paper, _graph) {

            that    = _scope;
            paper   = _paper;
            graph   = _graph;

            helpers.init(that, paper, graph);

        };

        // Need to be able to store all models passed over on a recursion stream
        var addModel = function( model)
        {

            contentPathChosenModels.push(model);

        };

        var getModels = function()
        {

           return contentPathChosenModels;

        };

        return {
            init: init,
            addModel: addModel,
            getModels: getModels
        }


    }
);