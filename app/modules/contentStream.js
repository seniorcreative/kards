define(
    ['jquery',
    'modules/helpers',
    'modules/style'],

    function($, helpers, style) {

        // Setter functions (accept that for global scope) - where 'that' should be

        var that, paper, graph;

        var contentPathChosenModels = [];
        var decisionSnapshots       = {};
        var contentStreamSnapshots = {};

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

        var contentStreamSnapshot = function( answerKey )
        {

            console.log('contentStreamSnapshot rec', answerKey, contentStreamSnapshots, $('#content-nodes').html());

            if (answerKey in contentStreamSnapshots)
            {
                console.log('displaying the content element snapshot from answerKey in the hud ', answerKey );

                $('#content-nodes').html(hudContentElements);

            }
            else
            {

                console.log('storing the hud content element snapshot for answerKey', answerKey, $('#content-nodes').html() );

                var hudContentElements = (contentStreamSnapshots[answerKey] == undefined) ?  "" : contentStreamSnapshots[answerKey];

                contentStreamSnapshots[answerKey] = $('#content-nodes').html();
            }

        };

        var getModels = function()
        {

           return contentPathChosenModels;

        };

        return {
            init: init,
            addModel: addModel,
            getModels: getModels,
            decisionSnapshot: decisionSnapshot,
            contentStreamSnapshot: contentStreamSnapshot
        };


    }
);