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




        // Rule options
        var ruleSortIndex, rulePrefixOperator, ruleSuffixOperator, ruleSuffixAnswerOperands, ruleSuffixCustomValueType, ruleSuffixCustomValue;

        // Calculation operator
        var selectedCalculationOperator, selectedQuestionOperand, selectedCustomValueType, customValue;





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
                    'keyup': 'changeHandler',
                    'click': 'addHandler'
                    // rule for add rule...
                    //'click #logic-header-button-add-rule': 'addRule',
                    //'click #logic-header-button-add-action': 'addAction'
                    // rule for add action...
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#logic-rules').html(this.model.get('logicRuleTemplate'));

                    //

                    //console.log('applying changes after model has changed');

                    // Now apply mapped selections, by looping over logicModel questionLogic

                    //console.log(window.logicModel, window.logicModel.questionLogic, window.logicModel.get('questionLogic'))

                    var questionLogic = window.logicModel.questionLogic;

                    //console.log('window.selectedQuestion ', window.selectedQuestion);

                    var selectedQuestionRules = questionLogic[window.selectedQuestion.model.get('questionNumber')].rules;

                    // loop each rule.

                    var ruleObj, calcObj;

                    for (var r in selectedQuestionRules)
                    {

                        ruleObj = selectedQuestionRules[r];

                        //console.log('looking at rule', r, selectedQuestionRules[r]);

                        $('#rule_'+r+'_sortindex').val(ruleObj.sortIndex);
                        $('#rule_'+r+'_prefixoperator').val(ruleObj.prefixOperator);
                        $('#rule_'+r+'_suffixoperator').val(ruleObj.suffixOperator);
                        $('#rule_'+r+'_suffixansweroperands').val(ruleObj.suffixAnswerOperands);
                        $('#rule_'+r+'_suffixcustomvaluetype').val(ruleObj.suffixCustomValueType);
                        $('#rule_'+r+'_suffixcustomvalue').val(ruleObj.suffixCustomValue);

                        for (var c in ruleObj.calculationBlocks)
                        {

                            calcObj = ruleObj.calculationBlocks[c];

                            $('#rule_'+r+'_calculationblock_'+c+'_calculationoperator').val(calcObj.calculationOperator);
                            $('#rule_'+r+'_calculationblock_'+c+'_questionoperand').val(calcObj.questionOperand);
                            $('#rule_'+r+'_calculationblock_'+c+'_operandcustomvaluetype').val(calcObj.customValueType);
                            $('#rule_'+r+'_calculationblock_'+c+'_operandcustomvalue').val(calcObj.customValue);


                        }

                    }



                    return this;
                },
                addHandler: function(e)
                {

                    //console.log(' add handler - click ', this.$(e.target).data('action'));

                    var logic = window.selectedQuestion.model.get('logic');

                    var templateData;

                    if (this.$(e.target).data('action') != undefined) {


                        switch (this.$(e.target).data('action')) {

                            case 'logicRule':

                                templateData = window.loadedData;

                                var ruleNumber  = logic.rules.length + 1;

                                // Add dynamic vars to the template.
                                templateData.ruleNum = ruleNumber;
                                templateData.ruleSortIndex = ruleNumber;
                                templateData.questions = window.questionModel.questions;
                                templateData.answerValues = window.questionModel.answerValues; // .sort(helpers.questionCompare);

                                //templateData.calculationNum = 1; // first calculation block of rule is added here and will always be 1

                                // Let's add a calculation to the template - from another template!
                                //var calculationBlockCompiled = HRT.templates['calculationBlock.hbs'](templateData);

                                //templateData.calculationBlocks = calculationBlockCompiled; // Add it as a returnedHTML variable to data (check it gets parsed that way in the .hbs file)

                                // or if we're using old fashioned square brackets method.

                                var ruleCompiled = HRT.templates['logicRule.hbs'](templateData); // .replace('[[[calculationBlocks]]]', calculationBlockCompiled);

                                // Pump the template into questions logic rules array.
                                logic.rules.push({
                                    ruleCompiled: ruleCompiled,
                                    calculationBlocksCompiled: [] // calculationBlockCompiled]
                                });

                                // And finally, add the logic as a property of the selected Question
                                window.selectedQuestion.model.set('logic', logic);

                                // Notify App of rule added.

                                window.questionModel.set('ruleAdded', true);

                                $('#logic-header-button-add-action').addClass('btnDisabled');
                                $('#logic-header-button-add-action').attr('disabled','disabled');
                                //

                                var questionLogic = window.logicModel.questionLogic;

                                questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[ruleNumber] =
                                    { // Adding a rule will add this.
                                         sortIndex: templateData.ruleNum,
                                         prefixOperator: templateData.logicOperatorPrefix[0]['id'], // set as first value from data provider
                                         calculationBlocks: {
                                            /* 1: { // Adding a calculation block will add another one of this.
                                                 sortIndex: 1,
                                                 calculationOperator: templateData.logicOperatorNormal[0]['id'],
                                                 questionOperand: '',
                                                 customValueType: templateData.valueDataTypesDropdown[0]['id'],
                                                 customValue: ''
                                             }*/
                                         },
                                         suffixOperator: templateData.logicOperatorNormal[0]['id'],
                                         suffixAnswerOperands: [],
                                         suffixCustomValueType: templateData.valueDataTypesDropdown[0]['id'],
                                         suffixCustomValue: ''
                                    };

                                window.logicModel.set('questionLogic', questionLogic);

                                //console.log('Logic after new rule added', window.logicModel.questionLogic);

                                break;

                            case 'logicAction':

                                    // Go from question element
                                    var elementLogicWrapperID = $('#rule_' + window.selectedRule + '_calculationblock_'+ window.selectedCalculation +'_questionoperand option:selected').attr('data-parent');

                                    // To answer element
                                    var elementAnswerIDArray = [];

                                    $('#rule_'+ window.selectedRule +'_suffixansweroperands option:selected').each(function(a,b){

                                        elementAnswerIDArray.push($(this).attr('data-element'));

                                    });

                                    //console.log(' logic connect id ', window.selectedRule, window.selectedCalculation, elementLogicWrapperID, elementAnswerIDArray );

                                    //
                                    if (elementLogicWrapperID && elementAnswerIDArray.length > 0) {

                                        var parentLogicWrapper = graph.getCell(window.selectedQuestion.model.get('parent'));

                                        var newOutports = parentLogicWrapper.attributes.outPorts;
                                        var ar = [];
                                        for (lo in newOutports) {
                                            ar[lo] = newOutports[lo];
                                        }

                                        var newOutportName = "out " + (newOutports.length + 1);

                                        ar.push(newOutportName);
                                        parentLogicWrapper.set('outPorts', ar);

                                        // Now we'll work out the links - and loop over the selected answers.

                                        var newLogicOutportAnswerLink;

                                        for(var selectedElementAnswerID in elementAnswerIDArray) {

                                            newLogicOutportAnswerLink = new joint.shapes.devs.Link({
                                                source: {
                                                    id: elementLogicWrapperID,
                                                    port: newOutportName // This is potentially one of many, so suffix with count of 1
                                                },
                                                target: {
                                                    id: elementAnswerIDArray[selectedElementAnswerID]
                                                }

                                            });

                                            graph.addCells(
                                                [newLogicOutportAnswerLink]
                                            );

                                        }


                                        //get ports from logicwrapper...
                                        //elementLogicWrapperID

                                        var parentLogicWrapper = graph.getCell(elementLogicWrapperID);
                                        var outports = parentLogicWrapper.attributes.outPorts;

                                        var newActionNumber = logic.rules.length + 1;

                                        var actionBlockCompiled = HRT.templates['logicAction.hbs']({ ruleNum: newActionNumber, ruleSortIndex: newActionNumber,actionNum: outports.length, actionLabel: newOutportName });

                                        // Could add this into it's own action attrib but just want to check adding as a rule...
                                        logic.rules.push({
                                            ruleCompiled: actionBlockCompiled,
                                            calculationBlocksCompiled: []
                                        });

                                    }

                                // Once a new action is added, we must disable adding action until after another rule is added

                                $('#logic-header-button-add-action').addClass('btnDisabled');
                                $('#logic-header-button-add-action').attr('disabled', 'disabled');

                                window.questionModel.set('actionAdded', true);

                            break;


                            case 'calculationBlock':


                                // Add a new calculation block.


                                window.selectedRule = parseInt(this.$(e.target).attr('id').split('logic-header-button-add-calculation-block-rule-')[1]);

                                 //var templateData;
                                 templateData = window.loadedData;

                                 var newCalculationBlockNumber = logic.rules[window.selectedRule-1]['calculationBlocksCompiled'].length + 1;

                                 // Add dynamic vars to the template.
                                 templateData.ruleNum = window.selectedRule;
                                 templateData.ruleSortIndex = window.selectedRule;
                                 templateData.calculationNum = newCalculationBlockNumber; //

                                //Let's add a calculation to the template - from another template!
                                var calculationBlockCompiled = HRT.templates['calculationBlock.hbs'](templateData);


                                logic.rules[window.selectedRule-1]['calculationBlocksCompiled'].push(calculationBlockCompiled);

                                 // And finally, add the logic as a property of the selected Question
                                 window.selectedQuestion.model.set('logic', logic);


                                var questionLogic = window.logicModel.questionLogic;

                                questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[window.selectedRule].calculationBlocks[newCalculationBlockNumber] =
                                {
                                    sortIndex: templateData.calculationNum,
                                    calculationOperator: templateData.logicOperatorNormal[0]['id'],
                                    questionOperand: '',
                                    customValueType: templateData.valueDataTypesDropdown[0]['id'],
                                    customValue: ''
                                };

                                window.logicModel.set('questionLogic', questionLogic);

                                // Notify App of calc block added.
                                window.questionModel.set('calculationBlockAdded', true); // I only want to append a calc block


                                break;

                        }

                    }

                },
                changeHandler: function(e)
                {


                    if (window.selectedQuestion != null) {

                        var selectedQuestionNumber = window.selectedQuestion.model.get('questionNumber');

                        window.selectedRule = $(e.target).attr('id').split('_')[1];

                        //
                        //console.log('changed something', this.$(e.target).data('calculation-control'));


                        // Now save this selection into the logicModel.
                        var questionLogic = window.logicModel.questionLogic;



                        switch (this.$(e.target).data('calculation-control')) {

                            // Rule specific

                            case 'sortindex':

                                ruleSortIndex = this.$(e.target).val();

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].sortIndex = ruleSortIndex;

                                break;

                            case 'prefixoperator':

                                rulePrefixOperator = this.$(e.target).find('option:selected').val();

                                //console.log(selectedQuestionNumber, questionLogic[selectedQuestionNumber], window.selectedRule, questionLogic[selectedQuestionNumber].rules[window.selectedRule]);

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].prefixOperator = rulePrefixOperator;

                                break;

                            case 'suffixoperator':

                                ruleSuffixOperator = this.$(e.target).find('option:selected').val();

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].suffixOperator = ruleSuffixOperator;

                                break;

                            case 'suffixansweroperands':

                                ruleSuffixAnswerOperands = [];

                                this.$(e.target).find('option:selected').each(function (g, h) {

                                    ruleSuffixAnswerOperands.push($(this).val());

                                });

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].suffixAnswerOperands = ruleSuffixAnswerOperands;

                                break;

                            case 'suffixcustomvaluetype':

                                ruleSuffixCustomValueType = this.$(e.target).find('option:selected').val();

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].suffixCustomValueType = ruleSuffixCustomValueType;

                                break;

                            case 'suffixcustomvalue':

                                ruleSuffixCustomValue = this.$(e.target).val();

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].suffixCustomValue = ruleSuffixCustomValue;

                            break;



                            // Calculation specific


                            case 'calculationoperator':

                                window.selectedCalculation = $(e.target).attr('id').split('_')[3]; // only will work if id is like rule_1_calculation_2

                                selectedCalculationOperator = this.$(e.target).find('option:selected').val();

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].calculationBlocks[window.selectedCalculation].calculationOperator = selectedCalculationOperator;


                                break;

                            case 'questionoperand':

                                window.selectedCalculation = $(e.target).attr('id').split('_')[3]; // only will work if id is like rule_1_calculation_2


                                selectedQuestionOperand = [];

                                this.$(e.target).find('option:selected').each(function(a,b){

                                    //console.log('loop each selected', a, b);

                                    selectedQuestionOperand.push(parseInt($(this).val()));
                                });

                                //console.log('selected question operands', selectedQuestionOperand);

                                this.$('#rule_' + window.selectedRule + '_suffixansweroperands > option').each(function (g, h) {
                                    $(this).removeAttr('selected');

                                    if (selectedQuestionOperand.indexOf(parseInt($(this).data('question'))) != -1) $(this).removeAttr('disabled');
                                    else $(this).attr('disabled', 'disabled');
                                });

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].calculationBlocks[window.selectedCalculation].questionOperand = selectedQuestionOperand;

                                break;

                            case 'operandcustomvaluetype':

                                window.selectedCalculation = $(e.target).attr('id').split('_')[3]; // only will work if id is like rule_1_calculation_2

                                selectedCustomValueType = this.$(e.target).find('option:selected').val();

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].calculationBlocks[window.selectedCalculation].customValueType = selectedCustomValueType;

                                break;

                            case 'operandcustomvalue':

                                window.selectedCalculation = $(e.target).attr('id').split('_')[3]; // only will work if id is like rule_1_calculation_2

                                customValue = this.$(e.target).val();

                                questionLogic[selectedQuestionNumber].rules[window.selectedRule].calculationBlocks[window.selectedCalculation].customValue = customValue;


                                break;

                        }



                        if (ruleSuffixAnswerOperands && selectedQuestionOperand) {
                            $('#logic-header-button-add-action').removeClass('btnDisabled');
                            $('#logic-header-button-add-action').removeAttr('disabled');
                        }
                        else
                        {
                            $('#logic-header-button-add-action').addClass('btnDisabled');
                            $('#logic-header-button-add-action').attr('disabled','disabled');
                        }


                        window.logicModel.set('questionLogic', questionLogic);

                        //console.log("questionLogic after changes", window.logicModel.questionLogic);

                    }


                }
            }
        );

        return layoutControlsView;

});