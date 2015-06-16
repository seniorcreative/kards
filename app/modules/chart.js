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
        success: function(val){

            //graph.fromJSON(val);

            var basicQuestionJSON = val;

            $('body').prepend('<div class="alert"><em>Data ready</em></div>');

            controls.init(graph, paper, questionLayout);

            // If you want paper controls.
            paperControls.init(graph, paper);

            // If you want bounding box expansion on logic wrappers.
            boundingLogicExpansion.init(graph, paper);

            var logicWrapper = new joint.shapes.devs.Model({
                ktype: 'logicwrapper',
                position: questionLayout.boolean.lwPos,
                size:  questionLayout.boolean.lwSize,
                attrs: {
                    '.label': { text: 'Question logic', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                    rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgba(0,0,0,0.75)', rx: 5, ry: 10 },
                    '.inPorts circle': { fill: '#cccccc' },
                    '.outPorts circle': { fill: '#cccccc' }
                }
            });

            logicWrapper.set('inPorts', ['l-i-1']);
            logicWrapper.set('outPorts', ['l-o-1']);

            var question = new joint.shapes.html.Element({
                ktype: 'question',
                position: questionLayout.boolean.qPos,
                size: questionLayout.boolean.qSize,
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'Q1', fill: 'black' }},
                label: 'Question 1',
                input: 'qqq?',
                select: 'one'
            });

            var answer1 = new joint.shapes.html.Element({
                ktype: 'answer',
                position: questionLayout.boolean.aPos[0],
                size: questionLayout.boolean.aSize,
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'a1 - true', fill: 'black' }},
                label: 'Answer 1',
                input: 'abc?',
                select: 'one'
            });

            var answer2 = new joint.shapes.html.Element({
                ktype: 'answer',
                position: questionLayout.boolean.aPos[1],
                size: questionLayout.boolean.aSize,
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'a2 - false', fill: 'black' } },
                label: 'Answer 2',
                input: 'def?',
                select: 'one'
            });

            var link = new joint.dia.Link({
                smooth: true,
                source: { id: question.id },
                target: { id: answer1.id }
            });

            var link2 = new joint.dia.Link({
                smooth: true,
                source: { id: question.id },
                target: { id: answer2.id }
            });


            logicWrapper.embed(question);
            logicWrapper.embed(answer1);
            logicWrapper.embed(answer2);

            graph.addCells([
                    logicWrapper,
                    question,
                    answer1,
                    answer2,
                    link,
                    link2
            ]);

            logicWrapper.toBack();
            question.toFront();

            // Add special links from answers to logic out points;

            var link3 = new joint.shapes.devs.Link({
                source: {
                    id: logicWrapper.id,
                    port: 'l-o-1'
                },
                target: {
                    id: answer2.id
                }
            });

            var link4 = new joint.shapes.devs.Link({
                source: {
                    id: logicWrapper.id,
                    port: 'l-o-1'
                },
                target: {
                    id: answer1.id
                }
            });

            graph.addCells([link3, link4]);



        }
    });




});