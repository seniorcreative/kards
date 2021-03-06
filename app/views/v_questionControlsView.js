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
        var answerInputValueProvider = [];
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

                        //

                        //console.log('model change triggered in question ');
                        //this.$el.find('#questionType').trigger('change');

                        this.render();


                    }, this);


                },
                events: {
                    'click #btnQuestionAdd': 'addQuestion',
                    'click #btnLogGraph': 'saveGraph',
                    'click #btnShowLogic': 'showLogic',
                    'click #btnAddAnswer': 'addAnswer',
                    'click #btnDeleteQuestion': 'deleteHandler',
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
                        this.$el.find('#questionType').trigger('change'); // need to propagate this through to the select control
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

                    layout.set('newQuestionTypeID', this.$('#questionType option:selected').val());

                    var newQuestionText = ($('#questionValue').val() == '') ? 'New ' + $('#questionType option:selected').text().toLowerCase() + ' question *' : $('#questionValue').val();

                    $('#questionValue').val(newQuestionText);

                    this.model.set('questionValue', newQuestionText);

                    newQuestionX = parseInt(layout.stage.centerX - ((layout.question[layout.get('newQuestionTypeID')].qSize.width)/2));
                    newQuestionY = parseInt(layout.stage.centerY - layout.question[layout.get('newQuestionTypeID')].qSize.height - (layout.logicCenterHeight / 2) + 5);

                    helpers.resetElementStyles('question');

                    wraptext = joint.util.breakText(newQuestionText, {
                        width: layout.question[layout.get('newQuestionTypeID')].qSize.width,
                        height: layout.question[layout.get('newQuestionTypeID')].qSize.height
                    });


                    var questionNumber = this.model.questions.length + 1; // prob need to change this to an object.

                    var questionObject = {
                        ktype: 'question',
                        position: {x: newQuestionX, y: newQuestionY},
                        size: layout.question[layout.get('newQuestionTypeID')].qSize,
                        attrs: {
                            '.label': {
                                text: 'Q' + questionNumber,
                                'ref-x': .5,
                                'ref-y': .1,
                                'font-size': style.text.fontSize.question,
                                'text-anchor': 'start'
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
                                fill: style.text.fill.normal,
                                'font-size': style.text.fontSize.node
                            }
                        },
                        questionFull: newQuestionText,
                        questionNumber: questionNumber,
                        question_type_id: parseInt(this.$('#questionType option:selected').val()),
                        question_variable_type_id: parseInt(this.$('#questionVariableType option:selected').val()),
                        ehr_datapoint_id: parseInt(this.$('#questionDataPoint option:selected').val()),
                        logic: {rules: {}} // { ruleCompiled: '', calculationBlocksCompiled: []},
                        //reversedConnectionTargets: {},
                        //connectionTargets: {}
                    };


                    // Set up answers and positions.

                    var newX;
                    var mca = 0;
                    var newY =  parseInt(layout.stage.centerY + (layout.logicCenterHeight / 2));
                    var answerWidth = layout.question[layout.get('newQuestionTypeID')].aSize.width;
                       // Let's reset the list of all the answers.
                    layout.question[layout.get('newQuestionTypeID')].answers = [];

                    switch(layout.get('newQuestionTypeID'))
                    {
                        case '1':
                            // boolean / true or false...

                            questionObject.choices_accepted = 1; // by default boolean can only have 1 accepted answer
                            numAnswers = 2;
                            // Depending on the type of question and the number of answers being added, we can set up the answer_datatype_id.
                            answerDataTypesProvider = [this.model.get('valueDataTypes')['true or false'], this.model.get('valueDataTypes')['true or false']]; // boolean (can also use layout.get('newQuestionTypeID') switch case here)
                            answerValueProvider     = [[true], [false]]; // Note that the answer value can expect an array of 2 values
                            answerLabelProvider     = [this.model.defaultValues.boolean[0], this.model.defaultValues.boolean[1]];

                            answerInputValueProvider = [[true], [false]]; // We will prepopulate the answerInputValues for boolean questions

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
                                layout.question[layout.get('newQuestionTypeID')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };

                                // pre-determine stored answer values.
                                // NB going to store in a two dimensional array, reserving the second item for inputs that are a range

                                window.answerModel.answerInputValues[questionNumber + "_" + (mca+1)] = [answerInputValueProvider[mca][0]];

                            }

                            break;

                        case '2':
                            //multiple choice

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());
                            numAnswers = parseInt(this.$('#questionNumAnswers').val());

                            // Initial loop
                            for (mca = 0; mca < numAnswers; mca++) {

                                answerDataTypesProvider[mca] = this.model.get('valueDataTypes')['true or false']; // string is the default for new multiple choice questions. (we can adjust the question after)
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
                                layout.question[layout.get('newQuestionTypeID')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };

                                // Don't predetermine stored answer value.
                            }


                            break;

                        case '3':
                            // numeric

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());

                            var numericStep = parseInt(this.$('#questionNumStep').val());
                            var step = numericStep;
                            numAnswers = parseInt(this.$('#questionNumAnswers').val());

                            //console.log('num answers ', numAnswers);

                            answerInputValueProvider = []; // [true], [false]]; // We will prepopulate the answerInputValues for boolean questions

                            // Initial loop
                            for (mca = 0; mca < numAnswers; mca++) {

                                answerDataTypesProvider[mca] = this.model.get('valueDataTypes')['number']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca] = [step];
                                answerInputValueProvider[mca] = [step];
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
                                layout.question[layout.get('newQuestionTypeID')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };

                                // pre-determine stored answer values.

                                window.answerModel.answerInputValues[questionNumber + "_" + (mca+1)] = [answerInputValueProvider[mca][0]];
                            }

                            break;

                        case '4':
                            // gender - (boolean)

                            questionObject.choices_accepted = 1; // by default boolean can only have 1 accepted answer
                            numAnswers = 2;
                            // Depending on the type of question and the number of answers being added, we can set up the answer_datatype_id.
                            answerDataTypesProvider = [this.model.get('valueDataTypes')['word or letter'], this.model.get('valueDataTypes')['word or letter']]; // boolean (can also use layout.get('newQuestionTypeID') switch case here)
                            answerValueProvider     = [['M'], ['F']]; // Note that the answer value can expect an array of 2 values
                            answerLabelProvider     = [this.model.defaultValues.gender[0], this.model.defaultValues.gender[1]];

                            answerInputValueProvider = [[true], [false]]; // We will prepopulate the answerInputValues for boolean questions


                            // calculate the answer positions.
                            helpers.setTotalWidthAnswers(numAnswers, answerWidth);


                            for (mca = 0; mca < numAnswers; mca++)
                            {
                                newX = parseInt(layout.get('startX') + (mca * (answerWidth + layout.answerMargin))); // WARNING - dynamic layout vars that were set with setter need to be got with getter
                                layout.question[layout.get('newQuestionTypeID')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };

                                // pre-determine stored answer values.
                                // NB going to store in a two dimensional array, reserving the second item for inputs that are a range

                                window.answerModel.answerInputValues[questionNumber + "_" + (mca+1)] = [answerInputValueProvider[mca][0], answerInputValueProvider[mca][1]];

                            }

                            break;

                        case '5':

                            // Age

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());
                            numAnswers = 1;

                            // Initial loop
                            for (mca = 0; mca < numAnswers; mca++) {

                                answerDataTypesProvider[mca] = this.model.get('valueDataTypes')['date']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca] = ['dd/mm/yyyy']; // Might as well be boolean
                                answerLabelProvider[mca] = 'dd/mm/yyyy';

                            }

                            answerInputValueProvider = [['','']]; // We will prepopulate the answerInputValues for boolean questions


                            helpers.setTotalWidthAnswers(numAnswers, answerWidth);

                            // Then loop again
                            for (mca = 0; mca < numAnswers; mca++) {
                                newX = parseInt(layout.get('startX') + (mca * (answerWidth + layout.answerMargin)));
                                layout.question[layout.get('newQuestionTypeID')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };

                                // Don't predetermine stored answer value.

                                // pre-determine stored answer values.
                                // NB going to store in a two dimensional array, reserving the second item for inputs that are a range

                                window.answerModel.answerInputValues[questionNumber + "_" + (mca+1)] = answerInputValueProvider[mca];
                            }


                            break;

                        case '6':

                            // Height (prepopulate a single choice question)

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());
                            numAnswers = 1;

                            // Initial loop
                            for (mca = 0; mca < numAnswers; mca++) {

                                answerDataTypesProvider[mca] = this.model.get('valueDataTypes')['number']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca] = ['']; // Might as well be boolean
                                answerLabelProvider[mca] = 'Height (m)';

                            }

                            answerInputValueProvider = [['','']]; // We will prepopulate the answerInputValues for boolean questions



                            helpers.setTotalWidthAnswers(numAnswers, answerWidth);

                            // Then loop again
                            for (mca = 0; mca < numAnswers; mca++) {
                                newX = parseInt(layout.get('startX') + (mca * (answerWidth + layout.answerMargin)));
                                layout.question[layout.get('newQuestionTypeID')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };

                                // Don't predetermine stored answer value.

                                // pre-determine stored answer values.
                                // NB going to store in a two dimensional array, reserving the second item for inputs that are a range

                                window.answerModel.answerInputValues[questionNumber + "_" + (mca+1)] = answerInputValueProvider[mca];
                            }


                            break;

                        case '7':

                            // Weight (prepopulate a single choice question)

                            questionObject.choices_accepted = parseInt(this.$('#questionChoicesAccepted').val());
                            numAnswers = 1;

                            // Initial loop
                            for (mca = 0; mca < numAnswers; mca++) {

                                answerDataTypesProvider[mca] = this.model.get('valueDataTypes')['number']; // string is the default for new multiple choice questions. (we can adjust the question after)
                                answerValueProvider[mca] = ['']; // Might as well be boolean
                                answerLabelProvider[mca] = 'Weight (kg)';

                            }

                            answerInputValueProvider = [['','']]; // We will prepopulate the answerInputValues for boolean questions


                            helpers.setTotalWidthAnswers(numAnswers, answerWidth);

                            // Then loop again
                            for (mca = 0; mca < numAnswers; mca++) {
                                newX = parseInt(layout.get('startX') + (mca * (answerWidth + layout.answerMargin)));
                                layout.question[layout.get('newQuestionTypeID')].answers[mca] = {
                                    position: {x: newX, y: newY},
                                    value: answerValueProvider[mca], // Blank string for now. Style the answer to indicate it needs an answer value to be set.
                                    label: answerLabelProvider[mca]
                                };

                                // Don't predetermine stored answer value.

                                // pre-determine stored answer values.
                                // NB going to store in a two dimensional array, reserving the second item for inputs that are a range

                                window.answerModel.answerInputValues[questionNumber + "_" + (mca+1)] = answerInputValueProvider[mca];
                            }


                            break;

                    }

                    // But I will need access to the answer datatypes object.

                    var question = new joint.shapes.html.Element( questionObject );

                    // for logic wrapper width we want the max value of the width of one question or all the answers
                    // because one answer could be thinner than one question

                    var logicWrapperWidth = Math.max(layout.get('totalWidthOfAnswers'), layout.question[layout.get('newQuestionTypeID')].qSize.width) + (layout.logicWrapperPadding * 1);

                    var logicWrapperHeight = layout.question[layout.get('newQuestionTypeID')].qSize.height  + layout.question[layout.get('newQuestionTypeID')].aSize.height + layout.logicCenterHeight +  (layout.logicWrapperPadding * 2);

                    //console.log(layout.stage.centerY, logicWrapperHeight, (layout.stage.centerY - (logicWrapperHeight / 2)));

                    var logicWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: {x: parseInt(layout.stage.centerX - (logicWrapperWidth/2)), y: parseInt(layout.stage.centerY - (logicWrapperHeight / 2))},
                        size:  {width: logicWrapperWidth, height: logicWrapperHeight},
                        attrs: {
                            '.label': { text: 'LOGIC', 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                            rect: {
                                fill: style.wrapper.fill.normal,
                                'fill-opacity': style.wrapper.fillOpacity.normal,
                                'stroke-width': style.wrapper.strokeWidth.normal,
                                stroke: style.wrapper.stroke.normal,
                                'stroke-dasharray':style.wrapper.strokeDashArray.deselected,
                                style:{'pointer-events':''}
                            },
                            '.inPorts circle': { fill: style.port.in.fill.normal, type: 'input' },
                            '.outPorts circle': { fill: style.port.out.fill.normal, magnet: 'passive', type: 'output' }
                        },
                        questionNumber: questionNumber,
                        reversedConnectionTargets: {},
                        connectionTargets: {}
                    });

                    //console.log("wrapper pos ", layout.stage.centerX - (logicWrapperWidth/2), layout.stage.centerY - (logicWrapperHeight / 2));

                    logicWrapper.set('inPorts', ['in']);
                    //logicWrapper.set('outPorts', ['out 1']); // We are now adding out ports based on chosen answer(s) of the question

                    graph.addCells([
                        logicWrapper,
                        question
                    ]);

                    // Add question to questions model.

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

                    //console.log('adding answer loop', layout.question[layout.get('newQuestionTypeID')].answers.length, layout.get('newQuestionTypeID'));

                    for (var a=0; a < layout.question[layout.get('newQuestionTypeID')].answers.length; a++) {

                        var fullAnswerText = layout.question[layout.get('newQuestionTypeID')].answers[a].label;

                        wraptext = joint.util.breakText(fullAnswerText, {
                            width: layout.question[layout.get('newQuestionTypeID')].aSize.width - 40,
                            height: layout.question[layout.get('newQuestionTypeID')].aSize.height - 2
                        }) + '...';

                        var answerKey = questionNumber + "_" + (a+1);

                        var answer = new joint.shapes.html.Element({
                            ktype: 'answer',
                            position: layout.question[layout.get('newQuestionTypeID')].answers[a].position,
                            size: layout.question[layout.get('newQuestionTypeID')].aSize,
                            attrs: {
                                '.label': { text: 'A'+(a+1), 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                                rect: {
                                    fill: style.node.fill.normal,
                                    'fill-opacity': style.node.fillOpacity.normal,
                                    'stroke-width': style.node.strokeWidth.normal,
                                    stroke: style.node.stroke.normal,
                                    style:{'pointer-events':''}
                                },
                                text: {
                                    text: wraptext,
                                    fill: style.text.fill.normal,
                                    'font-size': style.text.fontSize.node
                                }
                            },
                            answerFull: fullAnswerText,
                            answer_value_datatype_id: answerDataTypesProvider[a],
                            answer_value: answerValueProvider[a][0],
                            answer_value2: answerValueProvider[a][1],
                            answer_parent_question: question.id,
                            ehr_datapoint_id: '',
                            answerNumber: (a+1),
                            answerKey: answerKey
                            //reversedConnectionTargets: {},
                            //connectionTargets: {}
                        });


                        graph.addCells(
                            [answer]
                        );

                        if (!answerValues[questionNumber]) answerValues[questionNumber] = {};

                        answerValues[questionNumber][(a+1)] = {
                            qid: questionNumber,
                            id: (a+1),
                            label: "Q" + questionNumber + ", A" + (a+1) + " - (" + wraptext.substring(0, 8) + "...)",
                            element: answer.id
                        };


                        // Make so that links from questions are not INBOUND to answer (from which downstream logic is calculated)
                        // Must be OUTBOUND - ie from answer as the source TO the question
                        var link = new joint.dia.Link({
                            smooth: true,
                            source: { id: answer.id },
                            target: { id: question.id },
                            /*router: { name: style.link.inside.router },
                            connector: { name: style.link.inside.connector },*/
                            attrs: {
                                '.connection' : {
                                    'stroke-width': style.link.inside.width,
                                    'stroke-linecap': style.link.inside.cap,
                                    'opacity': style.link.inside.opacity
                                }
                            }
                        });

                        graph.addCells(
                            [link]
                        );

                        logicWrapper.embed(answer);

                    }

                    this.model.answerValues = answerValues;

                    this.model.set('questionAdded', true); // for listener in app.js

                    logicWrapper.embed(question);

                    window.selectedQuestion = paper.findViewByModel(question); // Make so is the selected straight away.

                    $('#questionValue').focus();
                    $('#questionValue').select();

                    $('#btnAddAnswer').removeClass('hidden');
                    $('#btnShowLogic').removeClass('hidden');
                    $('#btnDeleteQuestion').removeClass('hidden');
                    $('#btnQuestionAdd').addClass('hidden');

                    $('.formQuestionOptions h3').text('Edit Question - Q' + questionNumber);
                    $('#logic-modal h3').text('Logic - Q' + questionNumber);


                    // Lay down logic / rule / calculation selections roadmap for this question in the logic model.

                    var questionLogic = window.logicModel.questionLogic;

                    //console.log('questionLogic', questionLogic);

                    questionLogic[questionNumber] = {
                        rules: {}
                    };

                    window.logicModel.set('questionLogic', questionLogic);

                    //console.log(window.logicModel.questionLogic);

                    // We need to call a change on the model here so that views that use this model are updated - such as logicControlsView
                    this.model.trigger('change');


                },
                questionUpdate: function(e)
                {

                    // Set the initial text in the model so if we change anything else in the view panel this stays in the text field
                    this.model.set('questionValue', this.$(e.target).val());

                    if (window.selectedQuestion != null)
                    {

                        // adjust text of clicked element
                        attrs           = window.selectedQuestion.model.get('attrs');

                        var questionTypeID = window.selectedQuestion.model.get('question_type_id');

                        console.log('wrapping into ', layout.question[questionTypeID].qSize.width,layout.question[questionTypeID].qSize.height);

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.question[questionTypeID].qSize.width,
                            height: layout.question[questionTypeID].qSize.height
                        }) + '...';

                        attrs.text.text = wraptext;
                        window.selectedQuestion.model.set('attrs', attrs);
                        window.selectedQuestion.model.set('questionFull', this.$(e.target).val());
                        window.selectedQuestion.render().el;

                    }
                },
                changeQuestionTypeDropdown: function()
                {
                    layout.set('newQuestionTypeID', this.$('#questionType option:selected').val());

                    this.model.set(
                        {
                            questionTypeID: parseInt(this.$('#questionType option:selected').val())
                        }
                    );

                    switch(layout.get('newQuestionTypeID'))
                    {
                        default:
                        case '1':
                            this.$('#questionControlsMultiple').slideUp('fast');
                            break;

                        case '2':
                        case '3':
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
                    //console.log(' q type ', layout.get('newQuestionTypeID'));

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
                        width: layout.question[layout.get('newQuestionTypeID')].aSize.width - 40,
                        height: layout.question[layout.get('newQuestionTypeID')].aSize.height - 2
                    }) + '...';

                    attrs['.label']['text'] = 'A'+newAnswerNumber;
                    attrs.text.text     = wraptext; // set using wrap utility,
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                    pos.x               += layout.question[layout.get('newQuestionTypeID')].aSize.width + layout.answerMargin;

                    newAnswer.set('position', pos);
                    newAnswer.set('answerFull', newAnswerText);
                    newAnswer.set('answerNumber', newAnswerNumber);
                    newAnswer.set('answerKey', window.selectedQuestion.model.get('questionNumber') + "_" + newAnswerNumber);

                    graph.addCell(newAnswer);

                    var answerValues = this.model.answerValues;

                    answerValues[window.selectedQuestion.model.get('questionNumber')][newAnswerNumber] = {
                        qid: window.selectedQuestion.model.get('questionNumber'),
                        id: newAnswerNumber,
                        label: "Q" + window.selectedQuestion.model.get('questionNumber') + ", A" + newAnswerNumber + " - (" + wraptext.substring(0, 8) + "...)",
                        element: newAnswer.id
                    };

                    // We might need to add this new answer's value to the answerInputValues.
                    // But we're not setting the value to anything here (unless it comes from the cloning process)
                    // window.answerModel.answerInputValues[window.selectedQuestion.model.get('questionNumber') + "_" + newAnswerNumber] = ?



                    this.model.answerValues = answerValues;
                    this.model.set('answerAdded', true);


                    // Set a new link
                    // Make so that links are not inbound to answer (from which downstream logic is calculated)
                    var linkNew = new joint.dia.Link({
                        smooth: true,
                        source: { id: newAnswer.id },
                        target: { id: window.selectedQuestion.model.id }
                    });

                    graph.addCell(linkNew);

                    // embed this answer under the question (which is embedded into the logic wrapper)
                    graph.getCell(window.selectedQuestion.model.get('parent')).embed(newAnswer);

                    graph.trigger('change:position', newAnswer, pos);

                    $('.formAnswerOptions h3').text('Edit Answer - Q' + window.selectedQuestion.model.get('questionNumber') + ', A' + newAnswerNumber);

                    window.selectedAnswer =  paper.findViewByModel(newAnswer); // make so is selected straight away.

                    $('.formAnswerOptions').css('opacity', 1);
                    $('.formAnswerOptions').css('pointer-events', 'auto');
                },
                showLogic: function () {

                    // I want to hide the 'add action' button if the logic for this newly selected question has no rules

                    var questionLogic = window.logicModel.questionLogic;

                    //console.log('selected question\'s logic', questionLogic, window.selectedQuestion.model.get('questionNumber'));

                    // Use Object.keys(obj).length to check length of rules object after it got changed from array.

                    if (Object.keys(questionLogic[window.selectedQuestion.model.get('questionNumber')].rules).length) {
                        //$('#logic-header-button-add-action').addClass('btnDisabled');
                        //$('#logic-header-button-add-action').attr('disabled', 'disabled');
                    }
                    else
                    {


                        // get the last rule in the logic display.

                        // check whether the questionoperand and answervalues operands selects have any selected values.

                        //$('#logic-header-button-add-action').removeClass('btnDisabled');
                        //$('#logic-header-button-add-action').removeAttr('disabled');
                    }

                    $('#logic-modal').show();


                },
                deleteHandler: function()
                {

                    if (window.selectedQuestion != null)
                    {

                        // Want to get the parent and the children of the question...

                        var parentLogicWrapper = graph.getCell(window.selectedQuestion.model.get('parent'));
                        parentLogicWrapper.remove(); // Very cool that remove also removes embeds.

                        var tmpArray = [];

                        for (var q in this.model.questions)
                        {

                            if (this.model.questions[q]['element'] != window.selectedQuestion.model.id)
                            {
                                tmpArray.push(this.model.questions[q]);
                            }
                        }

                        this.model.questions = tmpArray;


                        var tmpObj = {};

                        for (var a in this.model.answerValues)
                        {

                            if (a != window.selectedQuestion.model.get('questionNumber'))
                            {
                                tmpObj[a] = this.model.answerValues[a];
                            }
                        }

                        this.model.answerValues = tmpObj;


                        // Now let's loop the deleted links

                        //console.log('deleted links to loop', window.deletedLinks);

                        // Loop question keys in answerValues
                        for (var q in window.questionModel.answerValues)
                        {

                            // Loop answers of each question
                            for (var a in window.questionModel.answerValues[q])
                            {

                                var element = window.questionModel.answerValues[q][a].element;

                                var reversedConnectionTargets = graph.getCell(graph.getCell(element).get('parent')).get('reversedConnectionTargets');

                                //console.log('reversedConnectionTargets was ', reversedConnectionTargets);

                                // Loop outports for those answers

                                for(var outport in reversedConnectionTargets)
                                {

                                    var tmpArray = [];

                                    // Loop array of reversed connections, build a tmp array without those we're deleting and pop it back in.
                                    for(var c in reversedConnectionTargets[outport])
                                    {

                                        //console.log('looking for ', reversedConnectionTargets[outport][c], "in", window.deletedLinks);

                                        if (window.deletedLinks.indexOf(reversedConnectionTargets[outport][c]) == -1)
                                        {

                                            tmpArray.push(reversedConnectionTargets[outport][c]);

                                        }

                                    }

                                    // set the tmp array back into the connection targets for this element
                                    reversedConnectionTargets[outport] = tmpArray;

                                }


                                graph.getCell(graph.getCell(element).get('parent')).set('reversedConnectionTargets', reversedConnectionTargets);

                                //console.log('reversedConnectionTargets should now be ', reversedConnectionTargets, graph.getCell(graph.getCell(element).get('parent')).get('reversedConnectionTargets'));
                            }

                        }

                        window.deletedLinks = [];


                        // Now reset interface

                        helpers.clearSelections();

                    }

                }
            }
        );

        return questionControlsView;

});