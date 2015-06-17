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
        var answerMargin = 20;
        var newQuestionX, newQuestionY, numAnswers;
        var logicWrapperPadding = 40;
        var logicCenterHeight = 20;
        var totalWidthOfAnswers, startX;

        var answerDataTypesProvider = [];
        var answerValueProvider = [];
        var answerLabelProvider = [];

        var questionLayout = {
            boolean: {
                qSize: {width: 120, height: 75},
                aSize: {width: 120, height: 50},
                answers: []
            },
            'multiple choice': {
                qSize: {width: 120, height: 75},
                aSize: {width: 120, height: 50},
                answers: []
            },
            'numeric': {
                qSize: {width: 120, height: 75},
                aSize: {width: 120, height: 50},
                answers: []
            }
        };

        // Setter functions

        var setTotalWidthAnswers = function ( numAnswers, answerWidth )
        {
            totalWidthOfAnswers = (numAnswers * answerWidth) + ((numAnswers-1) * answerMargin);
            startX = stageCenterX - (totalWidthOfAnswers/2);
        };



        // Need to set defaults....
        var questionModel = new Backbone.Model(
            {
                questionValue: '',
                questionTypeTemplate: '', // Need to get this by loading JSON from PHP into handlebars
                questionTypeID: '1',
                choicesAccepted: 1
            }
        );

        var answerModel = new Backbone.Model(
            {
                answerLabel: '',
                answerValue: '',
                valueDataTypeTemplate: '',
                answerValueDataTypeID: 1
                //questionTypeID: '1',
                //choicesAccepted: 1
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

                questionModel.set(
                {
                    questionValue: attrs.text.text,
                    questionTypeID: questionTypeID
                });

                //console.log(attrs, 'set the model val to ', attrs.text.text, 'set the question type to ', questionTypeID); // , questionModel.get('questionValue'));
                questionModel.trigger('change');
            }

            if (cellView.model.attributes.ktype == 'answer')
            {
                selectedAnswer = cellView;

                // Also set the parent question (both need to be set if we're editing answer controls)
                selectedQuestion = graph.getCell(selectedAnswer.model.get('answer_parent_question'));

                var answerValueDataTypeID = selectedAnswer.model.get('answer_value_datatype_id');

                // adjust style of clicked element
                var attrs           = selectedAnswer.model.get('attrs');
                attrs.rect['stroke-dasharray'] = '2,3';
                selectedAnswer.model.set('attrs', attrs);
                selectedAnswer.render().el;

                answerModel.set(
                {
                    answerLabel: attrs.text.text,
                    answerValue: selectedAnswer.model.get('answer_value'),
                    answerValue2: selectedAnswer.model.get('answer_value2'),
                    answerValueDataTypeID: answerValueDataTypeID
                });

                console.log('set the answer model val to ', selectedAnswer.model.get('answer_value')); // , questionModel.get('questionValue'));

                answerModel.trigger('change');
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
            //
        });



        var questionControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    this.template = _.template($('.formQuestionOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    this.$el.find('#questionTypeTemplate').html(this.model.get('questionTypeTemplate'));
                    this.$el.find('#questionControlsMultiple').slideUp(0);

                    this.model.on('change', function(){

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
                    'change #questionType': 'changeQuestionTypeDropdown'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#questionValue').val(this.model.get('questionValue'));

                    if (this.model.get('questionTypeID') != '') {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#questionType').val(this.model.get('questionTypeID'));
                    }

                    return this;
                },
                addQuestion: function (e) {

                    newQuestionType = this.$('#questionType option:selected').text().toLowerCase();

                    newQuestionX = stageCenterX - ((questionLayout[newQuestionType].qSize.width)/2);
                    newQuestionY = stageCenterY - questionLayout[newQuestionType].qSize.height - (logicCenterHeight / 2);

                    //console.log('newQuestionY ', newQuestionY);

                    var wraptext = joint.util.breakText(newQuestionType + ' question *', {
                        width: questionLayout[newQuestionType].qSize.width,
                        height: questionLayout[newQuestionType].qSize.height
                    });

                    var questionObject = {
                        ktype: 'question',
                        position: {x: newQuestionX, y: newQuestionY},
                        size: questionLayout[newQuestionType].qSize,
                        attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: wraptext, fill: 'black' }}
                    };


                    // Add to db model

                    questionObject.question_type_id = parseInt(this.$('#questionType option:selected').val());


                    // Set up answers and positions.

                    var newX;
                    var mca;
                    var newY =  stageCenterY + (logicCenterHeight / 2);
                    var answerWidth = questionLayout[newQuestionType].aSize.width;


                    switch(newQuestionType)
                    {
                        case 'boolean':


                            questionObject.choices_accepted = 1; // by default boolean can only have 1 accepted answer
                            numAnswers = 2;

                            // calculate the answer positions.
                            setTotalWidthAnswers(numAnswers, answerWidth);

                            // Depending on the type of question and the number of answers being added, we can set up the answer_datatype_id.
                            answerDataTypesProvider = [valueDataTypes['boolean'], valueDataTypes['boolean']]; // boolean (can also use newQuestionType switch case here)
                            answerValueProvider     =  [[1], [0]]; // Note that the answer value can expect an array of 2 values
                            answerLabelProvider     =  ['true', 'false'];

                            for (mca = 0; mca < numAnswers; mca++)
                            {
                                 newX = startX + (mca * (answerWidth + answerMargin));
                                questionLayout[newQuestionType].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };
                            }

                        break;

                        case 'multiple choice':

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());

                            numAnswers = parseInt(this.$('#questionNumAnswers').val());
                            setTotalWidthAnswers(numAnswers, answerWidth);

                            for (mca = 0; mca < numAnswers; mca++)
                            {

                                answerDataTypesProvider[mca]  = valueDataTypes['string']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca]        = [''];
                                answerLabelProvider[mca]        = 'Answer ' + (mca+1) + ' *';

                                newX = startX + (mca * (answerWidth + answerMargin));
                                questionLayout[newQuestionType].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };
                            }

                        break;


                        case 'numeric':

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());

                            var numericStep = parseInt(this.$('#questionNumStep').val());
                            var step = numericStep
                            numAnswers = parseInt(this.$('#questionNumAnswers').val());
                            setTotalWidthAnswers(numAnswers, answerWidth);

                            for (mca = 0; mca < numAnswers; mca++)
                            {

                                answerDataTypesProvider[mca]    = valueDataTypes['integer']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca]        = [step];
                                answerLabelProvider[mca]        = step + ' *';

                                step += numericStep; // increment the step by itself (prob need a start value from the form)

                                newX = startX + (mca * (answerWidth + answerMargin));
                                questionLayout[newQuestionType].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };
                            }

                        break;

                    }

                    // But I will need access to the answer datatypes object.


                    var question = new joint.shapes.html.Element( questionObject );

                    var logicWrapperWidth = totalWidthOfAnswers + (logicWrapperPadding * 1);
                    var logicWrapperHeight = questionLayout[newQuestionType].qSize.height  + questionLayout[newQuestionType].aSize.height + logicCenterHeight +  (logicWrapperPadding * 2);

                    //console.log(stageCenterY, logicWrapperHeight, (stageCenterY - (logicWrapperHeight / 2)));

                    var logicWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: {x: stageCenterX - (logicWrapperWidth/2), y: stageCenterY - (logicWrapperHeight / 2)},
                        size:  {width: logicWrapperWidth, height: logicWrapperHeight},
                        attrs: {
                            '.label': { text: 'Question logic', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                            rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgba(0,0,0,0.25)'},
                            '.inPorts circle': { fill: '#cccccc' },
                            '.outPorts circle': { fill: '#cccccc' }
                        }
                    });

                    logicWrapper.set('inPorts', ['l-i-1']);
                    logicWrapper.set('outPorts', ['l-o-1']);

                    graph.addCells([
                        logicWrapper,
                        question
                    ]);

                    logicWrapper.embed(question);

                    graph.addCells([
                        logicWrapper,
                        question
                    ]);



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
                            answer_value_datatype_id: answerDataTypesProvider[a],
                            answer_value: answerValueProvider[a][0],
                            answer_value2: answerValueProvider[a][1],
                            answer_parent_question: question.id
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

                    logicWrapper.embed(question);

                    this.model.trigger('change'); // Why are we calling this - write a note?


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
                changeQuestionTypeDropdown: function()
                {

                    newQuestionType = this.$('#questionType option:selected').text().toLowerCase();
                    //console.log(' q type ', newQuestionType);

                    switch(newQuestionType)
                    {
                        case 'boolean':

                            this.$('#questionControlsMultiple').slideUp('fast');

                        break;

                        case 'multiple choice':
                        case 'numeric':

                            this.$('#questionControlsMultiple').slideDown('slow');

                        break;

                    }

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

        var answerControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    //console.log('answer controls view inited');

                    this.template = _.template($('.formAnswerOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    this.$el.find('#valueDataTypeTemplate').html(this.model.get('valueDataTypeTemplate'));

                    this.model.on('change', function(){

                        this.render()

                    }, this);

                },
                events: {
                    'keyup #answerLabel': 'answerUpdate',
                    'keyup #answerValue': 'answerValueUpdate',
                    'click #btnAddAnswer': 'addAnswer'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#answerLabel').val(this.model.get('answerLabel'));
                    this.$el.find('#answerValue').val(this.model.get('answerValue'));

                    if (this.model.get('answerValueDataTypeID') != '') {
                        //console.log('supposed to be setting your answer value data type id value to ', this.model.get('answerValueDataTypeID'));
                        this.$el.find('#valueDataType').val(this.model.get('answerValueDataTypeID'));
                    }

                    return this;
                },
                addAnswer: function()
                {

                    // Let's add an answer to the selected question!

                    // let's add another answer by cloning the first answr in this questions child neighbours.
                    if (!selectedQuestion) return;

                    var neighbours      = graph.getNeighbors(selectedQuestion.model);
                    var n1              = neighbours[neighbours.length-1];
                    var newAnswer       = n1.clone();
                    var pos             = newAnswer.get('position');
                    var attrs           = newAnswer.get('attrs');
                    attrs.text.text     = 'a ' + (neighbours.length+1) + ' - ?'; // set using wrap utility
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

                    graph.trigger('change:position', newAnswer, pos);


                },
                answerUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());

                    if (selectedQuestion && selectedAnswer)
                    {
                        // adjust text of clicked element
                        var attrs           = selectedAnswer.model.get('attrs');

                        var wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: questionLayout[newQuestionType].qSize.width,
                            height: questionLayout[newQuestionType].qSize.height
                        });

                        attrs.text.text = wraptext;
                        selectedAnswer.model.set('attrs', attrs);
                        selectedAnswer.render().el;

                    }
                },
                answerValueUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (selectedQuestion && selectedAnswer)
                    {
                        // adjust value of selected answer
                        selectedAnswer.model.set({'answer_value': this.$(e.target).val()});
                        selectedAnswer.render().el;

                    }
                }
            }
        );
        

        //wherever you need to do the ajax
        Backbone.ajax({
            dataType: "json",
            url: "data/questionTypes.php",
            data: "",
            success: function (data) {

                // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                var renderedTemplate = HRT.templates['questionTypes.hbs'](data);
                questionModel.set({'questionTypeTemplate': renderedTemplate});

            }
        });

        Backbone.ajax({
            dataType: "json",
            url: "data/valueDataTypesDropdown.php",
            data: "",
            success: function (data) {

                // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                var renderedTemplate = HRT.templates['valueDataTypes.hbs'](data);
                answerModel.set({'valueDataTypeTemplate': renderedTemplate});

            }
        });

        Backbone.ajax({
            dataType: "json",
            url: "data/valueDataTypes.php",
            data: "",
            success: function (valueDataTypeData) {

                $('body').prepend('<div class="alert"><em>Data ready</em></div>');

                valueDataTypes = valueDataTypeData;

                // Don't initalise the question and answer controls views til we got data.
                var questionControls = new questionControlsView(
                    {
                        model: questionModel,
                        el: '.formQuestionOptions'
                    }
                );

                var answerControls = new answerControlsView(
                    {
                        model: answerModel,
                        el: '.formAnswerOptions'
                    }
                );

                //$('body').prepend(questionControls.render().el);


            }

        });



    };

    return {
        init: init
    };


});