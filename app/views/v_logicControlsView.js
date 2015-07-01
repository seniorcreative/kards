define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout',
        'modules/helpers',
        'handlebars.runtime',
        'compiled-templates'],

    function($, Backbone, joint, style, layout, helpers, HRT, compiledtemplates) {

        var scope;
        var graph;
        var paper;


        var layoutControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');
                    
                    helpers.init(that, paper, graph);

                    this.template = _.template($('#logic-modal').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    this.$el.find('#logic-rules').html(this.model.get('logicRuleTemplate'));

                    this.model.on('change', function(){

                        this.render()

                    }, this);

                },
                events: {

                    //'click #btnQuestionAdd': 'addQuestion',
                    //'keyup #questionValue': 'questionUpdate',
                    //'change #questionType': 'changeQuestionTypeDropdown',
                    'change': 'changeHandler',
                    'click': 'addHandler',
                    // rule for add rule...
                    'click #logic-header-button-add-rule': 'addRule',
                    'click #logic-header-button-add-action': 'addAction'
                    // rule for add action...
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#logic-rules').html(this.model.get('logicRuleTemplate'));

                    return this;
                },
                addHandler: function(e)
                {

                    console.log(' add handler - click ', this.$(e.target).data('action'));

                    var logic = window.selectedQuestion.model.get('logic');

                    var templateData;

                    if (this.$(e.target).data('action') != undefined) {


                        switch (this.$(e.target).data('action')) {

                            case 'logicRule':

                                templateData = window.loadedData;

                                // Add dynamic vars to the template.
                                templateData.ruleNum = logic.rules.length + 1;
                                templateData.ruleSortIndex = logic.rules.length + 1;
                                templateData.questions = window.questionModel.questions;
                                templateData.answerValues = window.questionModel.answerValues; // .sort(helpers.questionCompare);

                                templateData.calculationNum = 1; // first calculation block of rule is added here and will always be 1

                                // Let's add a calculation to the template - from another template!
                                var calculationBlockCompiled = HRT.templates['calculationBlock.hbs'](templateData);

                                //templateData.calculationBlocks = calculationBlockCompiled; // Add it as a returnedHTML variable to data (check it gets parsed that way in the .hbs file)

                                // or if we're using olf fashioned square brackets method.

                                var ruleCompiled = HRT.templates['logicRule.hbs'](templateData); // .replace('[[[calculationBlocks]]]', calculationBlockCompiled);

                                // Pump the template into questions logic rules array.
                                logic.rules.push({
                                    ruleCompiled: ruleCompiled,
                                    calculationBlocksCompiled: [calculationBlockCompiled]
                                });

                                // And finally, add the logic as a property of the selected Question
                                window.selectedQuestion.model.set('logic', logic);

                                // Notify App of rule added.

                                window.questionModel.set('ruleAdded', true);

                                break;

                            case 'logicAction':

                                if (window.selectedQuestion != null) {

                                    var parentLogicWrapper = graph.getCell(window.selectedQuestion.model.get('parent'));

                                    var newOutports = parentLogicWrapper.attributes.outPorts;
                                    var ar = [];
                                    for (lo in newOutports) {
                                        ar[lo] = newOutports[lo];
                                    }

                                    var newOutportName = "out " + (newOutports.length + 1);

                                    ar.push(newOutportName);
                                    parentLogicWrapper.set('outPorts', ar);


                                    // Now we'll work out the links

                                    // Go from question element
                                    var elementLogicWrapperID = $('#rule_1_calculationblock_1_operand_answer option:selected').attr('data-parent');

                                    // To answer element
                                    var elementAnswerID = $('#rule_1_suffix_answer_value option:selected').attr('data-element');

                                    console.log(' logic connect id ', elementLogicWrapperID, elementAnswerID );

                                    //
                                    if (elementLogicWrapperID.length > 0  && elementAnswerID.length > 0) {

                                        var newLogicOutportAnswerLink = new joint.shapes.devs.Link({
                                            source: {
                                                id: elementLogicWrapperID,
                                                port: newOutportName // This is potentially one of many, so suffix with count of 1
                                            },
                                            target: {
                                                id: elementAnswerID
                                            }
                                        });

                                        graph.addCells(
                                            [newLogicOutportAnswerLink]
                                        );


                                        //get ports from logicwrapper...
                                        //elementLogicWrapperID

                                        var parentLogicWrapper = graph.getCell(elementLogicWrapperID);
                                        var outports = parentLogicWrapper.attributes.outPorts;

                                        var actionBlockCompiled = HRT.templates['logicAction.hbs']({ actionNum: outports.length, actionLabel: newOutportName });

                                        // Could add this into it's own action attrib but just want to check adding as a rule...
                                        logic.rules.push({
                                            ruleCompiled: actionBlockCompiled,
                                            calculationBlocksCompiled: []
                                        });

                                    }

                                }

                                window.questionModel.set('actionAdded', true);

                            break;


                            case 'calculationBlock':


                                var ruleNumber = parseInt(this.$(e.target).attr('id').split('logic-header-button-add-calculation-block-rule-')[1]);

                                //console.log('rule calc block num', ruleNumber);

                                 //var templateData;
                                 templateData = window.loadedData;

                                 // Add dynamic vars to the template.
                                 templateData.ruleNum = ruleNumber;
                                 templateData.ruleSortIndex = ruleNumber;
                                 templateData.calculationNum = logic.rules[ruleNumber-1]['calculationBlocksCompiled'].length + 1; // first calc block of rule added here , will always be 1

                                //Let's add a calculation to the template - from another template!
                                var calculationBlockCompiled = HRT.templates['calculationBlock.hbs'](templateData);


                                logic.rules[ruleNumber-1]['calculationBlocksCompiled'].push(calculationBlockCompiled);

                                 // And finally, add the logic as a property of the selected Question
                                 window.selectedQuestion.model.set('logic', logic);

                                // Notify App of calc block added.
                                window.questionModel.set('calculationBlockAdded', true); // I only want to append a calc block



                                break;

                        }

                    }

                },
                changeHandler: function(e)
                {


                    // Split the control name and get the rule num. The control id's must all start with rule_1 for this to work
                    var ruleNumber = $(e.target).attr('id').split('_')[1];
                    //
                    //console.log('changed something', this.$(e.target).data('calculation-control'));
                    var selectedLogicRuleQuestionNumber;

                    switch(this.$(e.target).data('calculation-control'))
                    {

                        case 'operandAnswerOf':

                            selectedLogicRuleQuestionNumber = this.$(e.target).find('option:selected').val();

                            //console.log('selected Q ', selectedQ);

                            // Now I'm going to loop through the questionModel answerValues and disable options in the
                            // drop down answer options array.

                            // But to map to it I want the 'closest' select (within this rule) with data('calculation-control') of suffixAnswerValue

                            this.$('#rule_'+ruleNumber+'_suffix_answer_value > option').each(function(g,h) {

                                //console.log(this.text, this.value,g,h);
                                //console.log('loop qid ', $(this).data('question'));

                                $(this).removeAttr('selected');

                                if ($(this).data('question') == selectedLogicRuleQuestionNumber)
                                {
                                    $(this).removeAttr('disabled');
                                }
                                else
                                {
                                    $(this).attr('disabled','disabled');
                                }

                            });


                        break;

                    }

                    //switch (this.$(e.target).attr('id')) {
                    //
                    //    case '':
                    //
                    //    break;
                    //
                    //}

                }
            }
        );

        return layoutControlsView;

});