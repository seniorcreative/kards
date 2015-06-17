// Controls

define(
    ['joint',
    'handlebars.runtime',
    'compiled-templates'],

function(joint, HRT) {


    var init = function(graph, paper) {

        //console.log('inited ', graph);

        var selectedQuestion;
        var selectedAnswer;
        var newQuestionType;
        var valueDataTypes;


        // Layout

        var stageCenterX = (window.innerWidth / 2);
        var stageCenterY = (window.innerHeight / 2);
        var answerMargin = 25;
        var questionMarginBottom = 130;
        var newQuestionX, newQuestionY, numAnswers;

        var questionLayout = {
            boolean: {
                lwPos: {x: 485, y: 250},
                lwSize: {width: 450, height: 300},
                //qPos: {x: 620, y: 280},
                qSize: {width: 175, height: 100},
                aSize: {width: 175, height: 100},
                answers: [
                   /* {
                        position: {x: 520, y: 410},
                        value: [1],
                        label: 'true'
                    },
                    {
                        position: {x: 720, y: 410},
                        value: [0],
                        label: 'false'
                    }*/
                ]
            },
            'multiple choice': {
                lwPos: {x: 450, y: 250},
                lwSize: {width: 820, height: 300},
                //qPos: {x: 770, y: 280},
                qSize: {width: 175, height: 100},
                aSize: {width: 175, height: 100},
                answers: []
            }
        };



        // Need to set defaults....
        var formModel = new Backbone.Model(
            {
                questionValue: '',
                questionTypeTemplate: '', // Need to get this by loading JSON from PHP into handlebars questionTypesTemplate
                questionTypeID: '1',
                choicesAccepted: 1
            }
        );


        paper.on('cell:pointerdown', function(cellView, evt, x, y) {

            console.log('cell view clicked ', cellView.model, 'linked neighbours', graph.getNeighbors(cellView.model), 'parent', cellView.model.get('parent'));

            if (cellView.model.attributes.ktype == 'question')
            {

                selectedQuestion = cellView;



                var attrs           = selectedQuestion.model.get('attrs');
                var questionTypeID  = selectedQuestion.model.get('question_type_id');

                // adjust style of clicked element
                attrs.rect['stroke-dasharray'] = '5,5';
                selectedQuestion.model.set('attrs', attrs);
                selectedQuestion.render().el;


                formModel.set(
                    {
                        questionValue: attrs.text.text,
                        questionTypeID: questionTypeID
                    });

                //console.log(attrs, 'set the model val to ', attrs.text.text, 'set the question type to ', questionTypeID); // , formModel.get('questionValue'));

                formModel.trigger('change');

            }


            if (cellView.model.attributes.ktype == 'answer')
            {
                selectedAnswer = cellView;

                // adjust style of clicked element
                var attrs           = selectedAnswer.model.get('attrs');
                attrs.rect['stroke-dasharray'] = '2,3';
                selectedAnswer.model.set('attrs', attrs);
                selectedAnswer.render().el;

            }


            if (cellView.model.attributes.ktype == 'content')
            {
                selectedAnswer = cellView;

                // adjust style of clicked element
                var attrs           = selectedAnswer.model.get('attrs');
                attrs.rect['stroke-dasharray'] = '5,1';
                selectedAnswer.model.set('attrs', attrs);
                selectedAnswer.render().el;

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
                initialize: function () {


                    this.template = _.template($('.formQuestionOptions').html());

                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#questionTypeTemplate').html(this.model.get('questionTypeTemplate'));

                    this.$el.find('#questionControlsMultiple').slideUp(0);

                    //this.render();

                    this.model.on('change', function(){

                        //console.log('the formView model changed');

                        this.render()

                    }, this);


                },
                events: {
                    'click #btnQuestionAdd': 'addQuestion',
                    'click #btnAddAnswer': 'addAnswer',
                    'click #btnAddLogicOutPoint': 'addLogicOutPoint',
                    'click #btnAddContent': 'addContent',
                    'click #btnLogGraph': 'saveGraph',
                    'keyup #questionValue': 'questionUpdate',
                    'change #questionType': 'changeQuestionType'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#questionValue').val(this.model.get('questionValue'));



                    if (this.model.get('questionTypeID') != '') {
                        console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#questionType').val(this.model.get('questionTypeID'));
                    }


                    return this;
                },
                addQuestion: function (e) {

                    newQuestionType = this.$('#questionType option:selected').text().toLowerCase();

                    //console.log('newQuestionType ', newQuestionType);

                    var logicWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: questionLayout[newQuestionType].lwPos,
                        size:  questionLayout[newQuestionType].lwSize,
                        attrs: {
                            '.label': { text: 'Question logic', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                            rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgba(0,0,0,0.25)'},
                            '.inPorts circle': { fill: '#cccccc' },
                            '.outPorts circle': { fill: '#cccccc' }
                        }
                    });

                    logicWrapper.set('inPorts', ['l-i-1']);
                    logicWrapper.set('outPorts', ['l-o-1']);

                    newQuestionX = stageCenterX - ((questionLayout[newQuestionType].qSize.width + answerMargin)/2);
                    newQuestionY = stageCenterY - questionLayout[newQuestionType].qSize.height - (questionMarginBottom / 2);

                    var questionObject = {
                        ktype: 'question',
                        position: {x: newQuestionX, y: newQuestionY},
                        size: questionLayout[newQuestionType].qSize,
                        attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: 'New question', fill: 'black' }}
                    };


                    // Bind to db model

                    questionObject.question_type_id = parseInt(this.$('#questionType option:selected').val());


                    // Depending on the type of question and the number of answers being added, we can set up the answer_datatype_id.
                    answer_value_datatypes = [];



                    // Set up answers and positions.

                    var newY =  newQuestionY + questionMarginBottom;
                    var answerWidth = questionLayout[newQuestionType].aSize.width;


                    switch(newQuestionType)
                    {
                        case 'boolean':

                            answer_value_datatypes[0] = valueDataTypes[newQuestionType]; // boolean
                            answer_value_datatypes[1] = valueDataTypes[newQuestionType]; // boolean

                            questionObject.choices_accepted = 1; // by default boolean can only have 1 accepted answer
                            numAnswers = 2;


                            // calculate the answer positions.

                            var totalWidthOfAnswers = numAnswers * (answerWidth + answerMargin);
                            var startX = stageCenterX - (totalWidthOfAnswers/2);

                            var answerValueProvider =  [1, 0];
                            var answerLabelProvider =  ['true', 'false'];

                            for (var mca = 0; mca < numAnswers; mca++)
                            {
                                var newX = startX + (mca * (answerWidth + answerMargin));
                                questionLayout[newQuestionType].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };
                            }


                        break;

                        case 'multiple choice':

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());

                            // calculate the answer positions.

                            numAnswers = parseInt(this.$('#questionNumAnswers').val());

                            var totalWidthOfAnswers = numAnswers * (answerWidth + answerMargin);
                            var startX = stageCenterX - (totalWidthOfAnswers/2);

                            for (var mca = 0; mca < numAnswers; mca++)
                            {
                                var newX = startX + (mca * (answerWidth + answerMargin));
                                questionLayout[newQuestionType].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: '', // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: 'Answer ' + (mca+1)
                                };
                            }

                            //console.log('added your answers into the data', questionLayout[newQuestionType]);


                        break;

                    }


                    // But I will need access to the answer datatypes object.

                    //

                    var question = new joint.shapes.html.Element( questionObject );

                    graph.addCells([
                        logicWrapper,
                        question
                    ]);

                    /*

                    Trying to override new question with it's ID in the name... scope issue

                    console.log('new question', question.id);

                    var attrs = question.get('attrs');
                    var qtext = attrs.text.text;

                    var wraptext = joint.util.breakText(qtext + ' ' + question.id, {
                        width: questionLayout[newQuestionType].qSize.width,
                        height: questionLayout[newQuestionType].qSize.height
                    });

                    attrs.text.text = wraptext;

                    question.set({'attrs': attrs});
                    question.model.render().el;*/

                    logicWrapper.embed(question);

                    // Loop over answers

                    for (var a=0; a < questionLayout[newQuestionType].answers.length; a++) {

                        var wraptext = joint.util.breakText(questionLayout[newQuestionType].answers[a].label, {
                            width: questionLayout[newQuestionType].aSize.width - 10,
                            height: questionLayout[newQuestionType].aSize.height - 10
                        });

                        var answer = new joint.shapes.html.Element({
                            ktype: 'answer',
                            position: questionLayout[newQuestionType].answers[a].position,
                            size: questionLayout[newQuestionType].aSize,
                            attrs: {
                                rect: {fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)'},
                                text: {text: wraptext, fill: 'black'}
                            },
                            answer_value_datatype_id: answer_value_datatypes[a],
                            answer_value: questionLayout[newQuestionType].answers[a].value[0],
                            answer_value2: questionLayout[newQuestionType].answers[a].value[1]
                        });

                        graph.addCells(
                            [answer]
                        );

                        var link = new joint.dia.Link({
                            smooth: true,
                            source: { id: question.id },
                            target: { id: answer.id }
                        });

                        var lolink = new joint.shapes.devs.Link({
                            source: {
                                id: logicWrapper.id,
                                port: 'l-o-1'
                            },
                            target: {
                                id: answer.id
                            }
                        });

                        graph.addCells(
                            [link, lolink]
                        );

                        logicWrapper.embed(answer);

                    }

                    this.model.trigger('change');


                },
                questionUpdate: function(e)
                {
                    //console.log('question value is changing', e, this.$(e.target).val());

                    if (selectedQuestion)
                    {

                        // adjust text of clicked element
                        var attrs           = selectedQuestion.model.get('attrs');

                        var wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: questionLayout[newQuestionType].qSize.width,
                            height: questionLayout[newQuestionType].qSize.height
                        });

                        attrs.text.text = wraptext;
                        selectedQuestion.model.set('attrs', attrs);
                        selectedQuestion.render().el;


                    }
                },
                changeQuestionType: function()
                {

                    newQuestionType = this.$('#questionType option:selected').text().toLowerCase();

                    console.log(' q type ', newQuestionType);

                    switch(newQuestionType)
                    {
                        case 'boolean':

                            this.$('#questionControlsMultiple').slideUp('fast');

                        break;

                        case 'multiple choice':

                            this.$('#questionControlsMultiple').slideDown('slow');

                        break;

                    }

                },
                addAnswer: function()
                {


                    // Let's add an answer to the selected question!

                    // let's add another answer by cloning the first answr in this questions child neighbours.

                    var neighbours      = graph.getNeighbors(selectedQuestion.model);
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
                        source: { id: selectedQuestion.model.id },
                        target: { id: newAnswer.id }
                    });

                    graph.addCell(linkNew);

                    // embed this answer under the question (which is embedded into the logic wrapper)

                    graph.getCell(selectedQuestion.model.get('parent')).embed(newAnswer);

                    graph.trigger('change:position', newAnswer, pos, {skipParentHandler:false});


                },
                addLogicOutPoint: function() {

                    // Let's add an out port to the parent of the selected answer.

                    if (selectedAnswer) {

                        var parentLogicWrapper = graph.getCell(selectedAnswer.model.get('parent'));

                        var newOutports = parentLogicWrapper.attributes.outPorts;
                        var ar = [];
                        for (lo in newOutports) {
                            ar[lo] = newOutports[lo];
                        }

                        ar.push("l-0-" + (newOutports.length + 1));
                        parentLogicWrapper.set('outPorts', ar);

                    }

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
                        },
                        interactive: false
                    });

                    contentWrapper.set('inPorts', ['c-i-1']);
                    contentWrapper.set('outPorts', ['c-o-1']);

                    var wraptext = joint.util.breakText('lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing.', {
                        width: 320,
                        height: 130
                    });

                    var content = new joint.shapes.html.Element({
                        ktype: 'content',
                        position: { x: 505, y: 505 },
                        size: { width: 340, height: 140 },
                        attrs: { rect: { fill: 'white', 'stroke-width': 1, stroke: 'rgb(0,0,0,0.5)', style:{'pointer-events':'none'} }, text: { text: wraptext, fill: 'black' }},
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


        formModel.on('change', function(){
            //console.log('formModel change event');
        });

        //wherever you need to do the ajax
        Backbone.ajax({
            dataType: "json",
            url: "data/questionTypes.php",
            data: "",
            success: function (questionTypeData) {


                Backbone.ajax({
                    dataType: "json",
                    url: "data/valueDataTypes.php",
                    data: "",
                    success: function (valueDataTypeData) {

                        valueDataTypes = valueDataTypeData;

                        $('body').prepend('<div class="alert"><em>Data ready</em></div>');

                        // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                        var renderedQuestionTypeSelect = HRT.templates['questionTypes.hbs'](questionTypeData);
                        formModel.set({'questionTypeTemplate': renderedQuestionTypeSelect});

                        // Don't initalise the form view til we got data.
                        var fv = new formView(
                            {
                                model: formModel,
                                el: '.formQuestionOptions'
                            }
                        );

                        //$('body').prepend(fv.render().el);


                    }

                });

            }

        });


    };

    return {
        init: init
    };


});