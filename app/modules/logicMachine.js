define(
    ['jquery',
    'modules/helpers',
    'modules/style'],

    function($, helpers, style) {

        // Setter functions (accept that for global scope) - where 'that' should be

        var that, paper, graph;

        var init = function (_scope, _paper, _graph) {

            that    = _scope;
            paper   = _paper;
            graph   = _graph;

            helpers.init(that, paper, graph);

        };


        var checkIfAnswerInputNeeded = function( cellView )
        {

            window.answerInputModel.set('answerInputValueDatatypeID', cellView.model.get('answer_value_datatype_id'));

            var answerInputValues = window.answerModel.answerInputValues;

            //console.log("Answer Input ", answerInputValues, answerInputValues[cellView.model.get('answerKey')]);

            if (cellView.model.get('answerKey') in answerInputValues) {

                // Answer value is there, it's ok. Use this in calculations of what to do next.

                return true;

            }
            else
            {

                // how to show the answer input if needed....

                $('.formAnswerInputOptions').css('opacity', 1);
                $('.formAnswerInputOptions').css('pointer-events', 'auto');
                $('.formAnswerInputOptions').animate({'right': 10}, 250);

                helpers.showAlert('Answer input needed', 2500);

                return false;

            }

        };


        var getOutport = function( cellView )
        {

            //console.log('answer selected is getting called', window.selectedQuestion, window.selectedAnswer, window.selectedAnswer.model);

            // First get the selected question from this answer.

            //if (window.selectedQuestion != null && window.selectedAnswer != null) {

            var ruleOutput = "";
            var rule, calc, question;
            var ruleObject, calcObject, questionObject;

            var prefixOperator;
            var calcOperator;
            var customTypeOperator;


            // We will loop through the rules til we have a rule satisfied and an action outport identifier set

            var ruleSatisfied = false;
            var actionOutportIdentifier = '';
            var functionLogic = '';

            var answerInputValues = window.answerModel.answerInputValues;

            for (rule in window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules']) {

                ruleObject = window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules'][rule];

                switch (ruleObject.type) {

                    case 'rule':


                        prefixOperator = helpers.getPrefixOperatorByID(ruleObject.prefixOperator);


                        // IF
                        //ruleOutput += prefixOperator.label + "<br>";


                        // Condition based on prefix operator (we can

                        /*(object) ['id' => '1','data-symbol' => 'IF','label' => 'IF', 'data-type' => '2'],
                        (object) ['id' => '2','data-symbol' => '&&','label' => 'AND', 'data-type' => '2'],
                        (object) ['id' => '3','data-symbol' => '||','label' => 'OR', 'data-type' => '2'],
                        (object) ['id' => '19','data-symbol' => 'ELSE','label' => 'ELSE', 'data-type' => '2'],
                        (object) ['id' => '27','data-symbol' => 'ELSE IF','label' => 'ELSE IF', 'data-type' => '2']*/

                        switch(parseInt(prefixOperator.id))
                        {

                            case 1:
                                // IF

                                functionLogic += " if (";

                                break;

                            case 2:
                                // AND

                                break;

                            case 3:
                                // OR

                                break;

                            case 19:
                                // ELSE

                                break;

                            case 27:
                                // ELSE IF

                                functionLogic += " else if (";

                                break;

                        }



                        // Now loop calc blocks.
                        for (calc in ruleObject.calculationBlocks) {


                            calcObject = ruleObject.calculationBlocks[calc];

                            calcOperator = helpers.getNormalOperatorByID(calcObject.calculationOperator);
                            customTypeOperator = helpers.getCustomValueTypeByID(calcObject.customValueType);


                            /// VALUE OF
                            //ruleOutput += calcOperator.label + " ";


                            functionLogic += " ( " ;

                            if (calcObject.customValue != undefined && calcObject.customValue != '') {

                                // PLUS 5
                                //ruleOutput += customTypeOperator.label + " " + calcObject.customValue;

                                switch(customTypeOperator.id)
                                {

                                    /*(object) ['id' => 2, 'label' => 'true or false'],
                                    (object) ['id' => 3, 'label' => 'number'],
                                    //        (object) ['id' => 4, 'label' => 'decimal number'],
                                    (object) ['id' => 5, 'label' => 'date'],
                                    //        (object) ['id' => 6, 'label' => 'word or letter'],
                                    //        (object) ['id' => 8, 'label' => 'increase'],
                                    //        (object) ['id' => 9, 'label' => 'decrease'],
                                    //        (object) ['id' => 10, 'label' => 'no change'],
                                    //        (object) ['id' => 11, 'label' => 'ehr data point'],
                                    //        (object) ['id' => 12, 'label' => 'range'],
                                    //        (object) ['id' => 13, 'label' => 'high'],
                                    //        (object) ['id' => 14, 'label' => 'low'],
                                    //        (object) ['id' => 15, 'label' => 'none of the above'],
                                    (object) ['id' => 16, 'label' => 'years'],*/

                                    case 2:
                                        // TRUE OR FALSE

                                        functionLogic += "";

                                        break;

                                    case 3:
                                        // NUMBER

                                        functionLogic += "";

                                        break;

                                    case 5:
                                        // DATE

                                        functionLogic += "";

                                        break;

                                    case 16:
                                        // YEARS

                                        functionLogic += " " +
                                        " (function(){" +
                                        "   var now = new Date(); " +
                                        "   var offset = new Date(); " +
                                        "   offset.setYear(now.getFullYear() +("+ calcObject.customValue +"));" +
                                        "   return offset;" +
                                        "})() "; // make sure polarity is correct (plus+minus makes a minus)

                                        //functionLogic += "";

                                        break;

                                }



                            }
                            else {

                                // Q1, Q2, Q3...
                                /*var qOp = [];

                                for (var qOperand in calcObject.questionOperand) {
                                    qOp.push("Q" + calcObject.questionOperand[qOperand]);
                                }
                                ruleOutput += " " + qOp.join("&") + " ";*/



                                // I want to know the answer Value data type and the stored answer from the answerValues using the answer Key

                                //console.log('data type of this questions answer ', cellView.model.get('answer_value_datatype_id'));

                                switch(parseInt(cellView.model.get('answer_value_datatype_id')))
                                {

                                        /*(object) ['id' => 2, 'label' => 'true or false'],
                                         (object) ['id' => 3, 'label' => 'number'],
                                         //        (object) ['id' => 4, 'label' => 'decimal number'],
                                         (object) ['id' => 5, 'label' => 'date'],
                                         //        (object) ['id' => 6, 'label' => 'word or letter'],
                                         //        (object) ['id' => 8, 'label' => 'increase'],
                                         //        (object) ['id' => 9, 'label' => 'decrease'],
                                         //        (object) ['id' => 10, 'label' => 'no change'],
                                         //        (object) ['id' => 11, 'label' => 'ehr data point'],
                                         //        (object) ['id' => 12, 'label' => 'range'],
                                         //        (object) ['id' => 13, 'label' => 'high'],
                                         //        (object) ['id' => 14, 'label' => 'low'],
                                         //        (object) ['id' => 15, 'label' => 'none of the above'],
                                         (object) ['id' => 16, 'label' => 'years'],*/

                                    case 2:
                                        // TRUE OR FALSE

                                        functionLogic += "";

                                        break;

                                    case 3:
                                        // NUMBER

                                        functionLogic += "";

                                        break;

                                    case 5:
                                        // DATE
                                    case 16:
                                        // YEARS


                                        functionLogic += " " +
                                        " (function(){" +
                                        "   var parts = '"+ answerInputValues[cellView.model.get('answerKey')] +"'.split('-'); " +
                                        "   var mydate = new Date(parts[0],parts[1]-1,parts[2]);" +
                                        "   return mydate;" +
                                        "})() "; // make sure polarity is correct

                                        //functionLogic += "";

                                        break;

                                }

                                //functionLogic +=


                            }

                            switch(parseInt(calcOperator.id))
                            {

                                /*
                                (object) ['id' => '12','data-symbol' => '==','label' => 'IS EQUAL TO', 'data-type' => '1'],
                                (object) ['id' => '27','data-symbol' => 'valueof([VALUES])','label' => 'VALUE OF', 'data-type' => '1'],
                                (object) ['id' => '13','data-symbol' => '!=','label' => 'IS NOT EQUAL TO', 'data-type' => '1'],
                                (object) ['id' => '4','data-symbol' => '<','label' => 'IS LESS THAN', 'data-type' => '1'],
                                (object) ['id' => '5','data-symbol' => '<=','label' => 'IS LESS THAN OR EQUAL TO', 'data-type' => '1'],
                                (object) ['id' => '6','data-symbol' => '>','label' => 'IS GREATER THAN', 'data-type' => '1'],
                                (object) ['id' => '7','data-symbol' => '>=','label' => 'IS GREATER THAN OR EQUAL TO', 'data-type' => '1'],*/

                                case 12:
                                    // IS EQUAL TO

                                    functionLogic += " ( " ;

                                break;

                                case 27:
                                    // VALUE OF ([VALUES])


                                break;

                                case 13:
                                    // IS NOT EQUAL TO


                                break;

                                case 4:
                                    // IS LESS THAN


                                break;

                                case 5:
                                    // IS LESS THAN OR EQUAL TO


                                break;

                                case 6:
                                    // IS GREATER THAN


                                break;

                                case 7:
                                    // IS GREATER THAN OR EQUAL TO


                                break;



                            }


                            functionLogic += " ) "; // close off the condition with a right parenthesis .


                        }


                        /*if (() <= ())
                        {
                            outPort = "out 2";
                            return outPort;
                        }*/


                        // Now append suffix.

                        // IS LESS THAN OR EQUAL TO

                        var suffixOperator  = helpers.getNormalOperatorByID(ruleObject.suffixOperator);
                        var suffixValueType = helpers.getCustomValueTypeByID(ruleObject.suffixCustomValueType);



                        switch(parseInt(suffixOperator.id))
                        {

                                /*
                                 (object) ['id' => '12','data-symbol' => '==','label' => 'IS EQUAL TO', 'data-type' => '1'],
                                 (object) ['id' => '27','data-symbol' => 'valueof([VALUES])','label' => 'VALUE OF', 'data-type' => '1'],
                                 (object) ['id' => '13','data-symbol' => '!=','label' => 'IS NOT EQUAL TO', 'data-type' => '1'],
                                 (object) ['id' => '4','data-symbol' => '<','label' => 'IS LESS THAN', 'data-type' => '1'],
                                 (object) ['id' => '5','data-symbol' => '<=','label' => 'IS LESS THAN OR EQUAL TO', 'data-type' => '1'],
                                 (object) ['id' => '6','data-symbol' => '>','label' => 'IS GREATER THAN', 'data-type' => '1'],
                                 (object) ['id' => '7','data-symbol' => '>=','label' => 'IS GREATER THAN OR EQUAL TO', 'data-type' => '1'],*/

                            case 12:
                                // IS EQUAL TO

                                functionLogic += " == " ;

                                break;

                            case 27:
                                // VALUE OF ([VALUES])

                                //functionLogic += " "; // may need to re-order and parse, to do indexOf

                                break;

                            case 13:
                                // IS NOT EQUAL TO

                                functionLogic += " != ";

                                break;

                            case 4:
                                // IS LESS THAN

                                functionLogic += " < ";

                                break;

                            case 5:
                                // IS LESS THAN OR EQUAL TO

                                functionLogic += " <= ";

                                break;

                            case 6:
                                // IS GREATER THAN

                                functionLogic += " > ";

                                break;

                            case 7:
                                // IS GREATER THAN OR EQUAL TO

                                functionLogic += " >= ";

                                break;



                        }


                        //ruleOutput += "<br>" + suffixOperator.label + " ";

                        if (ruleObject.suffixCustomValue != undefined && ruleObject.suffixCustomValue != '') {

                            // years -2
                            //ruleOutput += suffixValueType.label + " " + ruleObject.suffixCustomValue;


                            switch(parseInt(cellView.model.get('answer_value_datatype_id')))
                            {

                                /*(object) ['id' => 2, 'label' => 'true or false'],
                                 (object) ['id' => 3, 'label' => 'number'],
                                 //        (object) ['id' => 4, 'label' => 'decimal number'],
                                 (object) ['id' => 5, 'label' => 'date'],
                                 //        (object) ['id' => 6, 'label' => 'word or letter'],
                                 //        (object) ['id' => 8, 'label' => 'increase'],
                                 //        (object) ['id' => 9, 'label' => 'decrease'],
                                 //        (object) ['id' => 10, 'label' => 'no change'],
                                 //        (object) ['id' => 11, 'label' => 'ehr data point'],
                                 //        (object) ['id' => 12, 'label' => 'range'],
                                 //        (object) ['id' => 13, 'label' => 'high'],
                                 //        (object) ['id' => 14, 'label' => 'low'],
                                 //        (object) ['id' => 15, 'label' => 'none of the above'],
                                 (object) ['id' => 16, 'label' => 'years'],*/

                                case 2:
                                    // TRUE OR FALSE

                                    functionLogic += "";

                                    break;

                                case 3:
                                    // NUMBER

                                    functionLogic += "";

                                    break;

                                case 5:
                                // DATE
                                case 16:
                                    // YEARS

                                    functionLogic += " " +
                                    " (function(){" +
                                    "   var now = new Date(); " +
                                    "   var offset = new Date(); " +
                                    "   offset.setYear(now.getFullYear() +("+ ruleObject.suffixCustomValue +"));" +
                                    "   return offset;" +
                                    "})() "; // make sure polarity is correct (plus+minus makes a minus)


                                    break;

                            }



                        }
                        else {

                            /*var sOp = [];
                            var sOpSplit;

                            // Q1-A1, Q1-A2...
                            for (var sAOperand in ruleObject.suffixAnswerOperands) {
                                // Answer operand value has format 1_2 which means question one, answer two
                                sOpSplit = ruleObject.suffixAnswerOperands[sAOperand].split("_");
                                sOp.push("Q" + sOpSplit[0] + '-' + "A" + sOpSplit[1]);
                            }*/

                            //ruleOutput += sOp.join(",") + " ";

                            // I'm only allowing for one answer here for now.

                            functionLogic += " " +
                            " (function(){" +
                            "   var value = " + answerInputValues[ruleObject.suffixAnswerOperands[0]] + ";" +
                            "   return value;" +
                            "})() "; // make sure polarity is correct (plus+minus makes a minus)

                            // add value from answerValues here to the functionLofic

                        }


                        functionLogic += " ) ";


                        break;

                    case 'action':

                        // GO TO "out 1"

                        //ruleOutput += " THEN GO TO \"" + ruleObject.outportName + "\"";

                        functionLogic += "{ return '" + ruleObject.outportName + "'; } ";

                        break;

                }


                //console.log(functionLogic);


                //return function
                //ruleOutput += "<br>";


            }

            //console.log('we made some pseudo code', ruleOutput, window.selectedQuestion, window.selectedAnswer); // ,window.selectedAnswer.model.get('answerParentQuestion'));

            console.log('Your function is made ', functionLogic);


            var evaluationFunction = new Function('eval', functionLogic);

            return evaluationFunction;


            //}


        };

        var calculateDescendants = function( cellView )
        {

            var answerLinkRuleAttrObject;

            for (var cl in graph.getConnectedLinks(cellView.model))
            {


                // I want to know which outport path to go down, based on this answer's value.

                //var answerValue = answerInputValues[cellView.model.get('answerKey')];

                var outPort = getOutport(cellView)();

                console.log("so dynamically got you an out port! ", outPort);


                answerLinkRuleAttrObject = graph.getConnectedLinks(cellView.model)[cl].attributes.attrs;

                if (answerLinkRuleAttrObject != undefined && answerLinkRuleAttrObject.rule != undefined)
                {

                    var reverseCellConnections  = graph.getCell(cellView.model.get('parent')).get('reversedConnectionTargets');

                    var descendantCell          = graph.getCell(reverseCellConnections[answerLinkRuleAttrObject.rule.outport]);

                    if (descendantCell) {

                        attrs = descendantCell.get('attrs');
                        attrs.rect['stroke-dasharray']  = style.node.strokeDashArray.selected;
                        attrs.rect['fill']              = style.node.fill.normal;
                        attrs.rect['fill-opacity']      = style.node.fillOpacity.normal;
                        attrs.rect['stroke-width']      = style.node.strokeWidth.normal;
                        attrs.rect['stroke']            = style.node.stroke.normal;
                        attrs.rect['stroke-opacity']    = style.node.strokeOpacity.normal;
                        attrs.text['fill']              = style.text.fill.normal;

                        descendantCell.set('attrs', attrs);
                        paper.findViewByModel(descendantCell).render().el;

                    }

                }






            }

        };

        return {
            init: init,
            checkIfAnswerInputNeeded: checkIfAnswerInputNeeded,
            calculateDescendants: calculateDescendants,
            getOutport: getOutport
        }


    }
);