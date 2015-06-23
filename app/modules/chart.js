// Kick off the application.
define(
    ['joint',
    'modules/controls',
    'modules/papercontrols',
    'modules/boundinglogicexpansion',
    ],

function(joint, controls, paperControls, boundingLogicExpansion) {


    var graph = new joint.dia.Graph();

    var paper = new joint.dia.Paper({
        el: $('#canvas'),
        width: 2400,
        height: 2400,
        model: graph,
        gridSize: 15,
        defaultLink: new joint.dia.Link({
            smooth: true,
            attrs: {
                '.connection' : { 'stroke-width': 5, 'stroke-linecap': 'round', opacity:.5 }
            }
        })
    });

    // smaller paper
/*    var paperSmall = new joint.dia.Paper({
        el: $('#navigator'),
        width: 500,
        height: 500,
        model: graph,
        gridSize: 1
    });
    paperSmall.scale(0.25);
    paperSmall.$el.css('pointer-events', 'none');*/

    //graph.fromJSON(val);

    controls.init(graph, paper);

    // If you want paper controls.
    paperControls.init(graph, paper);

    // If you want bounding box expansion on logic wrappers.
    boundingLogicExpansion.init(graph, paper);


    $('#testCheckBox').on('change', function() {

        if ($('#testCheckBox').is(':checked')) {

            $('.formReportOptions').animate({'left': -400}, 250);
            $('.formSectionOptions').animate({'left': -400}, 250);
            $('.formQuestionOptions').animate({'left': -400}, 250);
            $('.formAnswerOptions').animate({'right': -400}, 250);
            $('.formContentOptions').animate({'right': -400}, 250);
            //$('.formPanelControls').animate({'left': -400}, 250);

        }
        else
        {
            $('.formReportOptions').animate({'left': 10}, 250);
            $('.formSectionOptions').animate({'left': 10}, 250);
            $('.formQuestionOptions').animate({'left': 10}, 250);
            $('.formAnswerOptions').animate({'right': 10}, 250);
            $('.formContentOptions').animate({'right': 10}, 250);
            //$('.formPanelControls').animate({'left': 10}, 250);

        }

    });

});