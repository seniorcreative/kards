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

    paper.on('cell:pointerdown', function(cellView, evt, x, y) {
        console.log('cell view clicked ' , cellView.model.id);
    });

    // smaller paper
    var paperSmall = new joint.dia.Paper({
        el: $('#navigator'),
        width: 1200,
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

            controls.init(graph, paper);

            var logicWrapper = new joint.shapes.devs.Model({
                position: { x: 275, y: 50 },
                size: { width: 450, height: 300 },
                inPorts: ['logic-in1'],
                outPorts: ['logic-out1'],
                attrs: {
                    '.label': { text: 'Question logic', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                    rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgb(0,0,0)','stroke-dasharray':'5,5', rx: 5, ry: 10 },
                    '.inPorts circle': { fill: 'white' },
                    '.outPorts circle': { fill: 'white' }
                }
            });

            //logicWrapper.on('batch:start', function(args, args2){ console.log(arguments)});

            var question = new joint.shapes.basic.Rect({
                position: { x: 450, y: 150 },
                size: { width: 100, height: 30 },
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'Q1', fill: 'black' } }
            });

            var answer1 = new joint.shapes.basic.Rect({
                position: { x: 350, y: 200 },
                size: { width: 100, height: 30 },
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'a1 - true', fill: 'black' } }
            });

            var answer2 = new joint.shapes.basic.Rect({
                position: { x: 550, y: 200 },
                size: { width: 100, height: 30 },
                attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'a2 - false', fill: 'black' } }
            });

            var link = new joint.dia.Link({
                smooth: true,
                source: { id: answer1.id },
                target: { id: question.id }
            });

            var link2 = new joint.dia.Link({
                smooth: true,
                source: { id: answer2.id },
                target: { id: question.id }
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

            //graph.on('batch:start', function(eventName, cell) {
            //    console.log(arguments);
            //});

            //
            //

            //rectDotted.embed(graph.getElements()[1]);
            //rectDotted.embed(graph.getElements()[2]);
            //rectDotted.embed(graph.getElements()[3]);


        }
    });

    //$.get('../data/json')
    //;


    //var rectDotted = new joint.shapes.basic.Rect({
    //    position: { x: 300, y: 100 },
    //    size: { width: 400, height: 500 },
    //    attrs: { rect: { fill: 'none', 'stroke-width': 2, stroke: 'rgb(0,0,0)', rx: 4, ry: 4, 'stroke-dasharray':'5,5' } }
    //});
    //
    //var rect2 = rect.clone();
    //rect2.translate(-200, 100);
    //
    //var rect3 = rect.clone();
    //var attrs = rect3.get('attrs');
    ////console.log(attrs);
    //
    ////attrs.text.text = 'cambio';
    ////rect3.set('attrs');
    //rect3.translate(0, 100);
    //
    //var rect4 = rect.clone();
    //rect4.translate(200, 100);
    //
    //var link = new joint.dia.Link({
    //    source: { id: rect.id },
    //    target: { id: rect2.id }
    //});
    //
    //var link2 = new joint.dia.Link({
    //    source: { id: rect.id },
    //    target: { id: rect3.id }
    //});
    //
    //var link3 = new joint.dia.Link({
    //    source: { id: rect.id },
    //    target: { id: rect4.id }
    //});
    //
    //graph.addCells([
    //    rectDotted
    //    rect2,
    //    rect3,
    //    rect4,
    //    link,
    //    link2,
    //    link3
    //]);


    //

    //link.on('all', function(eventName, cell) {
    //    console.log(arguments);
    //});

    //var controls = require(['controls']);





});