define(
    ['jquery',
    'modules/helpers',
    'modules/style'],

    function($, helpers, style) {

        // Setter functions (accept that for global scope) - where 'that' should be

        var that, paper, graph;

        var contentPathChosenModels = [];
        var decisionSnapshots       = {};
        var individualisation       = [];

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


        var individualisationAppend = function ( data )
        {

            individualisation.push(data);

        };


        var getIndividualisation = function (  )
        {

            var output = '';

            for(var data in individualisation)
            {

                if (individualisation[data].type == 'question')
                {

                    output += '<br><br><br>';

                    output += "<strong>if question</strong>" + ': ' + individualisation[data].content + ' ' ;

                }


               /* if (individualisation[data].type == 'answer')
                {

                    //output += '<br><br>';

                    output += "<strong> has this answer</strong>" + ': ' + individualisation[data].content + ' ' ;

                }*/

                if (individualisation[data].type == 'content')
                {

                    output += '<br><br>';

                    output += "<strong> then show this information</strong>" + ': ' + individualisation[data].content + ' ' ;

                }

                if (individualisation[data].type == 'answer')
                {

                    output += '<strong>has this answer </strong>: ' + individualisation[data].value;
                    if (individualisation[data].value2) output += ', <strong> and this answer range high value</strong>: ' + individualisation[data].value2;

                }

                if (individualisation[data].type == 'endpoint')
                {

                    output += '<br><br>';

                    output += "<strong> then go to this end point </strong>" + ': ' + individualisation[data].content + ' ' ;

                }


            }

            return "<h3>Showing individualisation / preventative route for "+ window.reportModel.reportTitle +"</h3>" + output;

        };


        var decisionSnapshot = function( selectedQuestion )
        {


            var questionSnapshotReference = "Q" + selectedQuestion.model.get('questionNumber');

            if (decisionSnapshots[questionSnapshotReference] != undefined)
            {
                //console.log(' using the snapshot from question ', questionSnapshotReference );

                contentPathChosenModels = [];

                for(var s in decisionSnapshots[questionSnapshotReference])
                {

                    contentPathChosenModels[s] = decisionSnapshots[questionSnapshotReference][s];

                }


            }
            else
            {

                //console.log('setting the preceding snapshot from question ', questionSnapshotReference );

                decisionSnapshots[questionSnapshotReference] = [];

                for(var s in decisionSnapshots[questionSnapshotReference]) {

                    decisionSnapshots[questionSnapshotReference][s] = contentPathChosenModels[s];

                }

            }

            //console.log('looking at contentPathChosenModels', contentPathChosenModels);


        };


        var getModels = function()
        {

           return contentPathChosenModels;

        };

        var reset = function()
        {

            contentPathChosenModels = [];
            decisionSnapshots       = {};
            individualisation       = [];

        };

        return {
            init: init,
            addModel: addModel,
            getModels: getModels,
            decisionSnapshot: decisionSnapshot,
            individualisationAppend: individualisationAppend,
            getIndividualisation: getIndividualisation,
            reset: reset
        };


    }
);