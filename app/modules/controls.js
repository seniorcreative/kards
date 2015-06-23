// Controls

define(
    ['joint',
    'handlebars.runtime',
    'compiled-templates',
    //'modules/sonoa-auto-complete'
    ],

function(joint, HRT) {


    var init = function(graph, paper) {

        //console.log('inited ', graph);

        var selectedReport,selectedSection,selectedQuestion,selectedAnswer,selectedContent;
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
        var loopedElements;

        var style =
        {
            node:
            {
                strokeDashArray:
                {
                    selected: '2,3',
                    deselected: ''
                },
                fill:
                {
                    normal: 'rgb(255,255,255)',
                    wrapper: 'rgb(255,255,255)'
                },
                fillOpacity:
                {
                    normal: 1,
                    wrapper: 0.5
                },
                strokeWidth:
                {
                    normal: 2,
                    wrapper: 2
                },
                stroke:
                {
                    normal: 'rgb(0,0,0)',
                    wrapper: 'rgb(0,0,0)'
                },
                strokeOpacity:
                {
                    normal: 1,
                    wrapper: 0.5
                }
            },
            port:
            {
                in:
                {
                    fill:
                    {
                        normal: '#cccccc',
                        hidden: 'rgba(0,0,0,0)'
                    },
                    stroke:
                    {
                        normal: '#cccccc',
                        hidden: 'rgba(0,0,0,0)'
                    }
                },
                out:
                {
                    fill:
                    {
                        normal: '#cccccc',
                        hidden: 'rgba(0,0,0,0)'
                    },
                    stroke:
                    {
                        normal: '#cccccc',
                        hidden: 'rgba(0,0,0,0)'
                    }
                }
            },
            text:
            {
                fill:
                {
                    normal: 'rgb(0,0,0)'
                },
                fontSize:
                {
                    label: '8px'
                }
            }
        };

        var layout = {
            question: {
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
            },
            content:
            {
                wrapperSize: {width: 350, height: 150},
                bodySize: {width: 250, height: 75}
            },
            report: {
                size: {width: 200, height: 75}
            },
            section: {
                size: {width: 120, height: 75}
            }
        };

        // Setter functions

        var setTotalWidthAnswers = function ( numAnswers, answerWidth )
        {
            totalWidthOfAnswers = (numAnswers * answerWidth) + ((numAnswers-1) * answerMargin);
            startX = stageCenterX - (totalWidthOfAnswers/2);
        };

        var resetElementStyles = function (elementKType)
        {
            var element;

            var paperRect = {x:0,y:0,width:window.innerWidth,height:window.innerHeight};
            loopedElements = paper.findViewsInArea(paperRect);

            for (element in loopedElements) {
                if (loopedElements[element].model.get('ktype') == elementKType || elementKType == 'all') {
                    attrs = loopedElements[element].model.get('attrs');
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.deselected;
                    loopedElements[element].model.set('attrs', attrs);
                    loopedElements[element].render().el;
                }
            }
        };

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

        // Detect if we're clicking on a blank area of the chart.
        paper.on('blank:pointerdown', function(evt, x, y)
        {

            resetElementStyles('all');

            selectedQuestion = null;
            selectedSection = null;
            selectedAnswer = null;
            selectedContent = null;

            // Clear the appropriate  model values
            sectionModel.set(
                {
                    sectionTitle: ''
                }
            );
            sectionModel.trigger('change');

            questionModel.set(
                {
                    questionValue: ''
                }
            );
            questionModel.trigger('change');

            answerModel.set(
                {
                    answerLabel: ''
                }
            );
            answerModel.trigger('change');

            contentModel.set(
                {
                    contentText: ''
                }
            );
            contentModel.trigger('change');

        });



        // Need to set defaults....

        var reportModel = new Backbone.Model(
            {
                reportTitle: 'New report *',
                reportCategoryID: ''
            }
        );

        var sectionModel = new Backbone.Model(
            {
                sectionTitle: 'New section *'
            }
        );

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
                contentText: '',
                contentTypeTemplate: '',
                contentCategoriesTemplate: '',
                contentTypeID: '',
                contentCategoryID: ''
            }
        );


        paper.on('cell:pointerdown', function(cellView, evt, x, y) {

            console.log('cell view clicked ', cellView.model, 'linked neighbours', graph.getNeighbors(cellView.model), 'parent', cellView.model.get('parent'), 'element', cellView.el);

            switch(cellView.model.attributes.ktype) {

                case 'report':

                    selectedReport = cellView;

                    var reportCategoryID = selectedReport.model.get('report_category_id');

                    // adjust style of clicked element
                    attrs = selectedReport.model.get('attrs');
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                    selectedReport.model.set('attrs', attrs);
                    selectedReport.render().el;

                    reportModel.set(
                        {
                            reportTitle: attrs.text.text,
                            reportCategoryID: selectedReport.model.get('report_category_id')
                        });

                    reportModel.trigger('change');

                    break;

                case 'section':

                    selectedSection = cellView;

                    resetElementStyles('section');

                    // adjust style of clicked element
                    attrs = selectedSection.model.get('attrs');
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                    selectedSection.model.set('attrs', attrs);
                    selectedSection.render().el;

                    sectionModel.set(
                        {
                            sectionTitle: attrs.text.text
                        });

                    sectionModel.trigger('change');

                break;

                case 'question':

                    selectedQuestion = cellView;

                    resetElementStyles('question');

                    // adjust style of clicked element
                    attrs = selectedQuestion.model.get('attrs');
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                    selectedQuestion.model.set('attrs', attrs);
                    selectedQuestion.render().el;

                    questionModel.set(
                        {
                            questionValue: attrs.text.text,
                            questionTypeID: selectedQuestion.model.get('question_type_id'),
                            questionDatapointID: selectedQuestion.model.get('ehr_datapoint_id'),
                            questionVariableTypeID: selectedQuestion.model.get('question_variable_type_id')
                        });

                    questionModel.trigger('change');

                break;

                case 'answer':

                    selectedAnswer = cellView;

                    // Also set the parent question (both need to be set if we're editing answer controls)
                    selectedQuestion = paper.findViewByModel(selectedAnswer.model.get('answer_parent_question'));

                    var answerValueDataTypeID = selectedAnswer.model.get('answer_value_datatype_id');

                    resetElementStyles('answer');
                    resetElementStyles('question');

                    // adjust style of clicked element

                    // highlight node method?

                    attrs = selectedAnswer.model.get('attrs');
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
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

                    // When we select an answer I want to also select simultaneously the parent question.

                    attrs = selectedQuestion.model.get('attrs');
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                    selectedQuestion.model.set('attrs', attrs);
                    selectedQuestion.render().el;

                    questionModel.set(
                        {
                            questionValue: attrs.text.text,
                            questionTypeID: selectedQuestion.model.get('question_type_id'),
                            questionDatapointID: selectedQuestion.model.get('ehr_datapoint_id'),
                            questionVariableTypeID: selectedQuestion.model.get('question_variable_type_id')
                        });

                    //console.log('set the answer model val to ', selectedAnswer.model.get('ehr_datapoint_id')); // , questionModel.get('questionValue'));
                    answerModel.trigger('change');
                    questionModel.trigger('change');

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

        var highlightContentForEditing = function( _element )
        {

            //console.log('selected content set to ', _element);

            selectedContent = _element;

            var paperRect = {x:0,y:0,width:window.innerWidth,height:window.innerHeight};
            loopedElements = paper.findViewsInArea(paperRect);

            // reset all looped elements (slightly different to resetElementStyles)
            for (var element in loopedElements) {
                if (loopedElements[element].model.get('ktype') == 'content') {
                    attrs = loopedElements[element].model.get('attrs');
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.deselected;
                    attrs.rect['stroke'] = 'rgba(0,0,0,0)';
                    loopedElements[element].model.set('attrs', attrs);
                    loopedElements[element].render().el;
                }
            }

            // adjust style of clicked element
            attrs = selectedContent.model.get('attrs');
            attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
            attrs.rect['stroke'] = 'rgba(0,0,0,0.5)';
            selectedContent.model.set('attrs', attrs);
            selectedContent.render().el;

            contentModel.set(
                {
                    contentText: attrs.text.text,
                    contentTypeID: selectedContent.model.get('cms_content_type_id'),
                    contentCategoryID: selectedContent.model.get('cms_content_category_id')
                }
            );

            contentModel.trigger('change');
        };


        var reportControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    this.template = _.template($('.formReportOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.model.on('change', function(){
                        this.render()
                    }, this);

                },
                events: {
                    'click #btnAddReport': 'addReport',
                    'keyup #reportTitle': 'reportUpdate',
                    'change #reportCategory': 'reportCategoryUpdate'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#reportTitle').val(this.model.get('reportTitle'));

                    if (this.model.get('reportCategoryID') != '') {
                        //console.log('supposed to be setting your answer value data type id value to ', this.model.get('answerValueDataTypeID'));
                        this.$el.find('#reportCategory').val(this.model.get('reportCategoryID'));
                    }

                    return this;
                },
                addReport: function()
                {

                    var newReportTitle = $('#reportTitle').val() == '' ? 'New report *' : $('#reportTitle').val();
                    $('#reportTitle').val(newReportTitle);

                    wraptext = joint.util.breakText(newReportTitle, {
                        width: layout.report.size.width,
                        height: layout.report.size.height
                    });

                    var report = new joint.shapes.devs.Model({
                        ktype: 'report',
                        position: { x: stageCenterX - (layout.report.size.width / 2), y: 100 },
                        size: { width: layout.report.size.width, height: layout.report.size.height },
                        attrs: {
                            '.label': { text: 'R', 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                            rect: {
                                fill: style.node.fill.normal,
                                'fill-opacity': style.node.fillOpacity.normal,
                                'stroke-width': style.node.strokeWidth.normal,
                                stroke: style.node.stroke.normal,
                                'stroke-opacity': style.node.strokeOpacity.normal,
                                'stroke-dasharray':style.node.strokeDashArray.selected,
                                style:{'pointer-events':''}
                            },
                            text: {
                                text: wraptext, fill: style.text.fill.normal
                            },
                            '.inPorts circle': {
                                fill: style.port.in.fill.hidden,
                                stroke: style.port.in.stroke.hidden,
                                style:{'pointer-events':'none'} },
                            '.outPorts circle': {
                                fill: style.port.out.fill.normal
                            }
                        },
                        report_category_id: this.$('#reportCategory option:selected').val(),
                        interactive: true
                    });

                    report.set('inPorts', ['']);
                    report.set('outPorts', ['out']);

                    graph.addCells([report]);

                    // Disable the add button.
                    this.$('#btnAddReport').attr('disabled', 'disabled');
                    this.$('#btnAddReport').slideUp('slow');

                    selectedReport = paper.findViewByModel(report);

                },
                reportUpdate: function(e)
                {
                    if (selectedReport)
                    {
                        attrs = selectedReport.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.report.size.width,
                            height: layout.report.size.height
                        });

                        attrs.text.text = wraptext;
                        selectedReport.model.set('attrs', attrs);
                        selectedReport.render().el;
                    }
                },
                reportCategoryUpdate: function()
                {
                    if (selectedReport) {
                        selectedReport.model.set(
                            {
                                report_category_id: this.$('#reportCategory option:selected').val()
                            }
                        );
                    }
                }
            }
        );

        var sectionControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    this.template = _.template($('.formSectionOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.model.on('change', function(){
                        this.render()
                    }, this);

                },
                events: {
                    'click #btnAddSection': 'addSection',
                    'keyup #sectionTitle': 'sectionUpdate'
                    //'change #reportCategory': 'reportCategoryUpdate'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#sectionTitle').val(this.model.get('sectionTitle'));

                    return this;
                },
                addSection: function()
                {
                    var newSectionTitle = $('#sectionTitle').val() == '' ? 'New section *' : $('#sectionTitle').val();
                    $('#sectionTitle').val(newSectionTitle);

                    resetElementStyles('section');

                    wraptext = joint.util.breakText(newSectionTitle, {
                        width: layout.section.size.width,
                        height: layout.section.size.height
                    });

                    var section = new joint.shapes.devs.Model({
                        ktype: 'section',
                        position: { x: stageCenterX - (layout.section.size.width / 2), y: stageCenterY - (layout.section.size.height / 2) },
                        size: { width: layout.section.size.width, height: layout.section.size.height },
                        attrs: {
                            '.label': { text: 'S', 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                            rect: {
                                fill: style.node.fill.normal,
                                'fill-opacity': style.node.fillOpacity.normal,
                                'stroke-width': style.node.strokeWidth.normal,
                                stroke: style.node.stroke.normal,
                                'stroke-dasharray':style.node.strokeDashArray.selected,
                                style:{'pointer-events':''}
                            },
                            text: {
                                text: wraptext, fill: style.text.fill.normal
                            },
                            '.inPorts circle': { fill: style.port.in.fill.normal },
                            '.outPorts circle': { fill: style.port.out.fill.normal }
                        },
                        //report_category_id: this.$('#reportCategory option:selected').val(),
                        interactive: true
                    });

                    section.set('inPorts', ['in']);
                    section.set('outPorts', ['out']);

                    graph.addCells([section]);

                    selectedSection = paper.findViewByModel(section); // Make so is the selected straight away.
                },
                sectionUpdate: function(e)
                {
                    if (selectedSection)
                    {
                        attrs = selectedSection.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.section.size.width,
                            height: layout.section.size.height
                        });

                        attrs.text.text = wraptext;
                        selectedSection.model.set('attrs', attrs);
                        selectedSection.render().el;
                    }
                }
            }
        );

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
                            width: layout.question[newQuestionType].qSize.width,
                            height: layout.question[newQuestionType].qSize.height
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

                    this.$el.find('#cmsContentTypeTemplate').html(this.model.get('contentTypeTemplate'));
                    this.$el.find('#cmsContentCategoryTemplate').html(this.model.get('contentCategoryTemplate'));

                    this.model.on('change', function(){
                        this.render()
                    }, this);

                    //autocompleteSearch();

                },
                events: {
                    'click #btnAddContent': 'addContent',
                    'keyup #contentText': 'contentUpdate',
                    'change #cmsContentTypeID': 'changeContentTypeDropdown',
                    'change #cmsContentCategoryID': 'changeContentCategoryDropdown'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#contentText').val(this.model.get('contentText'));

                    if (this.model.get('contentTypeID') != '') {
                        this.$el.find('#cmsContentTypeID').val(this.model.get('contentTypeID'));
                    }

                    if (this.model.get('contentCategoryID') != '') {
                        this.$el.find('#cmsContentCategoryID').val(this.model.get('contentCategoryID'));
                    }

                    return this;
                },
                addContent: function()
                {


                    var contentWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: { x: stageCenterX - (layout.content.wrapperSize.width / 2), y: stageCenterY - (layout.content.wrapperSize.height / 2) },
                        size: { width: layout.content.wrapperSize.width, height: layout.content.wrapperSize.height },
                        attrs: {
                            '.label': { text: 'CONTENT', 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                            rect: {
                                fill: style.node.fill.wrapper,
                                'fill-opacity': style.node.fillOpacity.wrapper,
                                'stroke-width': style.node.strokeWidth.wrapper,
                                stroke: style.node.stroke.wrapper,
                                rx: 2,
                                ry: 4 },
                            '.inPorts circle': { fill: style.port.in.fill.normal },
                            '.outPorts circle': { fill: style.port.out.fill.normal }
                        }
                    });

                    contentWrapper.set('inPorts', ['in']);
                    contentWrapper.set('outPorts', ['out']);

                    var newContentText = $('#contentText').val() == '' ? 'lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing.' : $('#contentText').val();
                    $('#contentText').val(newContentText);

                    wraptext = joint.util.breakText(newContentText, {
                        width: layout.content.bodySize.width,
                        height: layout.content.bodySize.height
                    });

                    var content = new joint.shapes.html.Element({
                        ktype: 'content',
                        position: { x: stageCenterX - (layout.content.bodySize.width / 2), y: stageCenterY - (layout.content.bodySize.height / 2) },
                        size: { width: layout.content.bodySize.width, height: layout.content.bodySize.height },
                        attrs: {
                            rect: {
                                fill: style.node.fill.normal,
                                'fill-opacity': style.node.fillOpacity.normal,
                                'stroke-width': style.node.strokeWidth.normal,
                                stroke: style.node.stroke.normal,
                                'stroke-dasharray':style.node.strokeDashArray.selected,
                                style:{'pointer-events':''}
                            },
                            text: {
                                text: wraptext, fill: style.text.fill.normal
                            }
                        },
                        interactive: false,
                        cms_content_type_id: parseInt(this.$('#cmsContentTypeID option:selected').val()),
                        cms_content_category_id: parseInt(this.$('#cmsContentCategoryID option:selected').val())
                    });

                    graph.addCells([contentWrapper, content]);

                    contentWrapper.embed(content);

                    selectedContent = content;

                },
                contentUpdate: function(e)
                {
                    if (selectedContent)
                    {
                            attrs = selectedContent.model.get('attrs');

                            wraptext = joint.util.breakText(this.$(e.target).val(), {
                                width: layout.content.bodySize.width,
                                height: layout.content.bodySize.height
                            });

                            attrs.text.text = wraptext;
                            selectedContent.model.set('attrs', attrs);
                            selectedContent.render().el;
                    }
                },
                changeContentTypeDropdown: function()
                {

                    contentModel.set(
                        {
                            contentTypeID: parseInt(this.$('#cmsContentTypeID option:selected').val())
                        }
                    );

                    if (selectedContent)
                    {
                        selectedContent.model.set(
                            {
                                'cms_content_type_id': parseInt(this.$('#cmsContentTypeID option:selected').val())
                            }
                        )
                    }

                },
                changeContentCategoryDropdown: function()
                {

                    contentModel.set(
                        {
                            contentCategoryID: parseInt(this.$('#cmsContentCategoryID option:selected').val())
                        }
                    );

                    if (selectedContent)
                    {
                        selectedContent.model.set(
                            {
                                'cms_content_category_id': parseInt(this.$('#cmsContentCategoryID option:selected').val())
                            }
                        )
                    }

                }
            }
        );


        //wherever you need to do the ajax
        Backbone.ajax({
            dataType: "json",
            url: "data/dataProviders.php",
            data: "",
            success: function (data) {

                //console.log(data);

                // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                questionModel.set({'questionTypeTemplate': HRT.templates['questionTypes.hbs'](data)});
                questionModel.set({'questionVariableTypeTemplate': HRT.templates['questionVariableTypes.hbs'](data)});
                answerModel.set({'valueDataTypeTemplate': HRT.templates['valueDataTypes.hbs'](data)});
                contentModel.set({'contentTypeTemplate': HRT.templates['cmsContentTypes.hbs'](data)});
                contentModel.set({'contentCategoryTemplate': HRT.templates['cmsContentCategories.hbs'](data)});

                // Parse data for use elsewhere (which is not pumped into handlebars templates)
                valueDataTypes = data.valueDataTypes;

                // Don't initialise the question and answer controls views til we got data.

                var reportControls = new reportControlsView(
                    {
                        model: reportModel,
                        el: '.formReportOptions'
                    }
                );

                var sectionControls = new sectionControlsView(
                    {
                        model: sectionModel,
                        el: '.formSectionOptions'
                    }
                );

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
                setTimeout(function () {
                    $('.alert').remove()
                }, 2500);
            }

        });


    };

    return {
        init: init
    };


});