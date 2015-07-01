define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout',
        'modules/helpers'],

    function($, Backbone, joint, style, layout, helpers) {

        var scope;
        var graph;
        var paper;

        var wraptext;
        var numAnswers;
        var valueDataTypes;
        var answerDataTypesProvider = [];
        var answerValueProvider = [];
        var answerLabelProvider = [];

        var questionControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');
                    
                    helpers.init(that, paper, graph);

                    this.template = _.template($('.formQuestionOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    this.$el.find('#questionTypeTemplate').html(this.model.get('questionTypeTemplate'));
                    this.$el.find('#questionVariableTypeTemplate').html(this.model.get('questionVariableTypeTemplate'));
                    this.$el.find('#questionControlsMultiple').slideUp(0);

                    //console.log('question view inited', this.model, that.questionModel);

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


                    //console.log('questionTypeID ', this.model.get('questionTypeID'));
                    //console.log('questionVariableTypeID ', this.model.get('questionVariableTypeID'));

                    this.$el.find('#questionValue').val(this.model.get('questionValue'));

                    if (this.model.get('questionTypeID') != undefined) {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#questionType').val(this.model.get('questionTypeID'));
                    }

                    if (this.model.get('questionVariableTypeID') != undefined) {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#questionVariableType').val(this.model.get('questionVariableTypeID'));
                    }

                    if (this.model.get('questionDatapointID') != undefined) {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#questionDataPoint').val(this.model.get('questionDatapointID'));
                    }

                    return this;
                },
                addQuestion: function (e) {

                    //console.log('setting question type to ', $('#questionType option:selected').text().toLowerCase());

                    layout.set('newQuestionType', $('#questionType option:selected').text().toLowerCase());

                    var newQuestionText = $('#questionValue').val() == '' ? layout.get('newQuestionType') + ' question *' : $('#questionValue').val();
                    $('#questionValue').val(newQuestionText);

                    newQuestionX = parseInt(layout.stage.centerX - ((layout.question[layout.get('newQuestionType')].qSize.width)/2));
                    newQuestionY = parseInt(layout.stage.centerY - layout.question[layout.get('newQuestionType')].qSize.height - (layout.logicCenterHeight / 2));

                    //console.log('newQuestionY ', newQuestionY);
                    helpers.resetElementStyles('question');

                    wraptext = joint.util.breakText(newQuestionText, {
                        width: layout.question[layout.get('newQuestionType')].qSize.width,
                        height: layout.question[layout.get('newQuestionType')].qSize.height
                    });


                    var questionNumber = this.model.questions.length + 1;

                    var questionObject = {
                        ktype: 'question',
                        position: {x: newQuestionX, y: newQuestionY},
                        size: layout.question[layout.get('newQuestionType')].qSize,
                        attrs: {
                            '.label': {
                                text: 'Q' + questionNumber,
                                'ref-x': .1,
                                'ref-y': .1,
                                'font-size': style.text.fontSize.label
                            },
                            rect: {
                                fill: style.node.fill.normal,
                                'fill-opacity': style.node.fillOpacity.normal,
                                'stroke-width': style.node.strokeWidth.normal,
                                stroke: style.node.stroke.normal,
                                'stroke-dasharray': style.node.strokeDashArray.selected,
                                style: {'pointer-events': ''}
                            },
                            text: {
                                text: wraptext,
                                fill: style.text.fill.normal
                            }
                        },
                        questionFull: newQuestionText,
                        questionNumber: questionNumber,
                        question_type_id: parseInt(this.$('#questionType option:selected').val()),
                        question_variable_type_id: parseInt(this.$('#questionVariableType option:selected').val()),
                        ehr_datapoint_id: parseInt(this.$('#questionDataPoint option:selected').val()),
                        logic: {rules: []} // { ruleCompiled: '', calculationBlocksCompiled: []}
                    };


                    // Set up answers and positions.

                    var newX;
                    var mca;
                    var newY =  parseInt(layout.stage.centerY + (layout.logicCenterHeight / 2));
                    var answerWidth = layout.question[layout.get('newQuestionType')].aSize.width;


                    switch(layout.get('newQuestionType'))
                    {
                        case 'boolean':


                            questionObject.choices_accepted = 1; // by default boolean can only have 1 accepted answer
                            numAnswers = 2;
                            // Depending on the type of question and the number of answers being added, we can set up the answer_datatype_id.
                            answerDataTypesProvider = [this.model.get('valueDataTypes')['boolean'], this.model.get('valueDataTypes')['boolean']]; // boolean (can also use layout.get('newQuestionType') switch case here)
                            answerValueProvider     = [[1], [0]]; // Note that the answer value can expect an array of 2 values
                            answerLabelProvider     = ['true', 'false'];

                            if ($('#questionUnknownAnswerAllowed').is(":checked"))
                            {
                                // Add a third answer
                                numAnswers++;
                                answerDataTypesProvider.push(this.model.get('valueDataTypes')['unknown']);
                                answerValueProvider.push([1]);
                                answerLabelProvider.push('unknown');
                            }

                            // calculate the answer positions.
                            helpers.setTotalWidthAnswers(numAnswers, answerWidth);

                            for (mca = 0; mca < numAnswers; mca++)
                            {
                                newX = parseInt(layout.get('startX') + (mca * (answerWidth + layout.answerMargin))); // WARNING - dynamic layout vars that were set with setter need to be got with getter
                                layout.question[layout.get('newQuestionType')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };


                            }

                            //console.log('answer position calculation layout', layout.get('newQuestionType'), layout.question[layout.get('newQuestionType')], layout.question[layout.get('newQuestionType')].answers);


                            break;

                        case 'multiple choice':

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());
                            numAnswers = parseInt(this.$('#questionNumAnswers').val());

                            // Initial loop
                            for (mca = 0; mca < numAnswers; mca++) {

                                answerDataTypesProvider[mca] = this.model.get('valueDataTypes')['boolean']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca] = [1]; // Might as well be boolean
                                answerLabelProvider[mca] = 'Answer ' + (mca + 1) + ' *';

                            }

                            // Append an unknown answer
                            if ($('#questionUnknownAnswerAllowed').is(":checked"))
                            {
                                // Add a third answer
                                numAnswers++;
                                answerDataTypesProvider.push(this.model.get('valueDataTypes')['unknown']);
                                answerValueProvider.push([1]);
                                answerLabelProvider.push('unknown');
                            }

                            helpers.setTotalWidthAnswers(numAnswers, answerWidth);

                            // Then loop again
                            for (mca = 0; mca < numAnswers; mca++) {
                                newX = parseInt(layout.get('startX') + (mca * (answerWidth + layout.answerMargin)));
                                layout.question[layout.get('newQuestionType')].answers[mca] = {
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

                                answerDataTypesProvider[mca] = this.model.get('valueDataTypes')['integer']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca] = [step];
                                answerLabelProvider[mca] = step + ' *';

                                step += numericStep; // increment the step by itself (prob need a start value from the form)
                            }

                            // Append an unknown answer
                            if ($('#questionUnknownAnswerAllowed').is(":checked"))
                            {
                                // Add a third answer
                                numAnswers++;
                                answerDataTypesProvider.push(this.model.get('valueDataTypes')['unknown']);
                                answerValueProvider.push([1]);
                                answerLabelProvider.push('unknown');
                            }

                            helpers.setTotalWidthAnswers(numAnswers, answerWidth);

                            // Then loop again
                            for (mca = 0; mca < numAnswers; mca++) {
                                newX = parseInt(layout.get('startX') + (mca * (answerWidth + layout.answerMargin)));
                                layout.question[layout.get('newQuestionType')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };
                            }

                            break;

                    }

                    // But I will need access to the answer datatypes object.

                    var question = new joint.shapes.html.Element( questionObject );


                    var logicWrapperWidth = layout.get('totalWidthOfAnswers') + (layout.logicWrapperPadding * 1);
                    var logicWrapperHeight = layout.question[layout.get('newQuestionType')].qSize.height  + layout.question[layout.get('newQuestionType')].aSize.height + layout.logicCenterHeight +  (layout.logicWrapperPadding * 2);

                    //console.log(layout.stage.centerY, logicWrapperHeight, (layout.stage.centerY - (logicWrapperHeight / 2)));

                    var logicWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: {x: parseInt(layout.stage.centerX - (logicWrapperWidth/2)), y: parseInt(layout.stage.centerY - (logicWrapperHeight / 2))},
                        size:  {width: logicWrapperWidth, height: logicWrapperHeight},
                        attrs: {
                            '.label': { text: 'LOGIC', 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                            rect: {
                                fill: style.node.fill.wrapper,
                                'fill-opacity': style.node.fillOpacity.wrapper,
                                'stroke-width': style.node.strokeWidth.wrapper,
                                stroke: style.node.stroke.wrapper,
                                'stroke-dasharray':style.node.strokeDashArray.deselected,
                                style:{'pointer-events':''}
                            },
                            '.inPorts circle': { fill: style.port.in.fill.normal },
                            '.outPorts circle': { fill: style.port.out.fill.normal }
                        }
                    });

                    //console.log("wrapper pos ", layout.stage.centerX - (logicWrapperWidth/2), layout.stage.centerY - (logicWrapperHeight / 2));

                    logicWrapper.set('inPorts', ['in']);
                    //logicWrapper.set('outPorts', ['out 1']); // We are now adding out ports based on chosen answer(s) of the question

                    graph.addCells([
                        logicWrapper,
                        question
                    ]);

                    this.model.questions.push({
                        id: questionNumber,
                        element: question.id,
                        parent: logicWrapper.id
                    });

                    logicWrapper.embed(question);

                    logicWrapper.toBack();
                    logicWrapper.toBack({deep: true});

                    // Loop over answers

                    //var questionModelArray = this.model.get('questions');

                    var answerValues = this.model.answerValues;

                    for (var a=0; a < layout.question[layout.get('newQuestionType')].answers.length; a++) {

                        var fullAnswerText = layout.question[layout.get('newQuestionType')].answers[a].label;

                        wraptext = joint.util.breakText(fullAnswerText, {
                            width: layout.question[layout.get('newQuestionType')].aSize.width - 10,
                            height: layout.question[layout.get('newQuestionType')].aSize.height - 10
                        });

                        var answer = new joint.shapes.html.Element({
                            ktype: 'answer',
                            position: layout.question[layout.get('newQuestionType')].answers[a].position,
                            size: layout.question[layout.get('newQuestionType')].aSize,
                            attrs: {
                                '.label': { text: 'A'+(a+1), 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                                rect: {
                                    fill: style.node.fill.normal,
                                    'fill-opacity': style.node.fillOpacity.normal,
                                    'stroke-width': style.node.strokeWidth.normal,
                                    stroke: style.node.stroke.wrapper,
                                    style:{'pointer-events':''}
                                },
                                text: {
                                    text: wraptext,
                                    fill: style.text.fill.normal
                                }
                            },
                            answerFull: fullAnswerText,
                            answer_value_datatype_id: answerDataTypesProvider[a],
                            answer_value: answerValueProvider[a][0],
                            answer_value2: answerValueProvider[a][1],
                            answer_parent_question: question.id,
                            ehr_datapoint_id: '',
                            answerNumber: (a+1)
                        });

                        graph.addCells(
                            [answer]
                        );

                        if (!answerValues[questionNumber]) answerValues[questionNumber] = [];

                        answerValues[questionNumber][(a+1)] = {
                            qid: questionNumber,
                            id: (a+1),
                            label: "Q" + questionNumber + ", A" + (a+1) + " - (" + wraptext.substring(0, 8) + "...)",
                            element: answer.id
                        };

                        var link = new joint.dia.Link({
                            smooth: true,
                            source: { id: question.id },
                            target: { id: answer.id }
                        });

                        // I was originally adding by default a first out port and a link from the default answers
                        // to that outport but have now commented out as will be getting created by the logic instead

                        /*var lolink = new joint.shapes.devs.Link({
                            source: {
                                id: logicWrapper.id,
                                port: 'out 1' // This is potentially one of many, so suffix with count of 1
                            },
                            target: {
                                id: answer.id
                            }
                        });
*/
                        graph.addCells(
                            [link] // , lolink]
                        );

                        logicWrapper.embed(answer);

                    }

                    this.model.answerValues = answerValues;

                    this.model.set('questionAdded', true); // for listener in app.js

                    logicWrapper.embed(question);

                    window.selectedQuestion = paper.findViewByModel(question); // Make so is the selected straight away.

                    // We need to call a change on the model here so that views that use this model are updated - such as logicControlsView
                    this.model.trigger('change');

                    $('#btnAddAnswer').removeClass('hidden');
                    $('#btnQuestionAdd').addClass('hidden');

                    $('.formQuestionOptions h3').text('Edit Question - Q' + questionNumber);
                    $('#logic-modal h3').text('Logic - Q' + questionNumber);
                    $('#logic-modal').show();

                },
                questionUpdate: function(e)
                {

                    if (window.selectedQuestion != null)
                    {

                        // adjust text of clicked element
                        attrs           = window.selectedQuestion.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.question[layout.get('newQuestionType')].qSize.width,
                            height: layout.question[layout.get('newQuestionType')].qSize.height
                        }) + '...';

                        attrs.text.text = wraptext;
                        window.selectedQuestion.model.set('attrs', attrs);
                        window.selectedQuestion.model.set('questionFull', this.$(e.target).val());
                        window.selectedQuestion.render().el;

                    }
                },
                changeQuestionTypeDropdown: function()
                {
                    layout.set('newQuestionType', this.$('#questionType option:selected').text().toLowerCase());

                    this.model.set(
                        {
                            questionTypeID: parseInt(this.$('#questionType option:selected').val())
                        }
                    );

                    switch(layout.get('newQuestionType'))
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

                    this.model.set(
                        {
                            questionVariableTypeID: parseInt(this.$('#questionVariableType option:selected').val())
                        }
                    );

                    layout.set('newQuestionVariableType', this.$('#questionVariableType option:selected').text().toLowerCase());

                    if (window.selectedQuestion)
                    {
                        window.selectedQuestion.model.set(
                            {
                                'question_variable_type_id': parseInt(this.$('#questionVariableType option:selected').val())
                            }
                        )
                    }

                },
                changeQuestionDatapointDropdown: function()
                {
                    //console.log(' q type ', layout.get('newQuestionType'));

                    this.model.set(
                        {
                            questionDatapointID: parseInt(this.$('#questionDataPoint option:selected').val())
                        }
                    );

                    if (window.selectedQuestion)
                    {
                        window.selectedQuestion.model.set(
                            {
                                'ehr_datapoint_id': parseInt(this.$('#questionDataPoint option:selected').val())
                            }
                        )
                    }

                },
                addAnswer: function()
                {

                    //console.log('selected question', window.selectedQuestion);
                    // Let's add an answer to the selected question!
                    // let's add another answer by cloning the first answr in this questions child neighbours.
                    if (!window.selectedQuestion) return;

                    helpers.resetElementStyles('answer');

                    var neighbours      = graph.getNeighbors(window.selectedQuestion.model);

                    var newAnswerText = $('#answerLabel').val() == '' ? 'New Answer' : $('#answerLabel').val();
                    $('#answerLabel').val(newAnswerText);

                    var newAnswerNumber = (neighbours.length+1);

                    var n1              = neighbours[neighbours.length-1];
                    var newAnswer       = n1.clone();
                    var pos             = newAnswer.get('position');

                    attrs               = newAnswer.get('attrs');

                    wraptext = joint.util.breakText(newAnswerText, {
                        width: layout.question[layout.get('newQuestionType')].aSize.width,
                        height: layout.question[layout.get('newQuestionType')].aSize.height
                    });

                    attrs['.label']['text'] = 'A'+newAnswerNumber;
                    attrs.text.text     = wraptext; // set using wrap utility,
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                    pos.x               += layout.question[layout.get('newQuestionType')].aSize.width + layout.answerMargin;

                    newAnswer.set('position', pos);
                    newAnswer.set('answerFull', newAnswerText);
                    newAnswer.set('answerNumber', newAnswerNumber);

                    graph.addCell(newAnswer);

                    var answerValues = this.model.answerValues;

                    answerValues[window.selectedQuestion.model.get('questionNumber')][newAnswerNumber] = {
                        qid: window.selectedQuestion.model.get('questionNumber'),
                        id: newAnswerNumber,
                        label: "Q" + window.selectedQuestion.model.get('questionNumber') + ", A" + newAnswerNumber + " - (" + wraptext.substring(0, 8) + "...)",
                        element: newAnswer.id
                    };

                    this.model.answerValues = answerValues;
                    this.model.set('answerAdded', true);


                    // Set a new link

                    var linkNew = new joint.dia.Link({
                        smooth: true,
                        source: { id: window.selectedQuestion.model.id },
                        target: { id: newAnswer.id }
                    });

                    graph.addCell(linkNew);

                    // embed this answer under the question (which is embedded into the logic wrapper)
                    graph.getCell(window.selectedQuestion.model.get('parent')).embed(newAnswer);

                    graph.trigger('change:position', newAnswer, pos);

                    $('.formAnswerOptions h3').text('Edit Answer - A' + newAnswerNumber);

                    window.selectedAnswer =  paper.findViewByModel(newAnswer); // make so is selected straight away.

                    $('.formAnswerOptions').css('opacity', 1);
                },
                saveGraph: function () {
                    console.log(JSON.stringify(graph.toJSON()));
                }
            }
        );

        return questionControlsView;

});