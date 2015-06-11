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
        gridSize: 1
    });

    // smaller paper
    var paperSmall = new joint.dia.Paper({
        el: $('#navigator'),
        width: 200,
        height: 500,
        model: graph,
        gridSize: 1
    });
    paperSmall.scale(0.25);
    paperSmall.$el.css('pointer-events', 'none');


    var rect = new joint.shapes.basic.Rect({
        position: { x: 300, y: 100 },
        size: { width: 120, height: 60 },
        attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)', rx: 4, ry: 4 }, text: { text: 'my box', fill: 'black' } }
    });

    var rect2 = rect.clone();
    rect2.translate(-200, 100);

    var rect3 = rect.clone();
    var attrs = rect3.get('attrs');
    //console.log(attrs);

    //attrs.text.text = 'cambio';
    //rect3.set('attrs');
    rect3.translate(0, 100);

    var rect4 = rect.clone();
    rect4.translate(200, 100);

    var link = new joint.dia.Link({
        source: { id: rect.id },
        target: { id: rect2.id }
    });

    var link2 = new joint.dia.Link({
        source: { id: rect.id },
        target: { id: rect3.id }
    });

    var link3 = new joint.dia.Link({
        source: { id: rect.id },
        target: { id: rect4.id }
    });

    graph.addCells([
        rect,
        rect2,
        rect3,
        rect4,
        link,
        link2,
        link3
    ]);


    //

    //link.on('all', function(eventName, cell) {
    //    console.log(arguments);
    //});

    //var controls = require(['controls']);

    console.log('controls', controls);

    controls.init(graph, paper);

    //console.log('graph', graph);



    //rect.on('change:position', function(element) {
    //    console.log(element.id, ':', element.get('position'));
    //});

});