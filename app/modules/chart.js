// Kick off the application.
define(
    ['joint',
    'modules/controls',
    'modules/papercontrols',
    'modules/boundinglogicexpansion'],

function(joint, controls, paperControls, boundingLogicExpansion) {



    var questionLayout = {
        boolean: {
            lwPos: {x: 485, y: 250},
            lwSize: {width: 450, height: 300},
            qPos: {x: 620, y: 280},
            qSize: {width: 175, height: 100},
            aPos: [{x: 520, y: 410}, {x: 720, y: 410}],
            aSize: {width: 175, height: 100}
        },
        'multiple choice': {
            lwPos: {x: 450, y: 250},
            lwSize: {width: 820, height: 300},
            qPos: {x: 770, y: 280},
            qSize: {width: 175, height: 100},
            aPos: [{x: 470, y: 410}, {x: 670, y: 410}, {x: 870, y: 410}, {x: 1070, y: 410}],
            aSize: {width: 175, height: 100}
        }
    };

    var graph = new joint.dia.Graph();

    var paper = new joint.dia.Paper({
        el: $('#canvas'),
        width: 2400,
        height: 2400,
        model: graph,
        gridSize: 10,
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

    //wherever you need to do the ajax
    Backbone.ajax({
        dataType: "json",
        url: "data/json.php",
        data: "",
        success: function (val) {
            var basicQuestionJSON = val;
            $('body').prepend('<div class="alert"><em>Data ready</em></div>');
        }
    });

    //graph.fromJSON(val);

    controls.init(graph, paper, questionLayout);

    // If you want paper controls.
    paperControls.init(graph, paper);

    // If you want bounding box expansion on logic wrappers.
    boundingLogicExpansion.init(graph, paper);


});