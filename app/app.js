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
        'models/m_answerInputModel',
        'models/m_contentModel',
        'models/m_logicModel',
        'models/m_endPointModel',
        'models/m_hudModel',
        'views/v_reportControlsView',
        'views/v_sectionControlsView',
        'views/v_questionControlsView',
        'views/v_answerControlsView',
        'views/v_answerInputControlsView',
        'views/v_contentControlsView',
        'views/v_logicControlsView',
        'views/v_endPointControlsView',
        'views/v_hudControlsView',
        'modules/style',
        'modules/layout',
        'modules/papercontrols',
        'modules/boundinglogicexpansion',
        'modules/helpers',
        'modules/contentStream',
        'modules/logicMachine',
        'compiled-templates'
    ],

    function ($, Backbone, HRT, joint, reportModel, sectionModel, questionModel, answerModel, answerInputModel, contentModel, logicModel, endPointModel, hudModel, reportControlsView, sectionControlsView, questionControlsView, answerControlsView, answerInputControlsView, contentControlsView, logicControlsView, endPointControlsView, hudControlsView, style, layout, paperControls, boundingLogicExpansion, helpers, contentStream, logicMachine, compiledTemplates) {



        var that = this;
        var paper, graph;

        var loopedElements;
        var reportControls,
            sectionControls,
            questionControls,
            answerControls,
            answerInputControls,
            contentControls,
            logicControls,
            endPointControls,
            hudControls;


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
                        width: layout.paper.defaults.width.value,
                        height: layout.paper.defaults.height.value,
                        model: graph,
                        gridSize: layout.paper.defaults.gridSize.value,
                        defaultLink: new joint.dia.Link({
                            smooth: true,
                            attrs: {
                                '.connection' : { 'stroke-width': 5, 'stroke-linecap': 'round', opacity:.5 }
                            }
                        }),
                        validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                            // Prevent linking from input ports.
                            if (magnetS && magnetS.getAttribute('type') === 'output') return false;
                            // Prevent linking from output ports to input ports within one element.
                            if (cellViewS === cellViewT) return false;
                            // Prevent linking to input ports.
                            return magnetT && magnetT.getAttribute('type') === 'output';
                        },
                        validateMagnet: function(cellView, magnet) {
                            // Note that this is the default behaviour. Just showing it here for reference.
                            // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
                            return magnet.getAttribute('magnet') !== 'passive';
                        },
                        // Enable link snapping within 75px lookup radius
                        snapLinks: { radius: 75 }
                    });

                    window.kardsModelCollection = Backbone.Collection.extend();


                    // Globals - til I find another way to do this having tried various ways with models and collections but having issues with the scope from within the views.
                    window.selectedReport       = null;
                    window.selectedSection      = null;
                    window.selectedQuestion     = null;
                    window.selectedAnswer       = null;
                    window.selectedContent      = null;
                    window.selectedEndPoint      = null;

                    //
                    // Set up a reference within this object scope of each model.
                    window.reportModel    = new reportModel({ that: this, graph: graph, paper: paper });
                    window.sectionModel   = new sectionModel({ that: this, graph: graph, paper: paper });
                    window.questionModel  = new questionModel({ that: this, graph: graph, paper: paper });
                    window.answerModel    = new answerModel({ that: this, graph: graph, paper: paper });
                    window.answerInputModel = new answerInputModel({ that: this, graph: graph, paper: paper });
                    window.contentModel   = new contentModel({ that: this, graph: graph, paper: paper });
                    window.logicModel     = new logicModel({ that: this, graph: graph, paper: paper });
                    window.endPointModel  = new endPointModel({ that: this, graph: graph, paper: paper });
                    window.hudModel       = new hudModel({ that: this, graph: graph, paper: paper });

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


                    helpers.init(that, paper, graph);

                    logicMachine.init(that, paper, graph);

                    // If you want paper controls.
                    paperControls.init(graph, paper);

                    // If you want bounding box expansion on logic wrappers.
                    boundingLogicExpansion.init(graph, paper);


                    $('#testCheckBox').on('change', function() {

                        if ($('#testCheckBox').is(':checked')) {

                            // test mode
                            window.reportModel.mode = "test";

                            helpers.panelsOut();


                        }
                        else
                        {

                            // build mode
                            window.reportModel.mode = "build";

                            helpers.panelsIn();

                            helpers.clearSelections();

                        }

                    });


                    hudControls = new hudControlsView(
                        {
                            model: window.hudModel,
                            el: '.hudControlPanel'
                        }
                    );


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
                            window.endPointModel.set({'endPointTypeTemplate': HRT.templates['endPointTypes.hbs'](window.loadedData)});


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

                            answerInputControls = new answerInputControlsView(
                                {
                                    model: window.answerInputModel,
                                    el: '.formAnswerInputOptions'
                                }
                            );

                            contentControls = new contentControlsView(
                                {
                                    model: window.contentModel,
                                    el: '.formContentOptions'
                                }
                            );

                            endPointControls = new endPointControlsView(
                                {
                                    model: window.endPointModel,
                                    el: '.formEndPointOptions'
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

                                //console.log('changed something in question model , answer Values', window.questionModel.answerValues);

                                if (window.selectedQuestion != null) {

                                    var logic = window.selectedQuestion.model.get('logic');

                                    var rulesCompiled = '';
                                    var calculationBlockCompiled;
                                    var questionOptionsCompiled;
                                    var answerOptionsCompiled;

                                    for(var rule in logic.rules)
                                    {

                                        questionOptionsCompiled = '';
                                        answerOptionsCompiled   = '';

                                        for (var qIndex in window.questionModel.questions)
                                        {
                                            questionOptionsCompiled += '<option ' +
                                            'value="'+ window.questionModel.questions[qIndex].id +'" ' +
                                            'data-element="'+ window.questionModel.questions[qIndex].element +'" ' +
                                            'data-parent="'+ window.questionModel.questions[qIndex].parent + // must have parent for logic wrapper adding link
                                            '">Q' +
                                            window.questionModel.questions[qIndex].id
                                            + '</option>' + '\n';


                                            var questionAnswer;

                                            for (var aIndex in window.questionModel.answerValues[window.questionModel.questions[qIndex].id])
                                            {
                                                questionAnswer = window.questionModel.answerValues[window.questionModel.questions[qIndex].id][aIndex];

                                                //console.log('question answer loop ', aIndex, window.questionModel.questions[qIndex].id, window.questionModel.questions[qIndex], window.questionModel.answerValues )
                                                answerOptionsCompiled += '<option ' +
                                                'value="'+ questionAnswer.qid + '_' + questionAnswer.id +'" ' +
                                                'data-element="'+ questionAnswer.element +'"' +
                                                'data-question="'+ questionAnswer.qid +'"' +
                                                '>' +
                                                questionAnswer.label
                                                + '</option>' + '\n';
                                            }

                                        }


                                        calculationBlockCompiled = '';
                                        for (var calcBlock in logic.rules[rule].calculationBlocksCompiled)
                                        {
                                            calculationBlockCompiled += logic.rules[rule].calculationBlocksCompiled[calcBlock].replace('[[[questionValues]]]', questionOptionsCompiled) + '\n';
                                        }


                                        var ruleCompiledReplacement = logic.rules[rule].ruleCompiled.replace('[[[calculationBlocks]]]', calculationBlockCompiled);
                                        ruleCompiledReplacement     = ruleCompiledReplacement.replace('[[[answerValues]]]', answerOptionsCompiled);
                                        ruleCompiledReplacement     = ruleCompiledReplacement.replace('[[[questionValues]]]', questionOptionsCompiled);

                                        rulesCompiled += ruleCompiledReplacement; // ran into difficulties with nested handlebarring here
                                    }

                                    //
                                    window.logicModel.set(
                                        {
                                            logicRuleTemplate: rulesCompiled
                                        }
                                    );

                                    window.questionModel.set('questionAdded', false);
                                    window.questionModel.set('ruleAdded', false);
                                    window.questionModel.set('ruleRemoved', false);
                                    window.questionModel.set('calculationBlockAdded', false);
                                    window.questionModel.set('calculationBlockRemoved', false);
                                    window.questionModel.set('answerAdded', false);
                                    window.questionModel.set('answerUpdated', false);
                                    window.questionModel.set('actionAdded', false);

                                    logicControls.render().el;

                                    var questionLogic = window.logicModel.questionLogic;

                                    if (questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[1] == undefined) {

                                        //$('#logic-header-button-add-action').addClass('btnDisabled');
                                        //$('#logic-header-button-add-action').attr('disabled', 'disabled');
                                    }
                                    else
                                    {


                                        // get the last rule in the logic display.


                                        var lastLogicRuleID = $('#logic-rules .logic-rule').last().attr('id').split('rule-')[1];

                                        var lastCalculationBlockID;

                                        if ($('#logic-rules .calculationBlockWrapper').length > 0) {
                                            lastCalculationBlockID = $('#logic-rules .calculationBlockWrapper').last().attr('id').split('calculation-')[1];
                                        }
                                        else
                                        {
                                            lastCalculationBlockID = 1;
                                        }

                                        //console.log('lastLogicRuleID', lastLogicRuleID, 'lastCalculationBlockID', lastCalculationBlockID);
                                        // check whether the questionoperand and answervalues operands selects have any selected values.


                                        //$('#logic-header-button-add-action').removeClass('btnDisabled');
                                        //$('#logic-header-button-add-action').removeAttr('disabled');
                                    }

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

                    helpers.showAlert('Data ready', 2500);


                    //

                    var selectChildElement = function( _element, mode )
                    {

                        //var selectedContent = _element;

                        //var paperRect = {x:0,y:0,width:window.innerWidth,height:window.innerHeight};
                        var paperRect = {x:0,y:0,width:6000,height:6000};
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

                                window.questionModel.set(
                                    {
                                        questionValue: _element.model.get('questionFull'),
                                        questionTypeID: _element.model.get('question_type_id'),
                                        questionDatapointID: _element.model.get('ehr_datapoint_id'),
                                        questionVariableTypeID: _element.model.get('question_variable_type_id')
                                    });

                                window.selectedQuestion = _element;

                                window.questionModel.trigger('change');

                                $('.formQuestionOptions').css('opacity', 1);
                                $('.formQuestionOptions').css('pointer-events', 'auto');
                                $('#btnQuestionAdd').addClass('hidden');
                                $('#btnAddAnswer').removeClass('hidden');
                                $('#btnShowLogic').removeClass('hidden');
                                $('#btnDeleteQuestion').removeClass('hidden');

                                $('.formQuestionOptions h3').text('Edit Question - Q' + window.selectedQuestion.model.get('questionNumber'));
                                $('#logic-modal h3').text('Logic - Q' + window.selectedQuestion.model.get('questionNumber'));

                                $('#questionValue').focus();

                            break;

                        }

                        //that.contentModel.trigger('change');
                    };





                    // Detect if we're clicking on a blank area of the chart.
                    paper.on('blank:pointerdown', function(evt, x, y)
                    {

                        helpers.clearSelections();


                    });

                    paper.on('cell:pointerclick', function(cellView, evt, x, y) {

                        //console.log("MODE", window.reportModel.mode);
                        console.log('cellView.model ', cellView.model);

                        switch(window.reportModel.mode)
                        {

                            case 'test':


                                switch(cellView.model.attributes.ktype) {

                                    case 'answer':

                                        // Set up selected nodes
                                        window.selectedAnswer   = cellView;
                                        window.selectedQuestion = paper.findViewByModel(cellView.model.get('answer_parent_question'));

                                        // adjust style of clicked element

                                        helpers.deselectElementStylesForTest();

                                        contentStream.addModel(cellView.model);

                                        attrs = cellView.model.get('attrs');
                                        attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                        attrs.rect['fill']              = style.node.fill.test;
                                        attrs.rect['fill-opacity']      = style.node.fillOpacity.normal;
                                        attrs.rect['stroke-width']      = style.node.strokeWidth.normal;
                                        attrs.rect['stroke']            = style.node.stroke.normal;
                                        attrs.rect['stroke-opacity']    = style.node.strokeOpacity.normal;
                                        attrs.text['fill']              = style.text.fill.normal;
                                        cellView.model.set('attrs', attrs);
                                        cellView.render().el;


                                        // Need to apply logic machine here based on rules and content.

                                        var answered = logicMachine.checkIfAnswerInputNeeded(cellView);

                                        if (answered)
                                        {
                                            logicMachine.calculateDescendants(cellView);
                                        }


                                    break;

                                }


                            break;


                            case 'build':

                                //

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
                                                reportTitle: cellView.model.get('reportFull'),
                                                reportCategoryID: cellView.model.get('report_category_id')
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
                                                sectionTitle: cellView.model.get('sectionFull')
                                            });

                                        window.selectedSection =  cellView;

                                        window.sectionModel.trigger('change');

                                        $('.formQuestionOptions').css('opacity', 1);
                                        $('.formQuestionOptions').css('pointer-events', 'auto');
                                        $('#btnQuestionAdd').removeClass('hidden');
                                        $('#btnAddAnswer').addClass('hidden');
                                        $('#btnShowLogic').addClass('hidden');
                                        $('#btnDeleteQuestion').addClass('hidden');


                                        $('.formQuestionOptions h3').text('Add Question');

                                        $('#sectionTitle').focus();

                                    break;

                                    case 'question':

                                        //selectedQuestion = cellView;

                                        helpers.resetElementStyles('question');
                                        helpers.resetElementStyles('answer'); // clear styles of sub answers too.

                                        window.selectedAnswer = null;
                                        $('.formAnswerOptions').css('opacity', 0); // turn off the answer panel as deselecting answer
                                        $('.formAnswerOptions').css('pointer-events', 'none');

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
                                        $('.formQuestionOptions').css('pointer-events', 'auto');
                                        $('#btnQuestionAdd').addClass('hidden');
                                        $('#btnAddAnswer').removeClass('hidden');
                                        $('#btnShowLogic').removeClass('hidden');
                                        $('#btnDeleteQuestion').removeClass('hidden');


                                        $('.formQuestionOptions h3').text('Edit Question - Q' + window.selectedQuestion.model.get('questionNumber'));
                                        $('#logic-modal h3').text('Logic - Q' + window.selectedQuestion.model.get('questionNumber'));
                                        //$('#logic-modal').show();

                                        $('#questionValue').focus();

                                        // Select this question in the last visible logic rule calculation block question
                                        $('option[data-element="'+ cellView.model.get('id') +'"]').last().attr('selected', 'selected');
                                        $('option[data-element="'+ cellView.model.get('id') +'"]').last().parent().trigger('change'); // trigger change on option's parent

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
                                                answerParentQuestion: cellView.model.get('answer_parent_question')
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
                                        //window.answerModel.trigger('change');
                                        //window.questionModel.trigger('change');

                                        window.answerInputModel.trigger('change');

                                        $('.formAnswerOptions').css('opacity', 1);
                                        $('.formQuestionOptions').css('opacity', 1);

                                        $('.formQuestionOptions').css('pointer-events', 'auto');
                                        $('.formAnswerOptions').css('pointer-events', 'auto');

                                        $('#btnQuestionAdd').addClass('hidden');
                                        $('#btnAddAnswer').removeClass('hidden');
                                        $('#btnShowLogic').removeClass('hidden');
                                        $('#btnDeleteQuestion').removeClass('hidden');


                                        $('.formQuestionOptions h3').text('Edit Question - Q' + window.selectedQuestion.model.get('questionNumber'));
                                        $('#logic-modal h3').text('Logic - Q' + window.selectedQuestion.model.get('questionNumber'));
                                        $('.formAnswerOptions h3').text('Edit Answer - Q'+ window.selectedQuestion.model.get('questionNumber') +', A' + window.selectedAnswer.model.get('answerNumber'));
                                        //$('#logic-modal').show();

                                        $('#answerLabel').focus();

                                        break;


                                    case 'content':

                                        selectChildElement(cellView, 'content');

                                        $('#contentText').focus();

                                        break;

                                    case 'contentwrapper':
                                    case 'logicwrapper':

                                        // Check if child is text 'content' model
                                        if (cellView.model.getEmbeddedCells().length) {

                                          selectChildElement(paper.findViewByModel(cellView.model.getEmbeddedCells()[0]), cellView.model.getEmbeddedCells()[0].get('ktype'));

                                        }

                                    break;

                                    case 'endpoint':

                                        helpers.resetElementStyles('endpoint');

                                        // adjust style of clicked element
                                        attrs = cellView.model.get('attrs');
                                        attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                        cellView.model.set('attrs', attrs);
                                        cellView.render().el;

                                        window.endPointModel.set(
                                            {
                                                endPointTitle: cellView.model.get('endPointFull'),
                                                endPointTypeID: cellView.model.get('cms_endpoint_type_id')
                                            });

                                        window.selectedEndPoint =  cellView;

                                        window.endPointModel.trigger('change');

                                        $('#endPointTitle').focus();

                                    break;

                                    default:

                                        // link etc?

                                    break;
                                }


                                break;

                        }

                    });


                    // This part of code is important as stores the up and down stream connections
                    // to and from nodes - we need these to be stored for when we are in test mode
                    // and need to know which downstream jointjs cellviews to highlight

                    graph.on('change:source change:target', function(link) {
                        var sourcePort = link.get('source').port;
                        var sourceId = link.get('source').id;
                        var targetPort = link.get('target').port;
                        var targetId = link.get('target').id;

                        link.set('droppedLink', true);

                        if (sourcePort != undefined && sourceId != undefined  && targetPort != undefined && targetId != undefined) {

                            var m = [
                             'The port <b>' + sourcePort,
                             '</b> of element with ID <b>' + sourceId,
                             '</b> is connected to port <b>' + targetPort,
                             '</b> of element with ID <b>' + targetId + '</b>'
                             ].join('');

                            //console.log(m);

                            var reversedConnectionTargets = graph.getCell(targetId).get('reversedConnectionTargets'); // when we drop a connection from something
                            var connectionTargets = graph.getCell(targetId).get('connectionTargets'); // when we drop a connection to something

                            reversedConnectionTargets[targetPort] = sourceId;
                            connectionTargets[sourcePort] = targetId;

                            // target element
                            graph.getCell(targetId).set('reversedConnectionTargets', reversedConnectionTargets);
                            graph.getCell(sourceId).set('connectionTargets', connectionTargets);

                        }
                    });



                    hudControls.listenTo(window.hudModel, "change", function(){

                        console.log('app knows something changed in the hud', window.hudModel.get('contentElement'), window.hudModel.contentElement);

                        selectChildElement(paper.findViewByModel(window.hudModel.get('contentElement')), 'content');

                        $('#contentText').focus();

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