// Controls

define(
    ['joint'],

function(joint) {


    var init = function(graph, paper, questionLayout) {

        //console.log('inited ', graph);

        var selectedQuestion;
        var selectedAnswer;

        paper.on('cell:pointerdown', function(cellView, evt, x, y) {

            console.log('cell view clicked ', cellView.model, 'linked neighbours', graph.getNeighbors(cellView.model), 'parent', cellView.model.get('parent'));

            if (cellView.model.attributes.ktype == 'question')
            {
                selectedQuestion = cellView.model;

                // adjust style of clicked element
                var attrs           = selectedQuestion.get('attrs');
                attrs.rect['stroke-dasharray'] = '5,5';
                cellView.model.set('attrs', attrs);
                cellView.render().el;

            }


            if (cellView.model.attributes.ktype == 'answer')
            {
                selectedAnswer = cellView.model;

                // adjust style of clicked element
                var attrs           = selectedAnswer.get('attrs');
                attrs.rect['stroke-dasharray'] = '2,3';
                cellView.model.set('attrs', attrs);
                cellView.render().el;

            }


            if (cellView.model.attributes.ktype == 'content')
            {
                selectedAnswer = cellView.model;

                // adjust style of clicked element
                var attrs           = selectedAnswer.get('attrs');
                attrs.rect['stroke-dasharray'] = '5,1';
                cellView.model.set('attrs', attrs);
                cellView.render().el;

            }



        });

        paper.on('cell:pointerup', function(cellView, evt, x, y) {

            /*if (cellView.model.attributes.type == 'basic.Rect') {
                // turn clicked element back.
                var attrs = cellView.model.get('attrs');
                attrs.rect.fill = 'rgba(0,0,0,0)';
                cellView.model.set('attrs', attrs);
                cellView.render().el;
            }*/

        });



        var formView = Backbone.View.extend(
            {
                el: '.formQuestionOptions',
                initialize: function () {
                    this.template = _.template($('.formQuestionOptions').html());
                    this.render();
                },
                events: {
                        'click #btnQuestionAdd': 'addQuestion',
                        'click #btnAddAnswer': 'addAnswer',
                        'click #btnAddLogicOutPoint': 'addLogicOutPoint',
                        'click #btnAddContent': 'addContent',
                        'click #btnLogGraph': 'saveGraph'
                },
                render: function () {
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    return this;
                },
                addAnswer: function()
                {


                    // Let's add an answer to the selected question!

                    // let's add another answer by cloning the first answr in this questions child neighbours.

                    var neighbours      = graph.getNeighbors(selectedQuestion);
                    var n1              = neighbours[neighbours.length-1];
                    var newAnswer       = n1.clone();
                    var pos             = newAnswer.get('position');
                    var attrs           = newAnswer.get('attrs');
                    attrs.text.text     = 'a ' + (neighbours.length+1) + ' - ?';
                    pos.x               += 200;

                    newAnswer.set('position', pos);

                    graph.addCell(newAnswer);


                    // Set a new link

                    var linkNew = new joint.dia.Link({
                        smooth: true,
                        source: { id: selectedQuestion.id },
                        target: { id: newAnswer.id }
                    });

                    graph.addCell(linkNew);

                    // embed this answer under the question (which is embedded into the logic wrapper)

                    graph.getCell(selectedQuestion.get('parent')).embed(newAnswer);

                    graph.trigger('change:position', newAnswer, pos, {skipParentHandler:false});



                },
                addQuestion: function (e) {


                    console.log('e', e);


                    // Add the structure for a basic question.


                    var logicWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: questionLayout.boolean.lwPos,
                        size: questionLayout.boolean.lwSize,
                        attrs: {
                            '.label': { text: 'Question logic', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                            rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgb(0,0,0)','stroke-dasharray':'5,5', rx: 5, ry: 10 },
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
                        attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'Q1', fill: 'black' } },
                        input: 'Q1 text',
                        skipParentHandler: true
                    });

                    var answer1 = new joint.shapes.html.Element({
                        ktype: 'answer',
                        position: questionLayout.boolean.aPos[0],
                        size: questionLayout.boolean.aSize,
                        attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'a1 - true', fill: 'black' } },
                        input: 'A1 text'
                    });

                    var answer2 = new joint.shapes.html.Element({
                        ktype: 'answer',
                        position: questionLayout.boolean.aPos[1],
                        size: questionLayout.boolean.aSize,
                        attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'a2 - false', fill: 'black' } },
                        input: 'A2 text'
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


                    // Embed question in logic wrapper.
                    logicWrapper.embed(question);

                    // Embed answers in questions ?
                    logicWrapper.embed(answer1);
                    logicWrapper.embed(answer2);

                    //question.embed(answer1);
                    //question.embed(answer2);

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



                },
                addLogicOutPoint: function() {

                    // Let's add an out port to the parent of the selected answer.

                    var parentLogicWrapper = graph.getCell(selectedAnswer.get('parent'));

                    var newOutports = parentLogicWrapper.attributes.outPorts;
                    var ar = [];
                    for(lo in newOutports)
                    {
                        ar[lo] = newOutports[lo];
                    }

                    ar.push("l-0-" + (newOutports.length+1));
                    parentLogicWrapper.set('outPorts', ar);

                },
                addContent: function()
                {

                    var contentWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: { x: 500, y: 500 },
                        size: { width: 350, height: 150 },
                        attrs: {
                            '.label': { text: 'Content', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                            rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgb(0,0,0)', rx: 2, ry: 4 },
                            '.inPorts circle': { fill: '#cccccc' },
                            '.outPorts circle': { fill: '#cccccc' }
                        }
                    });

                    contentWrapper.set('inPorts', ['c-i-1']);
                    contentWrapper.set('outPorts', ['c-o-1']);

                    var content = new joint.shapes.html.Element({
                        ktype: 'content',
                        position: { x: 505, y: 505 },
                        size: { width: 340, height: 140 },
                        attrs: { rect: { fill: 'white', 'stroke-width': 1, stroke: 'rgb(0,0,0,0.5)', style:{'pointer-events':'none'} }, text: { text: '', fill: 'black' }},
                        label: '',
                        textarea: 'lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing.',
                        select: 'one',
                        interactive: false
                    });

                    graph.addCells([contentWrapper, content]);


                    contentWrapper.embed(content);

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