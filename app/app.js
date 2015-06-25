//define(function(require, exports, module) {
//  "use strict";
//
//  // The root path to run the application through.
//  exports.root = "/";
//});

define(
    ['jquery',
        'backbone',
        'handlebars.runtime',
        'joint',
        'models/m_reportModel',
        'models/m_sectionModel',
        'models/m_questionModel',
        'models/m_answerModel',
        'models/m_contentModel',
        'views/v_reportControlsView',
        'views/v_sectionControlsView',
        'views/v_questionControlsView',
        'views/v_answerControlsView',
        'views/v_contentControlsView',
        'modules/style',
        'modules/layout',
        //'modules/controls',
        'modules/papercontrols',
        'modules/boundinglogicexpansion',
        'modules/helpers',
        'compiled-templates'
    ],

    function ($, Backbone, HRT, joint, reportModel, sectionModel, questionModel, answerModel, contentModel, reportControlsView, sectionControlsView, questionControlsView, answerControlsView, contentControlsView, style, layout, paperControls, boundingLogicExpansion, helpers, compiledTemplates) {



        var that = this;
        var paper, graph;

        var kardsModelCollection;

        //var selectedReport,selectedSection,selectedQuestion,selectedAnswer,selectedContent;
        //var newQuestionType;
        //var newQuestionVariableType;
        // Layout

        //var answerMargin;
        //var newQuestionX, newQuestionY, numAnswers;
        //var logicWrapperPadding;
        //var logicCenterHeight;
        //var totalWidthOfAnswers, startX;

        //var attrs;
        //var wraptext;
        var loopedElements;

        var reportControls, sectionControls, questionControls, answerControls, contentControls;


        var run = function () {
            bootBackboneRouter();
        };



        var bootBackboneRouter = function () {
            var AppRouter = Backbone.Router.extend({

                initialize: function () {


                    //this.games = new Game.Collection();

                    //console.log(' reportModel', reportModel);



                    // Set up some local vars.
                    answerDataTypesProvider = [];
                    answerValueProvider = [];
                    answerLabelProvider = [];


                    graph = new joint.dia.Graph();

                    paper = new joint.dia.Paper({
                        el: $('#canvas'),
                        width: 2400,
                        height: 2400,
                        model: graph,
                        gridSize: 15,
                        defaultLink: new joint.dia.Link({
                            smooth: true,
                            attrs: {
                                '.connection' : { 'stroke-width': 5, 'stroke-linecap': 'round', opacity:.5 }
                            }
                        })
                    });

                    kardsModelCollection = Backbone.Collection.extend();

                    // Set up a reference within this object scope of each model.
                    that.reportModel = new reportModel({ that: this, collection: kardsModelCollection, graph: graph, paper: paper });
                    that.sectionModel = new sectionModel({ that: this, collection: kardsModelCollection, graph: graph, paper: paper });
                    that.questionModel = new questionModel({ that: this, collection: kardsModelCollection, graph: graph, paper: paper });
                    that.answerModel = new answerModel({ that: this, collection: kardsModelCollection, graph: graph, paper: paper });
                    that.contentModel = new contentModel({ that: this, collection: kardsModelCollection, graph: graph, paper: paper });

                    // smaller paper
                    /*    var paperSmall = new joint.dia.Paper({
                     el: $('#navigator'),
                     width: 500,
                     height: 500,
                     model: graph,
                     gridSize: 1
                     });
                     paperSmall.scale(0.25);
                     paperSmall.$el.css('pointer-events', 'none');*/

                    //graph.fromJSON(val);

                    helpers.init(that, paper, graph);

                    // If you want paper controls.
                    paperControls.init(graph, paper);

                    // If you want bounding box expansion on logic wrappers.
                    boundingLogicExpansion.init(graph, paper);


                    $('#testCheckBox').on('change', function() {

                        if ($('#testCheckBox').is(':checked')) {

                            $('.formReportOptions').animate({'left': -400}, 250);
                            $('.formSectionOptions').animate({'left': -400}, 250);
                            $('.formQuestionOptions').animate({'left': -400}, 250);
                            $('.formAnswerOptions').animate({'right': -400}, 250);
                            $('.formContentOptions').animate({'right': -400}, 250);
                            //$('.formPanelControls').animate({'left': -400}, 250);

                        }
                        else
                        {
                            $('.formReportOptions').animate({'left': 10}, 250);
                            $('.formSectionOptions').animate({'left': 10}, 250);
                            $('.formQuestionOptions').animate({'left': 10}, 250);
                            $('.formAnswerOptions').animate({'right': 10}, 250);
                            $('.formContentOptions').animate({'right': 10}, 250);
                            //$('.formPanelControls').animate({'left': 10}, 250);

                        }

                    });


                    //wherever you need to do the ajax
                    Backbone.ajax({
                        dataType: "json",
                        url: "data/dataProviders.php",
                        data: "",
                        success: function (data) {

                            console.log("Kards-v1 ... app ready");

                            // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                            that.questionModel.set({'questionTypeTemplate': HRT.templates['questionTypes.hbs'](data)});
                            that.questionModel.set({'questionVariableTypeTemplate': HRT.templates['questionVariableTypes.hbs'](data)});
                            that.questionModel.set({'valueDataTypes': data.valueDataTypes});

                            that.answerModel.set({'valueDataTypeTemplate': HRT.templates['valueDataTypes.hbs'](data)});
                            that.contentModel.set({'contentTypeTemplate': HRT.templates['cmsContentTypes.hbs'](data)});
                            that.contentModel.set({'contentCategoryTemplate': HRT.templates['cmsContentCategories.hbs'](data)});

                            // Don't initialise the question and answer controls views til we got data.

                            reportControls = new reportControlsView(
                                {
                                    model: that.reportModel,
                                    el: '.formReportOptions',
                                }
                            );

                            sectionControls = new sectionControlsView(
                                {
                                    model: that.sectionModel,
                                    el: '.formSectionOptions'
                                }
                            );

                            questionControls = new questionControlsView(
                                {
                                    model: that.questionModel,
                                    el: '.formQuestionOptions'
                                }
                            );

                            answerControls = new answerControlsView(
                                {
                                    model: that.answerModel,
                                    el: '.formAnswerOptions'
                                }
                            );

                            contentControls = new contentControlsView(
                                {
                                    model: that.contentModel,
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


                },

                routes: {
                    "": "main"
                },

                main: function () {

                    //var that = this; // this is the 'router'

                    var highlightContentForEditing = function( _element )
                    {

                        //console.log('selected content set to ', _element);

                        var selectedContent = _element;

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

                        that.contentModel.set(
                            {
                                contentText: selectedContent.model.get('contentOriginal'),
                                contentTypeID: selectedContent.model.get('cms_content_type_id'),
                                contentCategoryID: selectedContent.model.get('cms_content_category_id'),
                                selectedContent: selectedContent
                            }
                        );

                        that.contentModel.trigger('change');
                    };


                    // Detect if we're clicking on a blank area of the chart.
                    paper.on('blank:pointerdown', function(evt, x, y)
                    {

                        helpers.resetElementStyles('all');

                        that.reportModel.set('selectedContent',null);
                        that.sectionModel.set('selectedSection',null);
                        that.questionModel.set('selectedQuestion',null);
                        that.answerModel.set('selectedQuestion',null);
                        that.answerModel.set('selectedAnswer',null);

                        // Clear the appropriate  model values
                        that.sectionModel.set(
                            {
                                sectionTitle: ''
                            }
                        );
                        that.sectionModel.trigger('change');

                        that.questionModel.set(
                            {
                                questionValue: ''
                            }
                        );
                        that.questionModel.trigger('change');

                        that.answerModel.set(
                            {
                                answerLabel: ''
                            }
                        );
                        that.answerModel.trigger('change');

                        that.contentModel.set(
                            {
                                contentText: ''
                            }
                        );
                        that.contentModel.trigger('change');

                    });

                    paper.on('cell:pointerdown', function(cellView, evt, x, y) {

                        console.log('cell view clicked ', cellView.model);
                        //console.log('linked neighbours', graph.getNeighbors(cellView.model));
                        //console.log('parent', cellView.model.get('parent'));
                        //console.log('element', cellView.el);

                        switch(cellView.model.attributes.ktype) {

                            case 'report':

                                //console.log('click on report', that, that.reportModel);

                                var reportCategoryID = cellView.model.get('report_category_id');

                                // adjust style of clicked element
                                attrs = cellView.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                cellView.model.set('attrs', attrs);
                                cellView.render().el;

                                that.reportModel.set(
                                    {
                                        reportTitle: attrs.text.text,
                                        reportCategoryID: cellView.model.get('report_category_id'),
                                        selectedReport: cellView
                                    });

                                that.reportModel.trigger('change');

                                break;

                            case 'section':

                                //selectedSection = cellView;

                                helpers.resetElementStyles('section');

                                // adjust style of clicked element
                                attrs = cellView.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                cellView.model.set('attrs', attrs);
                                cellView.render().el;

                                that.sectionModel.set(
                                    {
                                        sectionTitle: attrs.text.text,
                                        selectedSection: cellView
                                    });

                                that.sectionModel.trigger('change');

                                break;

                            case 'question':

                                //selectedQuestion = cellView;

                                helpers.resetElementStyles('question');

                                // adjust style of clicked element
                                attrs = cellView.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                cellView.model.set('attrs', attrs);
                                cellView.render().el;

                                that.questionModel.set(
                                    {
                                        questionValue: attrs.text.text,
                                        questionTypeID: cellView.model.get('question_type_id'),
                                        questionDatapointID: cellView.model.get('ehr_datapoint_id'),
                                        questionVariableTypeID: cellView.model.get('question_variable_type_id'),
                                        selectedQuestion: cellView
                                    });

                                that.questionModel.trigger('change');

                                console.log('selected question', cellView);

                                break;

                            case 'answer':

                                //selectedAnswer = cellView;

                                // Also set the parent question (both need to be set if we're editing answer controls)
                                var selectedQuestion = paper.findViewByModel(cellView.model.get('answer_parent_question'));

                                helpers.resetElementStyles('answer');
                                helpers.resetElementStyles('question');

                                // adjust style of clicked element

                                // highlight node method?

                                attrs = cellView.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                cellView.model.set('attrs', attrs);
                                cellView.render().el;

                                that.answerModel.set(
                                    {
                                        answerLabel: attrs.text.text,
                                        answerValue: cellView.model.get('answer_value'),
                                        answerValue2: cellView.model.get('answer_value2'),
                                        answerDatapointID: cellView.model.get('ehr_datapoint_id'),
                                        answerValueDataTypeID: cellView.model.get('answer_value_datatype_id'),
                                        selectedAnswer: cellView,
                                        selectedQuestion: selectedQuestion // Note we are setting the selected question i
                                    });

                                // When we select an answer I want to also select simultaneously the parent question.



                                attrs = selectedQuestion.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                selectedQuestion.model.set('attrs', attrs);
                                selectedQuestion.render().el;

                                that.questionModel.set(
                                    {
                                        questionValue: attrs.text.text,
                                        questionTypeID: selectedQuestion.model.get('question_type_id'),
                                        questionDatapointID: selectedQuestion.model.get('ehr_datapoint_id'),
                                        questionVariableTypeID: selectedQuestion.model.get('question_variable_type_id'),
                                        selectedQuestion: selectedQuestion
                                    });

                                //console.log('set the answer model val to ', selectedAnswer.model.get('ehr_datapoint_id')); // , questionModel.get('questionValue'));
                                that.answerModel.trigger('change');
                                that.questionModel.trigger('change');

                                //console.log('your selected answer', selectedAnswer);

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


                }
            });

            //boot up the app:
            var appRouter = new AppRouter();
            Backbone.history.start();
        };

        return {
            run: run
        };

});