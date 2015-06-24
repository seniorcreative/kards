define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout'],

    function($, Backbone, joint, style, layout) {

        var scope;
        var graph;
        var paper;

        var questionControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    scope = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

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

                    newQuestionType = $('#questionType option:selected').text().toLowerCase();

                    var newQuestionText = $('#questionValue').val() == '' ? newQuestionType + ' question *' : $('#questionValue').val();
                    $('#questionValue').val(newQuestionText);

                    newQuestionX = stageCenterX - ((layout.question[newQuestionType].qSize.width)/2);
                    newQuestionY = stageCenterY - layout.question[newQuestionType].qSize.height - (logicCenterHeight / 2);

                    //console.log('newQuestionY ', newQuestionY);
                    resetElementStyles('question');

                    wraptext = joint.util.breakText(newQuestionText, {
                        width: layout.question[newQuestionType].qSize.width,
                        height: layout.question[newQuestionType].qSize.height
                    });

                    var questionObject = {
                        ktype: 'question',
                        position: {x: newQuestionX, y: newQuestionY},
                        size: layout.question[newQuestionType].qSize,
                        attrs: {
                            '.label': {
                                text: 'Q',
                                'ref-x': .1,
                                'ref-y': .1,
                                'font-size': style.text.fontSize.label
                            },
                            rect: {
                                fill: style.node.fill.normal,
                                'fill-opacity': style.node.fillOpacity.normal,
                                'stroke-width': style.node.strokeWidth.normal,
                                stroke: style.node.stroke.normal,
                                'stroke-dasharray':style.node.strokeDashArray.selected,
                                style:{'pointer-events':''}
                            },
                            text: {
                                text: wraptext,
                                fill: style.text.fill.normal
                            }
                        }
                    };


                    // Add to db model

                    questionObject.question_type_id             = parseInt(this.$('#questionType option:selected').val());
                    questionObject.question_variable_type_id    = parseInt(this.$('#questionVariableType option:selected').val());
                    questionObject.ehr_datapoint_id             = parseInt(this.$('#questionDataPoint option:selected').val());

                    // Set up answers and positions.

                    var newX;
                    var mca;
                    var newY =  stageCenterY + (logicCenterHeight / 2);
                    var answerWidth = layout.question[newQuestionType].aSize.width;


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
                                layout.question[newQuestionType].answers[mca] = {
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
                                layout.question[newQuestionType].answers[mca] = {
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
                                layout.question[newQuestionType].answers[mca] = {
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
                    var logicWrapperHeight = layout.question[newQuestionType].qSize.height  + layout.question[newQuestionType].aSize.height + logicCenterHeight +  (logicWrapperPadding * 2);

                    //console.log(stageCenterY, logicWrapperHeight, (stageCenterY - (logicWrapperHeight / 2)));

                    var logicWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: {x: stageCenterX - (logicWrapperWidth/2), y: stageCenterY - (logicWrapperHeight / 2)},
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

                    logicWrapper.set('inPorts', ['in']);
                    logicWrapper.set('outPorts', ['out 1']);

                    graph.addCells([
                        logicWrapper,
                        question
                    ]);

                    logicWrapper.embed(question);

                    logicWrapper.toBack();
                    logicWrapper.toBack({deep: true});

                    // Loop over answers

                    for (var a=0; a < layout.question[newQuestionType].answers.length; a++) {

                        wraptext = joint.util.breakText(layout.question[newQuestionType].answers[a].label, {
                            width: layout.question[newQuestionType].aSize.width - 10,
                            height: layout.question[newQuestionType].aSize.height - 10
                        });

                        var answer = new joint.shapes.html.Element({
                            ktype: 'answer',
                            position: layout.question[newQuestionType].answers[a].position,
                            size: layout.question[newQuestionType].aSize,
                            attrs: {
                                '.label': { text: 'A', 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
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
                                port: 'out 1' // This is potentially one of many, so suffix with count of 1
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

                    selectedQuestion = paper.findViewByModel(question); // Make so is the selected straight away.

                    //this.model.trigger('change'); // If we do, why are we calling this? - write a note

                },
                questionUpdate: function(e)
                {
                    //console.log('question value is changing', e, this.$(e.target).val());

                    if (selectedQuestion)
                    {

                        // adjust text of clicked element
                        attrs           = selectedQuestion.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.question[newQuestionType].qSize.width,
                            height: layout.question[newQuestionType].qSize.height
                        });

                        attrs.text.text = wraptext;
                        selectedQuestion.model.set('attrs', attrs);
                        selectedQuestion.render().el;

                    }
                },
                changeQuestionTypeDropdown: function()
                {
                    newQuestionType = this.$('#questionType option:selected').text().toLowerCase();

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



                    //console.log('selected question', selectedQuestion);
                    // Let's add an answer to the selected question!
                    // let's add another answer by cloning the first answr in this questions child neighbours.
                    if (!selectedQuestion) return;

                    resetElementStyles('answer');

                    var neighbours      = graph.getNeighbors(selectedQuestion.model);

                    var newAnswerText = $('#answerLabel').val() == '' ? 'Answer ' + (neighbours.length+1) + ' *' : $('#answerLabel').val();
                    $('#answerLabel').val(newAnswerText);

                    var n1              = neighbours[neighbours.length-1];
                    var newAnswer       = n1.clone();
                    var pos             = newAnswer.get('position');

                    attrs               = newAnswer.get('attrs');

                    wraptext = joint.util.breakText(newAnswerText, {
                        width: layout.question[newQuestionType].aSize.width,
                        height: layout.question[newQuestionType].aSize.height
                    });

                    attrs.text.text     = wraptext; // set using wrap utility,
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                    pos.x               += layout.question[newQuestionType].aSize.width + answerMargin;

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

                    // console.log(selectedQuestion.model.get('parent'));

                    graph.trigger('change:position', newAnswer, pos);

                    selectedAnswer = paper.findViewByModel(newAnswer); // make so is selected straight away.
                },
                saveGraph: function () {
                    console.log(JSON.stringify(graph.toJSON()));
                }
            }
        );

        return questionControlsView;

});