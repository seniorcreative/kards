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

    graph.fromJSON({"cells":[{"type":"basic.Rect","position":{"x":300,"y":100},"size":{"width":120,"height":60},"angle":0,"id":"e370cf54-e0a3-4dce-8dd5-8363cf201bef","z":1,"attrs":{"rect":{"fill":"white","stroke":"rgb(0,0,0)","stroke-width":2,"rx":4,"ry":4},"text":{"text":"my box"}}},{"type":"basic.Rect","position":{"x":100,"y":200},"size":{"width":120,"height":60},"angle":0,"id":"5446778f-8064-4e3b-b461-48b95241d4d3","embeds":"","z":2,"attrs":{"rect":{"fill":"white","stroke":"rgb(0,0,0)","stroke-width":2,"rx":4,"ry":4},"text":{"text":"my first box"}}},{"type":"basic.Rect","position":{"x":300,"y":200},"size":{"width":120,"height":60},"angle":0,"id":"4c04aac2-dea6-47bf-8f7e-e11e35ebc0f5","embeds":"","z":3,"attrs":{"rect":{"fill":"white","stroke":"rgb(0,0,0)","stroke-width":2,"rx":4,"ry":4},"text":{"text":"my second box"}}},{"type":"basic.Rect","position":{"x":500,"y":200},"size":{"width":120,"height":60},"angle":0,"id":"2c42cde9-445a-435a-b4cd-305712711c4f","embeds":"","z":4,"attrs":{"rect":{"fill":"white","stroke":"rgb(0,0,0)","stroke-width":2,"rx":4,"ry":4},"text":{"text":"my box"}}},{"type":"link","source":{"id":"e370cf54-e0a3-4dce-8dd5-8363cf201bef"},"target":{"id":"5446778f-8064-4e3b-b461-48b95241d4d3"},"id":"8e49825a-736f-49ee-9776-58a9da06d069","z":5,"attrs":{}},{"type":"link","source":{"id":"e370cf54-e0a3-4dce-8dd5-8363cf201bef"},"target":{"id":"4c04aac2-dea6-47bf-8f7e-e11e35ebc0f5"},"id":"dd548036-f563-4294-8aa1-6e54bbbed545","z":6,"attrs":{}},{"type":"link","source":{"id":"e370cf54-e0a3-4dce-8dd5-8363cf201bef"},"target":{"id":"2c42cde9-445a-435a-b4cd-305712711c4f"},"id":"92b26211-c945-4ee4-a3a9-8a5c06252c36","z":7,"attrs":{}}]});


    //var rect = new joint.shapes.basic.Rect({
    //    position: { x: 300, y: 100 },
    //    size: { width: 120, height: 60 },
    //    attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)', rx: 4, ry: 4 }, text: { text: 'my box', fill: 'black' } }
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
    //    rect,
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

    console.log('controls', controls);

    controls.init(graph, paper);

    //console.log('graph', graph);

    console.log('stringified chart', JSON.stringify(graph.toJSON()));


});