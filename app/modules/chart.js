// Kick off the application.
define(
    ['joint',
    'modules/controls'],

function(joint, controls) {

    var graph = new joint.dia.Graph();

    var paper = new joint.dia.Paper({
        el: $('#canvas'),
        width: 2400,
        height: 2000,
        model: graph,
        gridSize: 1,
        defaultLink: new joint.dia.Link({
            smooth: true,
            attrs: {
                '.connection' : { 'stroke-width': '5px', 'stroke-linecap': 'round', opacity:.5 }
            }
        })
    });

    // smaller paper
    var paperSmall = new joint.dia.Paper({
        el: $('#navigator'),
        width: 500,
        height: 500,
        model: graph,
        gridSize: 1
    });
    paperSmall.scale(0.25);
    paperSmall.$el.css('pointer-events', 'none');

    //wherever you need to do the ajax
    Backbone.ajax({
        dataType: "json",
        url: "data/json.php",
        data: "",
        success: function(val){

            //graph.fromJSON(val);

            var basicQuestionJSON = val;

            $('body').prepend('<em>Data ready</em>');

            controls.init(graph, paper, paperSmall);

            var logicWrapper = new joint.shapes.devs.Model({
                ktype: 'logicwrapper',
                position: { x: 275, y: 250 },
                size: { width: 450, height: 300 },
                inPorts: ['l-i-1'],
                outPorts: ['l-o-1'],
                attrs: {
                    '.label': { text: 'Question logic', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                    rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgb(0,0,0)','stroke-dasharray':'5,5', rx: 5, ry: 10 },
                    '.inPorts circle': { fill: 'white' },
                    '.outPorts circle': { fill: 'white' }
                }
            });



            var question = new joint.shapes.basic.Rect({
                ktype: 'question',
                position: { x: 430, y: 300 },
                size: { width: 150, height: 75 },
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'Q1', fill: 'black' } }
            });

            var answer1 = new joint.shapes.basic.Rect({
                ktype: 'answer',
                position: { x: 350, y: 400 },
                size: { width: 100, height: 30 },
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'a1 - true', fill: 'black' } }
            });

            var answer2 = new joint.shapes.basic.Rect({
                ktype: 'answer',
                position: { x: 550, y: 400 },
                size: { width: 100, height: 30 },
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'a2 - false', fill: 'black' } }
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
                    id: answer1.id
                },
                target: {
                    id: logicWrapper.id,
                    port: 'l-o-1'
                }
            });

            graph.addCells([link3, link4]);



        }
    });



});