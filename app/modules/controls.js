// Controls

define(
    ['joint',
    'handlebars.runtime',
    'compiled-templates',
    'modules/sonoa-auto-complete'],

function(joint, HRT) {


    var init = function(graph, paper) {

        //console.log('inited ', graph);

        var selectedQuestion;
        var selectedAnswer;
        var selectedContent;
        var newQuestionType;
        var newQuestionVariableType;
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
        var attrs;
        var wraptext;
        var previousText;
        var loopedElements;

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

        var contentWrapperSize = {width: 350, height: 150};
        var contentSize = {width: 250, height: 75};

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
                questionVariableTypeTemplate: '',
                questionTypeID: '1',
                questionVariableTypeID: '3',
                questionDatapointID: '',
                choicesAccepted: 1
            }
        );

        var answerModel = new Backbone.Model(
            {
                answerLabel: '',
                answerValue: '',
                valueDataTypeTemplate: '',
                answerValueDataTypeID: 1,
                answerDatapointID: ''
            }
        );

        var contentModel = new Backbone.Model(
            {
                contentText: ''
            }
        );


        paper.on('cell:pointerdown', function(cellView, evt, x, y) {

            console.log('cell view clicked ', cellView.model, 'linked neighbours', graph.getNeighbors(cellView.model), 'parent', cellView.model.get('parent'), 'element', cellView.el);

            var paperRect = {x:0,y:0,width:window.innerWidth,height:window.innerHeight};
            loopedElements = paper.findViewsInArea(paperRect);

            switch(cellView.model.attributes.ktype) {

                case 'question':

                    selectedQuestion = cellView;

                    for (var element in loopedElements) {
                        if (loopedElements[element].model.get('ktype') == 'question') {
                            attrs = loopedElements[element].model.get('attrs');
                            attrs.rect['stroke-dasharray'] = '';
                            loopedElements[element].model.set('attrs', attrs);
                            loopedElements[element].render().el;
                        }
                    }

                    // adjust style of clicked element
                    attrs = selectedQuestion.model.get('attrs');
                    attrs.rect['stroke-dasharray'] = '2,3';
                    selectedQuestion.model.set('attrs', attrs);
                    selectedQuestion.render().el;

                    questionModel.set(
                        {
                            questionValue: attrs.text.text,
                            questionTypeID: selectedQuestion.model.get('question_type_id'),
                            questionDatapointID: selectedQuestion.model.get('ehr_datapoint_id'),
                            questionVariableTypeID: selectedQuestion.model.get('question_variable_type_id')
                        });

                    //console.log(attrs, 'set the model val to ', attrs.text.text, 'set the question type to ', questionTypeID); // , questionModel.get('questionValue'));
                    questionModel.trigger('change');

                break;

                case 'answer':

                    selectedAnswer = cellView;

                    // Also set the parent question (both need to be set if we're editing answer controls)
                    selectedQuestion = graph.getCell(selectedAnswer.model.get('answer_parent_question'));

                    var answerValueDataTypeID = selectedAnswer.model.get('answer_value_datatype_id');

                    for (var element in loopedElements) {
                        if (loopedElements[element].model.get('ktype') == 'answer') {
                            attrs = loopedElements[element].model.get('attrs');
                            attrs.rect['stroke-dasharray'] = '';
                            loopedElements[element].model.set('attrs', attrs);
                            loopedElements[element].render().el;
                        }
                    }

                    // adjust style of clicked element
                    attrs = selectedAnswer.model.get('attrs');
                    attrs.rect['stroke-dasharray'] = '2,3';
                    selectedAnswer.model.set('attrs', attrs);
                    selectedAnswer.render().el;

                    answerModel.set(
                        {
                            answerLabel: attrs.text.text,
                            answerValue: selectedAnswer.model.get('answer_value'),
                            answerValue2: selectedAnswer.model.get('answer_value2'),
                            answerDatapointID: selectedAnswer.model.get('ehr_datapoint_id'),
                            answerValueDataTypeID: answerValueDataTypeID
                        });

                    //console.log('set the answer model val to ', selectedAnswer.model.get('ehr_datapoint_id')); // , questionModel.get('questionValue'));

                    answerModel.trigger('change');

                break;

                case 'content':

                    highlightContentForEditing(cellView);

                break;

                case 'logicwrapper':

                    // Check if child is text 'content' model
                    if (cellView.model.getEmbeddedCells().length) {
                        if (cellView.model.getEmbeddedCells()[0].get('ktype') == "content") {
                            highlightContentForEditing(paper.findViewByModel(cellView.model.getEmbeddedCells()[0]));

                        }
                    }

                break;

                default:

                    // link etc?

                break;

            }


        });


        paper.on('cell:pointerup', function(cellView, evt, x, y) {
            //
        });


        var highlightContentForEditing = function( _element )
        {

            console.log('selected content set to ', _element);

            selectedContent = _element;

            // reset all looped elements

            for (var element in loopedElements) {
                if (loopedElements[element].model.get('ktype') == 'content') {
                    attrs = loopedElements[element].model.get('attrs');
                    attrs.rect['stroke-dasharray'] = '';
                    attrs.rect['stroke'] = 'rgba(0,0,0,0)';
                    loopedElements[element].model.set('attrs', attrs);
                    loopedElements[element].render().el;
                }
            }

            // adjust style of clicked element
            attrs = selectedContent.model.get('attrs');
            attrs.rect['stroke-dasharray'] = '5,1';
            attrs.rect['stroke'] = 'rgba(0,0,0,0.5)';
            selectedContent.model.set('attrs', attrs);
            selectedContent.render().el;

            contentModel.set(
                {
                    contentText: attrs.text.text
                }
            );

            contentModel.trigger('change');
        }


        var questionControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    this.template = _.template($('.formQuestionOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    this.$el.find('#questionTypeTemplate').html(this.model.get('questionTypeTemplate'));
                    this.$el.find('#questionVariableTypeTemplate').html(this.model.get('questionVariableTypeTemplate'));
                    this.$el.find('#questionControlsMultiple').slideUp(0);

                    this.model.on('change', function(){

                        this.render()

                    }, this);

                },
                events: {
                    'click #btnQuestionAdd': 'addQuestion',
                    'click #btnLogGraph': 'saveGraph',
                    'click #btnAddAnswer': 'addAnswer',
                    'keyup #questionValue': 'questionUpdate',
                    'change #questionType': 'changeQuestionTypeDropdown',
                    'change #questionVariableType': 'changeQuestionVariableTypeDropdown',
                    'change #questionDataPoint': 'changeQuestionDatapointDropdown'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#questionValue').val(this.model.get('questionValue'));

                    if (this.model.get('questionTypeID') != '') {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#questionType').val(this.model.get('questionTypeID'));
                    }

                    if (this.model.get('questionVariableTypeID') != '') {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#questionVariableType').val(this.model.get('questionVariableTypeID'));
                    }

                    if (this.model.get('questionDatapointID') != '') {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#questionDataPoint').val(this.model.get('questionDatapointID'));
                    }

                    return this;
                },
                addQuestion: function (e) {

                    newQuestionType = this.$('#questionType option:selected').text().toLowerCase();

                    newQuestionX = stageCenterX - ((questionLayout[newQuestionType].qSize.width)/2);
                    newQuestionY = stageCenterY - questionLayout[newQuestionType].qSize.height - (logicCenterHeight / 2);

                    //console.log('newQuestionY ', newQuestionY);

                    wraptext = joint.util.breakText(newQuestionType + ' question *', {
                        width: questionLayout[newQuestionType].qSize.width,
                        height: questionLayout[newQuestionType].qSize.height
                    });

                    var questionObject = {
                        ktype: 'question',
                        position: {x: newQuestionX, y: newQuestionY},
                        size: questionLayout[newQuestionType].qSize,
                        attrs: { rect: { fill: 'rgb(255,255,255)', 'fill-opacity': 1, 'stroke-width': 2, stroke: 'rgb(0,0,0)' }, text: { text: wraptext, fill: 'black' }}
                    };


                    // Add to db model

                    questionObject.question_type_id             = parseInt(this.$('#questionType option:selected').val());
                    questionObject.question_variable_type_id    = parseInt(this.$('#questionVariableType option:selected').val());
                    questionObject.ehr_datapoint_id             = parseInt(this.$('#questionDataPoint option:selected').val());

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
                            // Depending on the type of question and the number of answers being added, we can set up the answer_datatype_id.
                            answerDataTypesProvider = [valueDataTypes['boolean'], valueDataTypes['boolean']]; // boolean (can also use newQuestionType switch case here)
                            answerValueProvider     =  [[1], [0]]; // Note that the answer value can expect an array of 2 values
                            answerLabelProvider     =  ['true', 'false'];

                            if ($('#questionUnknownAnswerAllowed').is(":checked"))
                            {
                                // Add a third answer
                                numAnswers++;
                                answerDataTypesProvider.push(valueDataTypes['unknown']);
                                answerValueProvider.push([1]);
                                answerLabelProvider.push('unknown');
                            }

                            // calculate the answer positions.
                            setTotalWidthAnswers(numAnswers, answerWidth);

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

                            // Initial loop
                            for (mca = 0; mca < numAnswers; mca++) {

                                answerDataTypesProvider[mca] = valueDataTypes['boolean']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca] = [1]; // Might as well be boolean
                                answerLabelProvider[mca] = 'Answer ' + (mca + 1) + ' *';

                            }

                            // Append an unknown answer
                            if ($('#questionUnknownAnswerAllowed').is(":checked"))
                            {
                                // Add a third answer
                                numAnswers++;
                                answerDataTypesProvider.push(valueDataTypes['unknown']);
                                answerValueProvider.push([1]);
                                answerLabelProvider.push('unknown');
                            }

                            setTotalWidthAnswers(numAnswers, answerWidth);

                            // Then loop again
                            for (mca = 0; mca < numAnswers; mca++) {
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
                            var step = numericStep;
                            numAnswers = parseInt(this.$('#questionNumAnswers').val());

                            // Initial loop
                            for (mca = 0; mca < numAnswers; mca++) {

                                answerDataTypesProvider[mca] = valueDataTypes['integer']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca] = [step];
                                answerLabelProvider[mca] = step + ' *';

                                step += numericStep; // increment the step by itself (prob need a start value from the form)
                            }

                            // Append an unknown answer
                            if ($('#questionUnknownAnswerAllowed').is(":checked"))
                            {
                                // Add a third answer
                                numAnswers++;
                                answerDataTypesProvider.push(valueDataTypes['unknown']);
                                answerValueProvider.push([1]);
                                answerLabelProvider.push('unknown');
                            }

                            setTotalWidthAnswers(numAnswers, answerWidth);

                            // Then loop again
                            for (mca = 0; mca < numAnswers; mca++) {
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

                    logicWrapper.set('inPorts', ['in 1']);
                    logicWrapper.set('outPorts', ['out 1']);

                    graph.addCells([
                        logicWrapper,
                        question
                    ]);

                    logicWrapper.embed(question);

                    logicWrapper.toBack();
                    logicWrapper.toBack({deep: true});

                    // Loop over answers

                    for (var a=0; a < questionLayout[newQuestionType].answers.length; a++) {

                        wraptext = joint.util.breakText(questionLayout[newQuestionType].answers[a].label, {
                            width: questionLayout[newQuestionType].aSize.width - 10,
                            height: questionLayout[newQuestionType].aSize.height - 10
                        });

                        var answer = new joint.shapes.html.Element({
                            ktype: 'answer',
                            position: questionLayout[newQuestionType].answers[a].position,
                            size: questionLayout[newQuestionType].aSize,
                            attrs: {
                                rect: {fill: 'white', 'fill-opacity': 1, 'stroke-width': 2, stroke: 'rgb(0,0,0)'},
                                text: {text: wraptext, fill: 'black'}
                            },
                            answer_value_datatype_id: answerDataTypesProvider[a],
                            answer_value: answerValueProvider[a][0],
                            answer_value2: answerValueProvider[a][1],
                            answer_parent_question: question.id,
                            ehr_datapoint_id: ''
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
                                port: 'out 1'
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
                        attrs           = selectedQuestion.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
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

                    questionModel.set(
                        {
                            questionTypeID: parseInt(this.$('#questionType option:selected').val())
                        }
                    );

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
                changeQuestionVariableTypeDropdown: function()
                {
                    newQuestionVariableType = this.$('#questionVariableType option:selected').text().toLowerCase();
                    //console.log(' q type ', newQuestionType);

                    questionModel.set(
                        {
                            questionVariableTypeID: parseInt(this.$('#questionVariableType option:selected').val())
                        }
                    );

                    if (selectedQuestion)
                    {
                        selectedQuestion.model.set(
                            {
                                'question_variable_type_id': parseInt(this.$('#questionVariableType option:selected').val())
                            }
                        )
                    }

                },
                changeQuestionDatapointDropdown: function()
                {
                    //newQuestionVariableType = this.$('#questionDataPoint option:selected').text().toLowerCase();
                    //console.log(' q type ', newQuestionType);

                    questionModel.set(
                        {
                            questionDatapointID: parseInt(this.$('#questionDataPoint option:selected').val())
                        }
                    );

                    if (selectedQuestion)
                    {
                        selectedQuestion.model.set(
                            {
                                'ehr_datapoint_id': parseInt(this.$('#questionDataPoint option:selected').val())
                            }
                        )
                    }

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

                    attrs           = newAnswer.get('attrs');
                    attrs.text.text     = 'a ' + (neighbours.length+1) + ' - ?'; // set using wrap utility
                    pos.x               += questionLayout[newQuestionType].aSize.width + answerMargin;

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

                    //
                    console.log(selectedQuestion.model.get('parent'));

                    graph.trigger('change:position', newAnswer, pos);


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
                    'keyup #answerValue2': 'answerValue2Update',
                    'click #btnAddLogicOutPoint': 'addLogicOutPoint',
                    'change #valueDataType': 'changeValueDataTypeDropdown',
                    'change #answerDataPoint': 'changeAnswerDatapointDropdown'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#answerLabel').val(this.model.get('answerLabel'));
                    this.$el.find('#answerValue').val(this.model.get('answerValue'));
                    this.$el.find('#answerValue2').val(this.model.get('answerValue2'));

                    if (this.model.get('answerValueDataTypeID') != '') {
                        //console.log('supposed to be setting your answer value data type id value to ', this.model.get('answerValueDataTypeID'));
                        this.$el.find('#valueDataType').val(this.model.get('answerValueDataTypeID'));
                    }

                    if (this.model.get('answerDatapointID') != '') {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#answerDataPoint').val(this.model.get('answerDatapointID'));
                    }

                    return this;
                },
                answerUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());

                    if (selectedQuestion && selectedAnswer)
                    {
                        // adjust text of clicked element
                        attrs           = selectedAnswer.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
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
                        //selectedAnswer.render().el;
                    }
                },
                answerValue2Update: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (selectedQuestion && selectedAnswer)
                    {
                        // adjust value of selected answer
                        selectedAnswer.model.set({'answer_value2': this.$(e.target).val()});
                        //selectedAnswer.render().el;
                    }
                },
                changeValueDataTypeDropdown: function()
                {
                    //var newValueDataType = this.$('#valueDataType option:selected').text().toLowerCase();
                    //console.log(' q type ', newQuestionType);

                    if (selectedQuestion && selectedAnswer) {
                        selectedAnswer.model.set(
                            {
                                answer_value_datatype_id: this.$('#valueDataType option:selected').val()
                            }
                        );
                    }

                },
                changeAnswerDatapointDropdown: function()
                {
                    //newQuestionVariableType = this.$('#questionDataPoint option:selected').text().toLowerCase();
                    console.log(' datat point type ', this.$('#answerDataPoint option:selected').val());

                    answerModel.set(
                        {
                          answerDatapointID: parseInt(this.$('#answerDataPoint option:selected').val())
                        }
                    );

                    if (selectedAnswer)
                    {
                        selectedAnswer.model.set(
                            {
                                'ehr_datapoint_id': parseInt(this.$('#answerDataPoint option:selected').val())
                            }
                        )
                    }

                },
                addLogicOutPoint: function()
                {

                    // Let's add an out port to the parent of the selected answer.

                    if (selectedAnswer) {

                        var parentLogicWrapper = graph.getCell(selectedAnswer.model.get('parent'));

                        var newOutports = parentLogicWrapper.attributes.outPorts;
                        var ar = [];
                        for (lo in newOutports) {
                            ar[lo] = newOutports[lo];
                        }

                        ar.push("out " + (newOutports.length + 1));
                        parentLogicWrapper.set('outPorts', ar);

                    }

                }
            }
        );

        var contentControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    this.template = _.template($('.formContentOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.model.on('change', function(){
                        this.render()
                    }, this);

                    autocompleteSearch();

                },
                events: {
                    'click #btnAddContent': 'addContent',
                    'keyup #contentText': 'contentUpdate'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#contentText').val(this.model.get('contentText').split('\n').join(''));

                    return this;
                },
                addContent: function()
                {

                    var contentWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: { x: stageCenterX - (contentWrapperSize.width / 2), y: stageCenterY - (contentWrapperSize.height / 2) },
                        size: { width: contentWrapperSize.width, height: contentWrapperSize.height },
                        attrs: {
                            '.label': { text: 'Content', 'ref-x': .1, 'ref-y': .05, 'font-size': '8px' },
                            rect: { fill: 'rgba(255,255,255,0)', 'stroke-width': 2, stroke: 'rgb(0,0,0)', rx: 2, ry: 4 },
                            '.inPorts circle': { fill: '#cccccc' },
                            '.outPorts circle': { fill: '#cccccc' }
                        }
                    });

                    contentWrapper.set('inPorts', ['in 1']);
                    contentWrapper.set('outPorts', ['out 1']);

                    wraptext = joint.util.breakText('lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing.', {
                        width: contentSize.width,
                        height: contentSize.height
                    });

                    var content = new joint.shapes.html.Element({
                        ktype: 'content',
                        position: { x: stageCenterX - (contentSize.width / 2), y: stageCenterY - (contentSize.height / 2) },
                        size: { width: contentSize.width, height: contentSize.height },
                        attrs: { rect: { fill: 'white', 'fill-opacity': 1, 'stroke-width': 2, stroke: 'rgba(0,0,0,0)', style:{'pointer-events':'none'} }, text: { text: wraptext, fill: 'black' }},
                        interactive: false
                    });

                    graph.addCells([contentWrapper, content]);

                    contentWrapper.embed(content);

                },
                contentUpdate: function(e)
                {
                    //console.log('content value is changing', e, this.$(e.target).val());

                    if (selectedContent)
                    {
                        //if (this.$(e.target).val() == '')
                        //{
                        //    this.$(e.target).val(previousText);
                        //    alert('Operation not permitted');
                        //}
                        //else {
                            // adjust text of clicked element
                            attrs = selectedContent.model.get('attrs');

                            wraptext = joint.util.breakText(this.$(e.target).val(), {
                                width: contentSize.width,
                                height: contentSize.height
                            });

                            attrs.text.text = wraptext;
                            selectedContent.model.set('attrs', attrs);
                            selectedContent.render().el;

                            //previousText = this.$(e.target).val();
                        //}

                    }
                }
            }
        );


        var autocompleteSearch  = function()
        {

            console.log('autocompleteSearch called');

                $('#search-field').sonoaAutocomplete(
                    {
                        TYPE					: "GET",
                        AJAX_URL				: 'http://localhost/kards-v1/data/individualisedContent.php',
                        POST_STRING			    : {},

                        SUGGESTION_LIST		    : '.js_autocomplete--list',

                        INPUT_CLEAR_FILL		: false,

                        //AUTOCOMPLETE_CLASS	: 'autocomplete-dropdown-nav__options__list',

                        onLoad : function(){
                        },

                        onKeyup : function(){

                        },

                        beforeSend : function() {
                            //$('.answer--append').addClass('hidden');
                            //$('.main-content--message-read').addClass('hidden');
                            //$('.main-content--message-read__title-profile__heading').addClass('hidden');
                            //$('.main-content--message-read__message-date').addClass('hidden');

                            //overlay.showSuggestionOverlay();
                        },

                        success : function( data ){

                            $('#search-field').val(  $('#search-field').val() );
                        },

                        onClick : function( e ){
                            //showAnswer( e.id );
                            //overlay.hideSuggestionOverlay();
                            //incrementSearchCounter( e.id );
                        },

                        onEmpty : function(){
                            $('.main-content--suggestions__cantfind').show();
                            $( '.js_autocomplete--list' ).html( '<ul class="header-search__suggest__list"><li><span class="autocomplete-dropdown-nav__options__span">No questions found</span></li></ul>' ); // PLEASE LEAVE THIS!!!! Steve
                        },

                        onEmptyInput : function(){
                            if( $('#search-field').val() != undefined )
                            {
                                if($('#search-field').val().length <= 0)
                                {
                                    //overlay.hideSuggestionOverlay();
                                }
                            }
                        },

                        error : function( data ){
                        }

                    });

        };




        //wherever you need to do the ajax
        Backbone.ajax({
            dataType: "json",
            url: "data/questionTypes.php",
            data: "",
            success: function (data) {

                // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                var renderedTemplate = HRT.templates['questionTypes.hbs'](data);
                questionModel.set({'questionTypeTemplate': renderedTemplate});



                Backbone.ajax({
                    dataType: "json",
                    url: "data/questionVariableTypes.php",
                    data: "",
                    success: function (data) {

                        // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                        var renderedTemplate = HRT.templates['questionVariableTypes.hbs'](data);
                        questionModel.set({'questionVariableTypeTemplate': renderedTemplate});



                        Backbone.ajax({
                            dataType: "json",
                            url: "data/valueDataTypesDropdown.php",
                            data: "",
                            success: function (data) {

                                // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                                var renderedTemplate = HRT.templates['valueDataTypes.hbs'](data);
                                answerModel.set({'valueDataTypeTemplate': renderedTemplate});



                                Backbone.ajax({
                                    dataType: "json",
                                    url: "data/valueDataTypes.php",
                                    data: "",
                                    success: function (valueDataTypeData) {


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

                                        var contentControls = new contentControlsView(
                                            {
                                                model: contentModel,
                                                el: '.formContentOptions'
                                            }
                                        );


                                        $('body').prepend('<div class="alert" style="opacity: 0"><em>Data ready</em></div>');
                                        $('.alert').animate({'opacity': 1}, 500);
                                        setTimeout(function(){$('.alert').remove()}, 2500);

                                    }

                                });

                            }
                        });

                    }
                });

            }
        });







    };

    return {
        init: init
    };


});