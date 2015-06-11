// Controls

define(
    ['joint'],

function(joint) {


    var init = function(graph, paper) {

        //console.log('inited ', graph);

        var formView = Backbone.View.extend(
            {
                events: {
                    'click .addQuestion': 'addQuestion',
                    'click .logGraph': 'saveGraph'
                },
                render: function () {
                    this.$el.html('<form>' +
                    '<input type="button" id="btnAdd" name="btnAdd" class="addQuestion" value="Add BooleanQuestion"><br>' +
                    '<input type="button" id="btnLog" name="btnLog" class="logGraph" value="Log Graph">' +
                    '</form>');
                    return this;
                },
                addQuestion: function () {

                    // Add the structure for a basic question.


                    var logicWrapper = new joint.shapes.devs.Model({
                        position: { x: 275, y: 50 },
                        size: { width: 450, height: 300 },
                        attrs: {
                            '.label': { text: 'Question logic', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                            rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgb(0,0,0)','stroke-dasharray':'5,5', rx: 5, ry: 10 },
                            '.inPorts circle': { fill: 'white' },
                            '.outPorts circle': { fill: 'white' }
                        }
                    });


                    logicWrapper.set('inPorts', ['newIn1', 'newIn2', 'newIn3']);
                    logicWrapper.set('outPorts', ['newOut1', 'newOut2']);

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



                },
                saveGraph: function () {
                    console.log(JSON.stringify(graph.toJSON()));
                }
            }
        );

        var fv = new formView();
        $('body').prepend(fv.render().el);

    };

    return {
        init: init
    };


});