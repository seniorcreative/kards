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
                    'click': 'clickHandler'
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

                        if (ruleObj.type == 'rule')
                        {

                            $('#rule_' + r + '_prefixoperator').val(ruleObj.prefixOperator);

                            for (var c in ruleObj.calculationBlocks) {

                                if (c != null) {
                                    calcObj = ruleObj.calculationBlocks[c];

                                    $('#rule_' + r + '_calculationblock_' + c + '_calculationoperator').val(calcObj.calculationOperator);
                                    $('#rule_' + r + '_calculationblock_' + c + '_questionoperand').val(calcObj.questionOperand); // careful - this is calling a change event.
                                    $('#rule_' + r + '_calculationblock_' + c + '_operandcustomvaluetype').val(calcObj.customValueType);
                                    $('#rule_' + r + '_calculationblock_' + c + '_operandcustomvalue').val(calcObj.customValue);

                                }

                            }

                            $('#rule_' + r + '_suffixoperator').val(ruleObj.suffixOperator);
                            $('#rule_' + r + '_suffixcustomvaluetype').val(ruleObj.suffixCustomValueType);
                            $('#rule_' + r + '_suffixcustomvalue').val(ruleObj.suffixCustomValue);


                            for (var sao in ruleObj.suffixAnswerOperands) {

                                $('#rule_' + r + '_suffixansweroperands option[value="' + ruleObj.suffixAnswerOperands[sao] + '"]').attr('selected', 'selected');
                            }


                        }

                    }



                    return this;
                },
                clickHandler: function(e)
                {

                    //console.log(' click handler ', this.$(e.target).data('action'));

                    var logic = window.selectedQuestion.model.get('logic');

                    var templateData;

                    var removeAction = false;

                    if (this.$(e.target).data('action') != undefined) {


                        switch (this.$(e.target).data('action')) {

                            case 'logicRule':

                                templateData = window.loadedData;


                                // Get the maximum rule number from the array.
                                // If we had 4 rules and deleted the middle 2
                                // then the array (of keys) would be 1, 4 and we would need value 5
                                var maxkey = 0;
                                _.each(logic.rules, function(value, key) {
                                    if (maxkey == null || key > maxkey) { maxkey = key; }
                                });
                                var ruleNumber = parseInt(maxkey)+1;

                                //var ruleNumber  = logic.rules.length + 1;

                                // Add dynamic vars to the template.
                                templateData.ruleNum        = ruleNumber;
                                templateData.ruleSortIndex  = ruleNumber;
                                templateData.questions      = window.questionModel.questions;
                                templateData.answerValues   = window.questionModel.answerValues; // .sort(helpers.questionCompare);

                                //templateData.calculationNum = 1; // first calculation block of rule is added here and will always be 1

                                // Let's add a calculation to the template - from another template!
                                //var calculationBlockCompiled = HRT.templates['calculationBlock.hbs'](templateData);

                                //templateData.calculationBlocks = calculationBlockCompiled; // Add it as a returnedHTML variable to data (check it gets parsed that way in the .hbs file)

                                // or if we're using old fashioned square brackets method.

                                var ruleCompiled = HRT.templates['logicRule.hbs'](templateData);

                                // Pump the template into questions logic rules array.
                                logic.rules[ruleNumber] = {
                                    ruleCompiled: ruleCompiled,
                                    type: 'rule',
                                    calculationBlocksCompiled: {} // calculationBlockCompiled]
                                };

                                // And finally, add the logic as a property of the selected Question
                                window.selectedQuestion.model.set('logic', logic);

                                // Notify App of rule added.

                                window.questionModel.set('ruleAdded', true);

                                //$('#logic-header-button-add-action').addClass('btnDisabled');
                                //$('#logic-header-button-add-action').attr('disabled','disabled');
                                //

                                var questionLogic = window.logicModel.questionLogic;

                                questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[ruleNumber] =
                                    { // Adding a rule will add this.
                                         sortIndex: templateData.ruleNum,
                                         type: 'rule',
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

                                break;

                            case 'logicAction':

                                    // Go from question element

                                    var elementLogicWrapperID = $('#rule_' + window.selectedRule + '_calculationblock_'+ window.selectedCalculation +'_questionoperand option:selected').attr('data-parent');

                                    // To answer element
                                    var elementAnswerIDArray = [];
                                    var elementAllAnswersArray = [];

                                    // Loop all available answers (of this question)]

                                    for (var childAnswer in graph.getNeighbors(window.selectedQuestion.model))
                                    {
                                        elementAllAnswersArray.push(graph.getNeighbors(window.selectedQuestion.model)[childAnswer].id);
                                    }

                                    // Loop selected answers only.
                                    $('#rule_'+ window.selectedRule +'_suffixansweroperands option:selected').each(function(a,b){

                                        if ($(this).val() != '')
                                        {
                                            elementAnswerIDArray.push($(this).attr('data-element'));
                                        }

                                    });

                                    // if we haven't selected any individual answers
                                    if (elementAnswerIDArray.length < 1) elementAnswerIDArray = elementAllAnswersArray;

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


                                        // Get the maximum rule number from the array.
                                        // If we had 4 rules and deleted the middle 2
                                        // then the array (of keys) would be 1, 4 and we would need value 5
                                        var maxkey = 0;
                                        _.each(logic.rules, function(value, key) {
                                            if (maxkey == null || key > maxkey) { maxkey = key; }
                                        });
                                        var newActionNumber = parseInt(maxkey)+1;

                                        var actionBlockCompiled = HRT.templates['logicAction.hbs']({ ruleNum: newActionNumber, ruleSortIndex: newActionNumber,actionNum: (newOutports.length + 1), actionLabel: newOutportName });

                                        // Could add this into it's own action attrib but just want to check adding as a rule...
                                        logic.rules[newActionNumber] = {
                                            ruleCompiled: actionBlockCompiled,
                                            outportName: newOutportName,
                                            type: 'action',
                                            calculationBlocksCompiled: {}
                                        };


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

                                            newLogicOutportAnswerLink.attr('rule', {rule: newActionNumber, action: (newOutports.length + 1) , outport: newOutportName });

                                            //console.log('link prop', newLogicOutportAnswerLink, newLogicOutportAnswerLink.attr('rule'));

                                            graph.addCells(
                                                [newLogicOutportAnswerLink]
                                            );

                                        }




                                        // Add this action into the main logic rules/actions model

                                        var questionLogic = window.logicModel.questionLogic;

                                        questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[newActionNumber] =
                                        { // Adding an action will add this.
                                            sortIndex: newActionNumber,
                                            type: 'action',
                                            //ruleCompiled: actionBlockCompiled,
                                            outportName: newOutportName
                                        };

                                        window.logicModel.set('questionLogic', questionLogic);

                                    }

                                // Once a new action is added, we must disable adding action until after another rule is added

                                //$('#logic-header-button-add-action').addClass('btnDisabled');
                                //$('#logic-header-button-add-action').attr('disabled', 'disabled');

                                window.questionModel.set('actionAdded', true);

                            break;


                            case 'calculationBlock':


                                // Add a new calculation block.


                                window.selectedRule = parseInt(this.$(e.target).attr('id').split('logic-header-button-add-calculation-block-rule-')[1]);

                                 //var templateData;
                                 templateData = window.loadedData;

                                var maxkey = 0;
                                _.each(logic.rules[window.selectedRule]['calculationBlocksCompiled'], function(value, key) {
                                    if (maxkey == null || key > maxkey) { maxkey = key; }
                                });
                                var newCalculationBlockNumber = parseInt(maxkey)+1;

                                 //var newCalculationBlockNumber = logic.rules[window.selectedRule]['calculationBlocksCompiled'].length + 1;

                                 // Add dynamic vars to the template.
                                 templateData.ruleNum = window.selectedRule;
                                 templateData.ruleSortIndex = window.selectedRule;
                                 templateData.calculationNum = newCalculationBlockNumber; //

                                //Let's add a calculation to the template - from another template!
                                var calculationBlockCompiled = HRT.templates['calculationBlock.hbs'](templateData);


                                logic.rules[window.selectedRule]['calculationBlocksCompiled'][newCalculationBlockNumber] = calculationBlockCompiled;

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


                            case 'removeAction':
                                removeAction = true;
                                var actionToRemove = parseInt(this.$(e.target).attr('id').split('_')[3]) -1; // offset index for array.
                            case 'removeRule':

                                // Remove a whole rule and all its calculations. click target index must start with rule_1

                                window.selectedRule = this.$(e.target).attr('id').split('_')[1];


                                var questionLogic = window.logicModel.get('questionLogic');


                                // I need to delete the rule out of the question's logic.

                                var tmpQuestionLogic = {};

                                for (var ruleObject in questionLogic[window.selectedQuestion.model.get('questionNumber')].rules)
                                {

                                    if (questionLogic[window.selectedQuestion.model.get('questionNumber')].rules.hasOwnProperty(ruleObject)) {

                                        if (ruleObject != window.selectedRule)
                                        {
                                            tmpQuestionLogic[ruleObject] = questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[ruleObject];
                                        }

                                    }

                                }

                                questionLogic[window.selectedQuestion.model.get('questionNumber')].rules = tmpQuestionLogic;
                                //
                                window.logicModel.set('questionLogic', questionLogic);

                                //

                                // Chop out the rule at this location

                                //logic.rules.splice((parseInt(window.selectedRule) - 1), 1);

                                var tmpLogic = {};

                                for (var ruleObject in logic.rules)
                                {

                                    if (logic.rules.hasOwnProperty(ruleObject)) {

                                        if (ruleObject != window.selectedRule)
                                        {

                                            tmpLogic[ruleObject] = logic.rules[ruleObject];
                                        }

                                    }

                                }

                                logic.rules = tmpLogic;


                                // And finally, add the logic as a property of the selected Question
                                window.selectedQuestion.model.set('logic', logic);

                                // Notify App of calc block removed.
                                window.questionModel.set('ruleRemoved', true); // I  want to remove a rule block




                                // Deleting a rule and an action are the same in terms of removing the rule block html
                                // but for an action we need to also remove the outport(s) & link(s) from the joint

                                if (removeAction)
                                {

                                    var parentLogicWrapper = graph.getCell(window.selectedQuestion.model.get('parent'));

                                    //console.log(' remove action ', parentLogicWrapper);

                                    var currentOutports = parentLogicWrapper.attributes.outPorts;



                                    var ar = [];

                                    for (lo in currentOutports) {

                                        //console.log(' compare for remove action ', lo, actionToRemove);

                                        if (lo != actionToRemove)
                                        {
                                            ar[lo] = currentOutports[lo];
                                        }

                                    }

                                    parentLogicWrapper.set('outPorts', ar);


                                }


                                break;

                            case 'removeCalculation':

                                // Remove a calculation from a rule. click target index must start with rule_1_

                                window.selectedRule = this.$(e.target).attr('id').split('_')[1];

                                var calculationToRemove = this.$(e.target).attr('id').split('_')[3];








                                // We'll set a temp array and loop the delete the object.

                                // Either loop here or set the value at this index to null.

                                var questionLogic = window.logicModel.get('questionLogic');

                                // I need to delete the calculation out of the rules' calculation blocks.

                                var tmpQuestionLogic = {};

                                for (var calcObject in questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[window.selectedRule].calculationBlocks)
                                {

                                    if (questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[window.selectedRule].calculationBlocks.hasOwnProperty(calcObject)) {

                                       if (calcObject != calculationToRemove)
                                       {

                                            tmpQuestionLogic[calcObject] = questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[window.selectedRule].calculationBlocks[calcObject];
                                       }

                                    }

                                }

                                questionLogic[window.selectedQuestion.model.get('questionNumber')].rules[window.selectedRule].calculationBlocks = tmpQuestionLogic;
                                //
                                window.logicModel.set('questionLogic', questionLogic);




                                // Chop out the calc at this location

                                //logic.rules[window.selectedRule-1]['calculationBlocksCompiled'].splice((parseInt(calculationToRemove) - 1), 1);


                                var tmpLogic = {};


                                for (var calcObject in logic.rules[window.selectedRule]['calculationBlocksCompiled'])
                                {

                                    if (logic.rules[window.selectedRule]['calculationBlocksCompiled'].hasOwnProperty(calcObject)) {

                                        if (calcObject != calculationToRemove)
                                        {

                                            tmpLogic[calcObject] = logic.rules[window.selectedRule]['calculationBlocksCompiled'][calcObject];
                                        }

                                    }

                                }

                                logic.rules[window.selectedRule]['calculationBlocksCompiled'] = tmpLogic;

                                // And finally, add the logic as a property of the selected Question
                                window.selectedQuestion.model.set('logic', logic);

                                // Notify App of calc block removed.
                                window.questionModel.set('calculationBlockRemoved', true); // I  want to remove a calc block

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

//console.log('made selected calc', window.selectedCalculation);

                                selectedQuestionOperand = []; // populate with '' for empty value allowing us to select 'none'

                                this.$(e.target).find('option:selected').each(function(a,b){

                                    //console.log('loop each selected', a, b);

                                    selectedQuestionOperand.push(parseInt($(this).val()));
                                });

                                //console.log('selected question operands', selectedQuestionOperand);

                                this.$('#rule_' + window.selectedRule + '_suffixansweroperands > option').each(function (g, h) {

                                    //$(this).removeAttr('selected');  // clashing with when setting up the logic overlay

                                    if (selectedQuestionOperand.indexOf(parseInt($(this).data('question'))) != -1) $(this).removeAttr('disabled');
                                    else $(this).attr('disabled', 'disabled');
                                });

                                // Still allow us to select the first item (which should be none)
                                this.$('#rule_' + window.selectedRule + '_suffixansweroperands > option').first().removeAttr('disabled');

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



                       /* if (ruleSuffixAnswerOperands && selectedQuestionOperand) {
                            $('#logic-header-button-add-action').removeClass('btnDisabled');
                            $('#logic-header-button-add-action').removeAttr('disabled');
                        }
                        else
                        {
                            $('#logic-header-button-add-action').addClass('btnDisabled');
                            $('#logic-header-button-add-action').attr('disabled','disabled');
                        }*/


                        window.logicModel.set('questionLogic', questionLogic);

                        //console.log("questionLogic after changes", window.logicModel.questionLogic);

                    }


                }
            }
        );

        return layoutControlsView;

});