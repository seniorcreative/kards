define(
    ['jquery',
    'modules/helpers'],

    function($, helpers) {

        // Setter functions (accept that for global scope) - where 'that' should be

        var that, paper, graph;

        var init = function (_scope, _paper, _graph) {

            that    = _scope;
            paper   = _paper;
            graph   = _graph;

        };


        var answerSelected = function()
        {

            //console.log('answer selected is getting called', window.selectedQuestion, window.selectedAnswer, window.selectedAnswer.model);

            // First get the selected question from this answer.

            if (window.selectedQuestion != null && window.selectedAnswer != null) {

                var ruleOutput = "";
                var rule, calc, question;
                var ruleObject, calcObject, questionObject;

                for (rule in window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules']) {

                    ruleObject = window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules'][rule];

                    switch (ruleObject.type) {

                        case 'rule':

                            ruleOutput += helpers.getPrefixOperatorByID(ruleObject.prefixOperator).label + "<br>";

                            // Now loop calc blocks.
                            for (calc in ruleObject.calculationBlocks) {

                                calcObject = ruleObject.calculationBlocks[calc];

                                ruleOutput += helpers.getNormalOperatorByID(calcObject.calculationOperator).label + " ";

                                if (calcObject.customValue != undefined && calcObject.customValue != '') {
                                    ruleOutput += helpers.getCustomValueTypeByID(calcObject.customValueType).label + " " + calcObject.customValue;
                                }
                                else {

                                    var qOp = [];

                                    for (var qOperand in calcObject.questionOperand) {
                                        qOp.push("Q" + calcObject.questionOperand[qOperand]);
                                    }
                                    ruleOutput += " " + qOp.join("&") + " ";

                                }

                            }

                            // Now append suffix.
                            ruleOutput += "<br>" + helpers.getNormalOperatorByID(ruleObject.suffixOperator).label + " ";

                            if (ruleObject.suffixCustomValue != undefined && ruleObject.suffixCustomValue != '') {
                                ruleOutput += helpers.getCustomValueTypeByID(ruleObject.suffixCustomValueType).label + " " + ruleObject.suffixCustomValue;
                            }
                            else {

                                var sOp = [];
                                var sOpSplit;

                                for (var sAOperand in ruleObject.suffixAnswerOperands) {
                                    // Answer operand value has format 1_2 which means question one, answer two
                                    sOpSplit = ruleObject.suffixAnswerOperands[sAOperand].split("_");
                                    sOp.push("Q" + sOpSplit[0] + '-' + "A" + sOpSplit[1]);
                                }

                                ruleOutput += sOp.join(",") + " ";

                            }

                            //ruleOutput += "<br><br>}<br><br>";


                            break;

                        case 'action':

                            ruleOutput += " THEN GO TO \"" + ruleObject.outportName + "\"";

                            break;

                    }

                    ruleOutput += "<br>";


                }

                //console.log('we made some pseudo code', ruleOutput, window.selectedQuestion, window.selectedAnswer); // ,window.selectedAnswer.model.get('answerParentQuestion'));

                return ruleOutput;

            }

        };

        return {
            init: init,
            answerSelected: answerSelected
        }


    }
);