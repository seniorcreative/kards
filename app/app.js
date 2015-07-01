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
        'models/m_logicModel',
        'views/v_reportControlsView',
        'views/v_sectionControlsView',
        'views/v_questionControlsView',
        'views/v_answerControlsView',
        'views/v_contentControlsView',
        'views/v_logicControlsView',
        'modules/style',
        'modules/layout',
        'modules/papercontrols',
        'modules/boundinglogicexpansion',
        'modules/helpers',
        'compiled-templates'
    ],

    function ($, Backbone, HRT, joint, reportModel, sectionModel, questionModel, answerModel, contentModel, logicModel, reportControlsView, sectionControlsView, questionControlsView, answerControlsView, contentControlsView, logicControlsView, style, layout, paperControls, boundingLogicExpansion, helpers, compiledTemplates) {



        var that = this;
        var paper, graph;

        var loopedElements;
        var reportControls, sectionControls, questionControls, answerControls, contentControls, logicControls;


        var run = function () {
            bootBackboneRouter();
        };

        var bootBackboneRouter = function () {
            var AppRouter = Backbone.Router.extend({

                initialize: function () {

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

                    window.kardsModelCollection = Backbone.Collection.extend();


                    // Globals - til I find another way to do this having tried various ways with models and collections but having issues with the scope from within the views.
                    window.selectedReport       = null;
                    window.selectedSection      = null;
                    window.selectedQuestion     = null;
                    window.selectedAnswer       = null;
                    window.selectedContent      = null;

                    //
                    // Set up a reference within this object scope of each model.
                    window.reportModel    = new reportModel({ that: this, collection: window.kardsModelCollection, graph: graph, paper: paper });
                    window.sectionModel   = new sectionModel({ that: this, collection: window.kardsModelCollection, graph: graph, paper: paper });
                    window.questionModel  = new questionModel({ that: this, collection: window.kardsModelCollection, graph: graph, paper: paper });
                    window.answerModel    = new answerModel({ that: this, collection: window.kardsModelCollection, graph: graph, paper: paper });
                    window.contentModel   = new contentModel({ that: this, collection: window.kardsModelCollection, graph: graph, paper: paper });
                    window.logicModel     = new logicModel({ that: this, collection: window.kardsModelCollection, graph: graph, paper: paper });

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

                            window.loadedData = data;

                            console.log("Kards-v1 ... app ready");

                            // Feed the data into the template and get back a rendered HTML block. Thanks handlebars!
                            window.questionModel.set({'questionTypeTemplate': HRT.templates['questionTypes.hbs'](window.loadedData)});
                            window.questionModel.set({'questionVariableTypeTemplate': HRT.templates['questionVariableTypes.hbs'](window.loadedData)});
                            window.questionModel.set({'valueDataTypes': window.loadedData.valueDataTypes});

                            window.answerModel.set({'valueDataTypeTemplate': HRT.templates['valueDataTypes.hbs'](window.loadedData)});
                            window.contentModel.set({'contentTypeTemplate': HRT.templates['cmsContentTypes.hbs'](window.loadedData)});
                            window.contentModel.set({'contentCategoryTemplate': HRT.templates['cmsContentCategories.hbs'](window.loadedData)});


                            reportControls = new reportControlsView(
                                {
                                    model: window.reportModel,
                                    el: '.formReportOptions'
                                }
                            );

                            sectionControls = new sectionControlsView(
                                {
                                    model: window.sectionModel,
                                    el: '.formSectionOptions'
                                }
                            );

                            questionControls = new questionControlsView(
                                {
                                    model: window.questionModel,
                                    el: '.formQuestionOptions'
                                }
                            );

                            answerControls = new answerControlsView(
                                {
                                    model: window.answerModel,
                                    el: '.formAnswerOptions'
                                }
                            );

                            contentControls = new contentControlsView(
                                {
                                    model: window.contentModel,
                                    el: '.formContentOptions'
                                }
                            );


                            // By subscribing from here to an event that occurs within the change of the answer model
                            // such as clicking on the 'add logic out point' button
                            // we have access to the scope of other models...
                            //
                            logicControls = new logicControlsView(
                            {
                                model: window.logicModel,
                                    el: '#logic-modal'
                            }
                            );


                            questionControls.listenTo(window.questionModel, "change", function(){

                                console.log('changed something in question model , answer Values', window.questionModel.answerValues);

                                if (window.selectedQuestion != null) {

                                    var logic = window.selectedQuestion.model.get('logic');

                                    var rulesCompiled = '';
                                    var calculationBlockCompiled;
                                    var questionOptionsCompiled;
                                    var answerOptionsCompiled;

                                    for(var rule in logic.rules)
                                    {
                                        questionOptionsCompiled = '';
                                        for (var qIndex in window.questionModel.questions)
                                        {
                                            questionOptionsCompiled += '<option ' +
                                            'value="'+ window.questionModel.questions[qIndex].id +'" ' +
                                            'data-element="'+ window.questionModel.questions[qIndex].element +'" ' +
                                            'data-parent="'+ window.questionModel.questions[qIndex].parent + // must have parent for logic wrapper adding link
                                            '">Q' +
                                            window.questionModel.questions[qIndex].id
                                            + '</option>' + '\n';
                                        }


                                        calculationBlockCompiled = '';
                                        for (var calcBlock in logic.rules[rule].calculationBlocksCompiled)
                                        {
                                            calculationBlockCompiled += logic.rules[rule].calculationBlocksCompiled[calcBlock].replace('[[[questionValues]]]', questionOptionsCompiled) + '\n';
                                        }

                                        answerOptionsCompiled = '';
                                        for (var aIndex in window.questionModel.answerValues)
                                        {
                                            answerOptionsCompiled += '<option value="'+ window.questionModel.answerValues[aIndex].id +'" data-element="'+ window.questionModel.answerValues[aIndex].element +'">' +
                                            window.questionModel.answerValues[aIndex].label
                                            + '</option>' + '\n';
                                        }

                                        var ruleCompiledReplacement = logic.rules[rule].ruleCompiled.replace('[[[calculationBlocks]]]', calculationBlockCompiled);
                                        ruleCompiledReplacement = ruleCompiledReplacement.replace('[[[answerValues]]]', answerOptionsCompiled);
                                        ruleCompiledReplacement = ruleCompiledReplacement.replace('[[[questionValues]]]', questionOptionsCompiled);

                                        rulesCompiled += ruleCompiledReplacement; // ran into difficulties with nested handlebarring here
                                    }

                                    //
                                    window.logicModel.set(
                                        {
                                            logicRuleTemplate: rulesCompiled
                                        }
                                    );

                                    window.questionModel.set('questionAdded', false);
                                    //window.questionModel.set('questionUpdated', false);
                                    window.questionModel.set('ruleAdded', false);
                                    window.questionModel.set('calculationBlockAdded', false);
                                    window.questionModel.set('answerAdded', false);
                                    window.questionModel.set('answerUpdated', false);

                                    logicControls.render().el;

                                }

                            });


                        }

                    });


                },

                routes: {
                    "": "main"
                },

                main: function () {

                    //var that = this; // this is the 'router'


                    $('body').prepend('<div class="alert" style="opacity: 0"><em>Data ready</em></div>');
                    $('.alert').animate({'opacity': 1}, 500);
                    setTimeout(function () {
                        $('.alert').remove()
                    }, 2500);


                    //

                    var selectChildElement = function( _element, mode )
                    {

                        //var selectedContent = _element;

                        var paperRect = {x:0,y:0,width:window.innerWidth,height:window.innerHeight};
                        loopedElements = paper.findViewsInArea(paperRect);

                        // reset all looped elements (slightly different to resetElementStyles)

                        helpers.resetElementStyles('all');

                        // adjust style of clicked element
                        attrs = _element.model.get('attrs');
                        attrs.rect['stroke-dasharray']  = style.node.strokeDashArray.selected;
                        attrs.rect['stroke']            = style.node.stroke.normal;
                        _element.model.set('attrs', attrs);
                        _element.render().el;

                        switch ( mode )
                        {

                            case 'content':

                                window.contentModel.set(
                                    {
                                        contentText: _element.model.get('contentFull'),
                                        contentTypeID: _element.model.get('cms_content_type_id'),
                                        contentCategoryID: _element.model.get('cms_content_category_id'),
                                    }
                                );

                                window.selectedContent = _element;

                            break;

                            case 'question':

                                //console.log('full text', _element.model.get('questionFull'));

                                window.questionModel.set(
                                    {
                                        //questionValue: attrs.text.text,
                                        questionValue: _element.model.get('questionFull'),
                                        questionTypeID: _element.model.get('question_type_id'),
                                        questionDatapointID: _element.model.get('ehr_datapoint_id'),
                                        questionVariableTypeID: _element.model.get('question_variable_type_id')
                                    });

                                window.selectedQuestion = _element;

                                window.questionModel.trigger('change');

                                $('.formQuestionOptions').css('opacity', 1);
                                $('#btnQuestionAdd').addClass('hidden');
                                $('#btnAddAnswer').removeClass('hidden');

                                $('.formQuestionOptions h3').text('Edit Question - Q' + window.selectedQuestion.model.get('questionNumber'));
                                $('#logic-modal h3').text('Logic - Q' + window.selectedQuestion.model.get('questionNumber'));
                                $('#logic-modal').show();

                            break;

                        }

                        //that.contentModel.trigger('change');
                    };


                    // Detect if we're clicking on a blank area of the chart.
                    paper.on('blank:pointerdown', function(evt, x, y)
                    {

                        helpers.resetElementStyles('all');

                        // Don't reset the selectedReport once we have one.
                        window.selectedContent  = null;
                        window.selectedSection  = null;
                        window.selectedQuestion = null;
                        window.selectedAnswer   = null;

                        $('#btnAddAnswer').addClass('hidden');

                        $('.formAnswerOptions').css('opacity', 0);
                        //$('.formQuestionOptions').css('opacity', 0);
                        $('#btnQuestionAdd').removeClass('hidden');
                        $('#btnAddAnswer').addClass('hidden');

                        // Clear the appropriate  model values
                        window.sectionModel.set(
                            {
                                sectionTitle: ''
                            }
                        );
                        window.sectionModel.trigger('change');

                        window.questionModel.set(
                            {
                                questionValue: ''
                            }
                        );
                        window.questionModel.trigger('change');

                        window.answerModel.set(
                            {
                                answerLabel: ''
                            }
                        );
                        window.answerModel.trigger('change');

                        window.contentModel.set(
                            {
                                contentText: ''
                            }
                        );
                        window.contentModel.trigger('change');

                        $('.formQuestionOptions h3').text('Add Question');
                        $('#logic-modal').hide();


                    });

                    paper.on('cell:pointerdown', function(cellView, evt, x, y) {

                        console.log('cellView.model ', cellView.model);
                        //console.log('linked neighbours', graph.getNeighbors(cellView.model));
                        //console.log('parent', cellView.model.get('parent'));
                        //console.log('element', cellView.el);

                        cellView.model.toFront({deep: true, links: true});

                        switch(cellView.model.attributes.ktype) {

                            case 'report':

                                //console.log('click on report', that, that.reportModel);

                                var reportCategoryID = cellView.model.get('report_category_id');

                                // adjust style of clicked element
                                attrs = cellView.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                cellView.model.set('attrs', attrs);
                                cellView.render().el;

                                window.reportModel.set(
                                    {
                                        reportTitle: attrs.text.text,
                                        reportCategoryID: cellView.model.get('report_category_id'),
                                    });

                                window.selectedReport = cellView;

                                window.reportModel.trigger('change');

                                break;

                            case 'section':

                                //selectedSection = cellView;

                                helpers.resetElementStyles('section');

                                // adjust style of clicked element
                                attrs = cellView.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                cellView.model.set('attrs', attrs);
                                cellView.render().el;

                                window.sectionModel.set(
                                    {
                                        sectionTitle: attrs.text.text
                                    });

                                window.selectedSection =  cellView;

                                window.sectionModel.trigger('change');

                                $('.formQuestionOptions').css('opacity', 1);
                                $('#btnQuestionAdd').removeClass('hidden');
                                $('#btnAddAnswer').addClass('hidden');

                                $('.formQuestionOptions h3').text('Add Question');

                                break;

                            case 'question':

                                //selectedQuestion = cellView;

                                helpers.resetElementStyles('question');

                                helpers.resetElementStyles('answer'); // clear styles of sub answers too.
                                window.selectedAnswer = null;
                                $('.formAnswerOptions').css('opacity', 0); // turn off the answer panel as deselecting answer

                                // adjust style of clicked element
                                attrs = cellView.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                cellView.model.set('attrs', attrs);
                                cellView.render().el;

                                window.questionModel.set(
                                    {
                                        questionValue: cellView.model.get('questionFull'),
                                        questionTypeID: cellView.model.get('question_type_id'),
                                        questionDatapointID: cellView.model.get('ehr_datapoint_id'),
                                        questionVariableTypeID: cellView.model.get('question_variable_type_id')
                                    });

                                window.selectedQuestion =  cellView;
                                window.questionModel.trigger('change');

                                //console.log('selected question', cellView);

                                $('.formQuestionOptions').css('opacity', 1);
                                $('#btnQuestionAdd').addClass('hidden');
                                $('#btnAddAnswer').removeClass('hidden');


                                $('.formQuestionOptions h3').text('Edit Question - Q' + window.selectedQuestion.model.get('questionNumber'));
                                $('#logic-modal h3').text('Logic - Q' + window.selectedQuestion.model.get('questionNumber'));
                                $('#logic-modal').show();

                                break;

                            case 'answer':

                                //selectedAnswer = cellView;

                                // Also set the parent question (both need to be set if we're editing answer controls)

                                window.selectedAnswer   = cellView;
                                window.selectedQuestion = paper.findViewByModel(cellView.model.get('answer_parent_question')); // Note we are setting the selected question i

                                helpers.resetElementStyles('answer');
                                helpers.resetElementStyles('question');

                                // adjust style of clicked element
                                // highlight node method?

                                attrs = cellView.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                cellView.model.set('attrs', attrs);
                                cellView.render().el;

                                window.answerModel.set(
                                    {
                                        //answerLabel: attrs.text.text,
                                        answerLabel: cellView.model.get('answerFull'),
                                        answerValue: cellView.model.get('answer_value'),
                                        answerValue2: cellView.model.get('answer_value2'),
                                        answerDatapointID: cellView.model.get('ehr_datapoint_id'),
                                        answerValueDataTypeID: cellView.model.get('answer_value_datatype_id'),
                                    });

                                // When we select an answer I want to also select simultaneously the parent question.



                                attrs = window.selectedQuestion.model.get('attrs');
                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                window.selectedQuestion.model.set('attrs', attrs);
                                window.selectedQuestion.render().el;

                                window.questionModel.set(
                                    {
                                        questionValue: attrs.text.text,
                                        questionTypeID: window.selectedQuestion.model.get('question_type_id'),
                                        questionDatapointID: window.selectedQuestion.model.get('ehr_datapoint_id'),
                                        questionVariableTypeID: window.selectedQuestion.model.get('question_variable_type_id'),
                                    });

                                //console.log('set the answer model val to ', selectedAnswer.model.get('ehr_datapoint_id')); // , questionModel.get('questionValue'));
                                window.answerModel.trigger('change');
                                window.questionModel.trigger('change');

                                $('.formAnswerOptions').css('opacity', 1);
                                $('.formQuestionOptions').css('opacity', 1);
                                $('#btnQuestionAdd').addClass('hidden');
                                $('#btnAddAnswer').removeClass('hidden');


                                $('.formQuestionOptions h3').text('Edit Question - Q' + window.selectedQuestion.model.get('questionNumber'));
                                $('#logic-modal h3').text('Logic - Q' + window.selectedQuestion.model.get('questionNumber'));
                                $('.formAnswerOptions h3').text('Edit Answer - Q'+ window.selectedQuestion.model.get('questionNumber') +', A' + window.selectedAnswer.model.get('answerNumber'));
                                $('#logic-modal').show();


                                break;

                            case 'content':

                                selectChildElement(cellView, 'content');

                                break;

                            case 'logicwrapper':

                                // Check if child is text 'content' model
                                if (cellView.model.getEmbeddedCells().length) {

                                    //if (cellView.model.getEmbeddedCells()[0].get('ktype') == "content") {

                                        selectChildElement(paper.findViewByModel(cellView.model.getEmbeddedCells()[0]), cellView.model.getEmbeddedCells()[0].get('ktype'));

                                    //}

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