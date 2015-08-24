define(
    ['jquery',
    'modules/helpers',
    'modules/style',
    'modules/contentStream'
    ],

    function($, helpers, style, contentStream) {

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

            if (answerInputValues[cellView.model.get('answerKey')][0] != undefined && answerInputValues[cellView.model.get('answerKey')][0] != '' || answerInputValues[cellView.model.get('answerKey')][0] === false) {

                // Answer value is there, it's ok. Use this in calculations of what to do next.

                // store this answer?

                var questionNumber = parseInt(cellView.model.get('answerKey').split("_")[0]);

                window.logicModel.questionChoices[questionNumber] = answerInputValues[cellView.model.get('answerKey')][0];

                return true;

            }
            else
            {

                // how to show the answer input if needed....

                $('.formAnswerInputOptions').css('opacity', 1);
                $('.formAnswerInputOptions').css('pointer-events', 'auto');
                $('.formAnswerInputOptions').animate({'right': 10}, 250);

                helpers.showAlert('Answer needs a dynamic value', 2500);

                return false;

            }

        };


        var getOutport = function( cellView )
        {

            //console.log('getOutport getting called', window.selectedQuestion, window.selectedAnswer, window.selectedAnswer.model);

            // First get the selected question from this answer.

            //if (window.selectedQuestion != null && window.selectedAnswer != null) {

            var ruleOutput = "";
            var rule, calc, question;
            var ruleObject, calcObject, questionObject;

            var prefixOperator;
            var calcOperator;
            var calcSymbol;
            var customTypeOperator;

            var evaluationFunction;


            //check the type of the cellView
            // if it's anything other than answer just (bulid a function that returns 'out 1' and keep on going

            //console.log('getoutport function is going to look for outports of ', cellView.model.get('ktype') );

            switch(cellView.model.get('ktype'))
            {

                case 'contentwrapper':

                    evaluationFunction = new Function("eval", "return 'out';");

                    //console.log('defaulting to out as cellview ktype is ', cellView.model.get('ktype') );

                    return evaluationFunction;

                break;

                case 'logicwrapper':


                    // Kill the flow here and prompt for a question to be answered.

                    return false;

                break;

                default:

                // We will loop through the rules til we have a rule satisfied and an action outport identifier set

                var ruleSatisfied = false;
                var actionOutportIdentifier = '';

                var logicScaffold = '';
                var selectedValue = '';

                var answerInputValues = window.answerModel.answerInputValues;








                // Firstly - build a scaffold for the rules with placeholders for the conditions.


                    //  ie
                    //
                    // if ([CONDITION-SET-1] && [CONDITION-SET-2]) { [ACTION-1] } else if ([CONDITION-SET-1]) {[ACTION-1]}

                    for (rule in window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules']) {

                        ruleObject = window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules'][rule];

                        switch (ruleObject.type) {

                            case 'rule':


                                prefixOperator = helpers.getPrefixOperatorByID(ruleObject.prefixOperator);

                                switch (parseInt(prefixOperator.id)) {

                                    default:
                                    case 1:
                                        // IF

                                        logicScaffold += " if ([CONDITION-SET-"+ rule +"]";

                                        break;

                                    case 2:
                                        // AND

                                        logicScaffold += " && [CONDITION-SET-"+ rule +"]";

                                        break;

                                    case 3:
                                        // OR

                                        logicScaffold += " || [CONDITION-SET-"+ rule +"]";

                                        break;
/*
                                    case 19:
                                        // ELSE

                                        logicScaffold += " else { ([CONDITION-SET-"+ rule +"]";

                                        break;*/

                                    case 27:
                                        // ELSE IF

                                        logicScaffold += " else if ([CONDITION-SET-"+ rule +"]";

                                        break;

                                }


                            break;

                            case 'action':


                                logicScaffold += ") { [ACTION-"+rule+"] }";

                            break;

                        }


                    }

                    console.log('built your rule scaffold', logicScaffold);



                /// Secondly - build the functions for calculations.





                for (rule in window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules']) {


                    var functionLogic = '';

                    ruleObject = window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules'][rule];

                    console.log('inspection of ruleObject reveals ', ruleObject);

                    switch (ruleObject.type) {

                        case 'rule':


                            prefixOperator = helpers.getPrefixOperatorByID(ruleObject.prefixOperator);



                            // Now loop calc blocks.
                            for (calc in ruleObject.calculationBlocks) {


                                calcObject = ruleObject.calculationBlocks[calc];

                                calcOperator        = helpers.getNormalOperatorByID(calcObject.calculationOperator);
                                calcSymbol          = calcObject.calculationSymbol;
                                customTypeOperator  = helpers.getCustomValueTypeByID(calcObject.customValueType);


                                /// VALUE OF
                                //ruleOutput += calcOperator.label + " ";


                                // If we're using a custom value as part of the calculation block let's get that value and type and use if for the left-side operator

                                if (calcObject.customValue != undefined && calcObject.customValue != '') {


                                    switch (customTypeOperator.id) {

                                        case 2:
                                            // TRUE OR FALSE

                                            //functionLogic += "";

                                            break;

                                        case 3:
                                            // NUMBER

                                            //functionLogic += "";

                                            switch(calcSymbol)
                                            {

                                                case "/":


                                                    functionLogic += " / ";

                                                    break;

                                                case "*":


                                                    functionLogic += " * ";

                                                    break;

                                            }

                                            functionLogic += calcObject.customValue;

                                            break;

                                        case 6:
                                            // WORD OR LETTER

                                            //functionLogic += "";

                                        case 5:
                                            // DATE

                                            //functionLogic += "";

                                            break;

                                        case 16:
                                            // YEARS, TIME FUNCTIONS WILL HAVE A SPECIAL OPERATOR FUNCTION

                                            functionLogic += " " +
                                            " (function(){" +
                                            "   var now = new Date(); " +
                                            "   var offset = new Date(); " +
                                            "   offset.setYear(now.getFullYear() +(" + calcObject.customValue + "));" +
                                            "   return offset;" +
                                            "})() "; // make sure polarity is correct (plus+minus makes a minus)

                                            //functionLogic += "";

                                            break;

                                    }


                                }
                                else {


                                    // Otherwise, I want to know the answer Value data type and the stored answer from the answerValues using the answer Key


                                    switch (parseInt(cellView.model.get('answer_value_datatype_id'))) {

                                        case 2:
                                            // TRUE OR FALSE

                                        case 15:
                                            // None of the above

                                            if (ruleObject.suffixAnswerOperands.length <= 1) {

                                                functionLogic += " ( ";


                                                var answerQuestion              = parseInt(cellView.model.get('answerKey').split("_")[0]);

                                                var suffixAnswerOperandQuestion =  parseInt(ruleObject.suffixAnswerOperands[0].split("_")[0]);


                                                // Use the answer of this question in the calculation if that's the one intended in the suffix answer operand part of the rule.
                                                // Otherwise use the answer input value from the answerInputValues object.
                                                console.log("comparing q numbers", answerQuestion, suffixAnswerOperandQuestion);

                                                if (suffixAnswerOperandQuestion !== answerQuestion)
                                                {

                                                    console.log("using answer of previous other question", ruleObject.suffixAnswerOperands[0]);

                                                    // [ruleObject.suffixAnswerOperands[0]][0] // - this is the value of the answer option in a question not the chosen and stored answer
                                                    functionLogic += "\"" + window.logicModel.questionChoices[suffixAnswerOperandQuestion] + "\"";

                                                }
                                                else
                                                {

                                                    console.log("using answer of this question", cellView.model.get('answerKey'));

                                                    functionLogic += "\"" + answerInputValues[cellView.model.get('answerKey')][0] + "\"";

                                                }



                                                functionLogic += " ) "; // close off the condition with a right parenthesis .

                                            }
                                            else {

                                                //selectedValue = "\"" + answerInputValues[cellView.model.get('answerKey')][0] + "\"";

                                                functionLogic += "( function() { var selectedValue = \"" + answerInputValues[cellView.model.get('answerKey')][0] + "\";";

                                            }

                                            break;

                                        case 3:
                                            // NUMBER

                                            if (ruleObject.suffixAnswerOperands.length <= 1) {

                                                //functionLogic += calcSymbol;

                                                console.log('calc loop ', calcObject);

                                                switch(calcSymbol)
                                                {

                                                    case "/":


                                                        functionLogic += " / ";

                                                    break;

                                                    case "*":


                                                        functionLogic += " * ";

                                                    break;

                                                }


                                                functionLogic += " ( ";
                                                //functionLogic += answerInputValues[cellView.model.get('answerKey')][0];
                                                functionLogic += window.logicModel.questionChoices[calcObject.questionOperand[0]];
                                                functionLogic += " ) "; // close off the condition with a right parenthesis .

                                                //console.log('build calc properly here', calcSymbol);


                                            } else {

                                                //selectedValue = answerInputValues[cellView.model.get('answerKey')][0];

                                                functionLogic += "( function() { var selectedValue = " + answerInputValues[cellView.model.get('answerKey')][0] + ";";

                                            }

                                            break;

                                        default:
                                        case 6:
                                            // Word or letter

                                            //functionLogic += "";

                                            if (ruleObject.suffixAnswerOperands.length <= 1) {

                                                functionLogic += " ( ";
                                                functionLogic += "\"" + answerInputValues[cellView.model.get('answerKey')][0] + "\"";
                                                functionLogic += " ) "; // close off the condition with a right parenthesis .

                                            }
                                            else {

                                                functionLogic += "( function() { var selectedValue = \"" + answerInputValues[cellView.model.get('answerKey')][0] + "\";";

                                            }

                                            break;

                                        case 5:
                                            // DATE

                                        case 16:
                                            // YEARS


                                            functionLogic += " (function(){" +
                                            "   var parts = '" + answerInputValues[cellView.model.get('answerKey')][0] + "'.split('-'); " +
                                            "   var mydate = new Date(parts[0],parts[1]-1,parts[2]);" +
                                            "   return mydate;" +
                                            "})() "; // make sure polarity is correct


                                            break;

                                    }


                                }



                            }


                            // Now append suffix.

                            // IS LESS THAN OR EQUAL TO

                            var suffixOperator = helpers.getNormalOperatorByID(ruleObject.suffixOperator);
                            var suffixValueType = helpers.getCustomValueTypeByID(ruleObject.suffixCustomValueType);


                            // Only use  operator here for single answer choices (need a different function otherwise)

                            if (ruleObject.suffixAnswerOperands.length <= 1) {

                                switch (parseInt(suffixOperator.id)) {


                                    case 12:
                                        // IS EQUAL TO

                                        if (ruleObject.suffixAnswerOperands.length > 1) {

                                            // don't need to add operator for multiple choice multiple answers.

                                        }
                                        else {

                                            functionLogic += " == ";

                                        }


                                        break;

/*                                    case 27:
                                        // VALUE OF ([VALUES])

                                        //functionLogic += " "; // may need to re-order and parse, to do indexOf

                                        break;*/

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

                            }


                            //ruleOutput += "<br>" + suffixOperator.label + " ";

                            if (ruleObject.suffixCustomValue != undefined && ruleObject.suffixCustomValue != '') {



                                switch (parseInt(cellView.model.get('answer_value_datatype_id'))) {


                                    case 2:
                                        // TRUE OR FALSE
                                    case 15:
                                        // none of the above

                                        //functionLogic += "";
                                        //functionLogic += " )";

                                        break;

                                    case 6:

                                        // word or letter
                                    case 3:
                                        // NUMBER

                                        functionLogic += ruleObject.suffixCustomValue;
                                        //functionLogic += " )";

                                        break;

                                    case 5:

                                        // date


                                    case 16:
                                        // YEARS

                                        functionLogic += " (function(){" +
                                        "   var now = new Date(); " +
                                        "   var offset = new Date(); " +
                                        "   offset.setYear(now.getFullYear() +(" + ruleObject.suffixCustomValue + "));" +
                                        "   return offset;" +
                                        "})() "; // make sure polarity is correct (plus+minus makes a minus)


                                        break;

                                }




                            }
                            else {



                                if (ruleObject.suffixAnswerOperands.length > 1)
                                {

                                    var answerValues = [];

                                    for (var answerKeyValue in ruleObject.suffixAnswerOperands ) {


                                        if (ruleObject.suffixAnswerOperands[answerKeyValue] in answerInputValues) {


                                            var answerValue = "";

                                            if (parseInt(cellView.model.get('answer_value_datatype_id')) == 6 || isNaN(answerInputValues[ruleObject.suffixAnswerOperands[answerKeyValue]][0])) // add quotes around words / letters
                                            {

                                                answerValue += "\"";

                                            }

                                            answerValue += answerInputValues[ruleObject.suffixAnswerOperands[answerKeyValue]][0];


                                            if (parseInt(cellView.model.get('answer_value_datatype_id')) == 6 || isNaN(answerInputValues[ruleObject.suffixAnswerOperands[answerKeyValue]][0])) // add quotes around words / letters
                                            {

                                                answerValue += "\"";

                                            }

                                            answerValues.push(answerValue);


                                        }


                                    }

                                    functionLogic += "" +
                                    "var valueArray = " + "[" + answerValues.join(",") + "];" +
                                    "if (valueArray.indexOf(selectedValue) == -1) return false;" +
                                    "else return true;" +
                                    "})() ";


                                }
                                else {



                                    // I'm only allowing for one answer here - which is completely different function structure with operators and operands

                                    if (ruleObject.suffixAnswerOperands[0] in answerInputValues) {

                                        functionLogic += " (function(){" +
                                        "   var value = ";

                                        if (parseInt(cellView.model.get('answer_value_datatype_id')) == 6 || parseInt(cellView.model.get('answer_value_datatype_id')) == 2 || parseInt(cellView.model.get('answer_value_datatype_id')) == 15 || isNaN(answerInputValues[ruleObject.suffixAnswerOperands[0]][0])) // add quotes around words / letters, or boolean values, or none of the above values
                                        {

                                            functionLogic += "\"";

                                        }

                                        functionLogic += answerInputValues[ruleObject.suffixAnswerOperands[0]][0];


                                        if (parseInt(cellView.model.get('answer_value_datatype_id')) == 6 || parseInt(cellView.model.get('answer_value_datatype_id')) == 2 || parseInt(cellView.model.get('answer_value_datatype_id')) == 15 || isNaN(answerInputValues[ruleObject.suffixAnswerOperands[0]][0])) // add quotes around words / letters, or boolean values, or none of the above values
                                        {

                                            functionLogic += "\"";

                                        }

                                        functionLogic += ";" +
                                        "   return value;" +
                                        "})() "; // make sure polarity is correct (plus+minus makes a minus)

                                    }



                                }

                                //console.log('added to your function ', functionLogic, answerInputValues, ruleObject.suffixAnswerOperands[0]);

                                // add value from answerValues here to the functionLogic

                            }

                            console.log('adding this function', functionLogic);

                            //console.log('splitting', logicScaffold, "[CONDITION-SET-" + rule + "]");

                            logicScaffold = logicScaffold.replace("[CONDITION-SET-" + rule + "]", functionLogic);

                            //console.log('been split', logicScaffold);


                            break;

                        case 'action':

                            // GO TO "out 1"

                            //ruleOutput += " THEN GO TO \"" + ruleObject.outportName + "\"";

                            //functionLogic += "{ return '" + ruleObject.outportName + "'; } ";

                            logicScaffold = logicScaffold.replace("[ACTION-" + rule + "]", "return '" + ruleObject.outportName + "';");

                            break;

                    }


                }


                console.log('Your function logic is made: ', logicScaffold);

                evaluationFunction = new Function("eval", logicScaffold);

                return evaluationFunction;


                //}

                break;

            }


        };

        var calculateDescendants = function( cellView )
        {

            var answerLinkRuleAttrObject;
            var outPort = '';
            //console.log(' connected links when running calculateDescendents ', graph.getConnectedLinks(cellView.model));

            var connectedInboundLinks = graph.getConnectedLinks(cellView.model, { inbound: true });

            for (var cl in connectedInboundLinks)
            {

                //if (outPort != '') continue;
                //graph.getConnectedLinks(cellView.model)[cl].get('type'))

                //console.log('looping connected links of this answer ', graph.getConnectedLinks(cellView.model)[cl].get('type'));

                /*if (graph.getConnectedLinks(cellView.model)[cl].get('type') != 'devs.Link') {
                    if (graph.getConnectedLinks(cellView.model)[cl].get('droppedLink') != true) {
                        continue;
                    }
                }*/


                // I want to know which outport path to go down, based on this answer's value.

                //var answerValue = answerInputValues[cellView.model.get('answerKey')];


                /*
                 * ========================
                 *
                 *   CREATE AN OUTPORT FROM A DYNAMICALLY GENERATED CALCULATION
                 *
                 *   will have a condition that checks the type of cellview and just returns 'out 1' if necessary
                 *   as only logic wrappers with answers have multiple ports that need logic to be calculated
                 *   based on rules , to determine which port to follow
                 *
                 * ========================
                 */

                outPort = getOutport(cellView)();

                /*
                 * ========================
                 *
                 *
                 * ========================
                 */


                //if (outPort == false) {
                //
                //
                //
                //
                //    return;
                //
                //}

                console.log("Calculate descendents called getoutport and dynamically got you an outport ", outPort);

                answerLinkRuleAttrObject = connectedInboundLinks[cl].attributes.attrs;

                console.log("answerLinkRuleAttrObject", answerLinkRuleAttrObject);


                // Force a rule into the link so that the condition is satisfied for us to proceed into the statement
                if (outPort == 'out')
                {
                    answerLinkRuleAttrObject.rule = {};
                    answerLinkRuleAttrObject.rule.outport = 'out';
                }


                // Need the descendant connection to begin from the chosen outport match in the connectedlinks that extend
                // downward from answers to outports. From these links we can get the reversed connection to get the id
                // of the joined nodes (which was stored when we dropped the connection on in app.js)
                // and we also need to move downward recursively through this stream....

                if (answerLinkRuleAttrObject != undefined && answerLinkRuleAttrObject.rule != undefined  && answerLinkRuleAttrObject.rule.outport == outPort)
                {

                    //console.log('going to get the reversed connections from this ', cellView.model.get('ktype') , ' to see where to go next');

                    var reverseCellConnections;


                    // If its an answer we need to get the ports from the parent.
                    switch(cellView.model.get('ktype'))
                    {

                        case 'answer':


                            // Add the question

                            var answerParentQuestion = graph.getCell(cellView.model.get('answer_parent_question'));

                            contentStream.individualisationAppend({type: 'question', content: answerParentQuestion.get('questionFull')});

                            // Add the answer

                            contentStream.individualisationAppend({type: 'answer', content: cellView.model.get('answerFull'), valueDataType: cellView.model.get('answer_value_datatype_id'), value: cellView.model.get('answer_value'), value2:cellView.model.get('answer_value2') });

                            //

                            reverseCellConnections = graph.getCell(cellView.model.get('parent')).get('reversedConnectionTargets');

                            break;

                        case 'endpoint':

                            return;

                            break;

                        case 'logicwrapper':

                            //

                            break;

                        default:

                            reverseCellConnections = cellView.model.get('reversedConnectionTargets');

                            break;

                    }


                    var reverseCellOutportConnectedLinks = reverseCellConnections[answerLinkRuleAttrObject.rule.outport];

                    //console.log('reverseCellOutportConnectedLinks', reverseCellOutportConnectedLinks);

                    for (var descendantCellIndex = 0; descendantCellIndex < reverseCellOutportConnectedLinks.length; descendantCellIndex++) {


                        var descendantCell = graph.getCell(reverseCellOutportConnectedLinks[descendantCellIndex]);

                        if (descendantCell) {

                            contentStream.addModel(descendantCell);

                            var descendantCellView = paper.findViewByModel(descendantCell);

                            // Now we recurse.

                            switch (descendantCellView.model.get('ktype')) {


                                case 'endpoint':

                                    attrs = descendantCell.get('attrs');
                                    attrs.rect['stroke-dasharray'] = style.endpoint.strokeDashArray.selected;
                                    attrs.rect['fill'] = style.endpoint.fill.normal;
                                    attrs.rect['fill-opacity'] = style.endpoint.fillOpacity.normal;
                                    attrs.rect['stroke-width'] = style.endpoint.strokeWidth.normal;
                                    attrs.rect['stroke'] = style.endpoint.stroke.normal;
                                    attrs.rect['stroke-opacity'] = style.endpoint.strokeOpacity.normal;
                                    attrs.text['fill'] = style.text.fill.normal;

                                    descendantCell.set('attrs', attrs);

                                    descendantCellView.render().el;

                                    contentStream.individualisationAppend({
                                        type: 'endpoint',
                                        content: descendantCell.get('endPointFull')
                                    });

                                    return;

                                    break;

                                case 'contentwrapper':


                                    attrs = descendantCell.get('attrs');
                                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                    attrs.rect['fill'] = style.node.fill.normal;
                                    attrs.rect['fill-opacity'] = style.node.fillOpacity.normal;
                                    attrs.rect['stroke-width'] = style.node.strokeWidth.normal;
                                    attrs.rect['stroke'] = style.node.stroke.normal;
                                    attrs.rect['stroke-opacity'] = style.node.strokeOpacity.normal;
                                    attrs.text['fill'] = style.text.fill.normal;

                                    descendantCell.set('attrs', attrs);

                                    descendantCellView.render().el;


                                    // get content inside

                                    //console.log('arrived at a contentwrapper');

                                    // Need to add this block to the content HUD

                                    var descendantChildCell = descendantCell.getEmbeddedCells()[0];

                                    attrs = descendantChildCell.get('attrs');

                                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                    attrs.rect['fill'] = style.node.fill.normal;
                                    attrs.rect['fill-opacity'] = style.node.fillOpacity.normal;
                                    attrs.rect['stroke-width'] = style.node.strokeWidth.normal;
                                    attrs.rect['stroke'] = style.node.stroke.normal;
                                    attrs.rect['stroke-opacity'] = style.node.strokeOpacity.normal;
                                    attrs.text['fill'] = style.text.fill.normal;

                                    descendantChildCell.set('attrs', attrs);

                                    var descendantChildCellView = paper.findViewByModel(descendantChildCell);
                                    descendantChildCellView.render().el;

                                    // Need to add things to 'content stream highlights' too

                                    var contentElements = window.hudModel.contentElements;

                                    if (contentElements.indexOf(descendantChildCell.id) == -1) {

                                        contentElements.push(descendantChildCell.id);

                                        var newContentElement = '<li><a href="#" data-index="' + descendantChildCell.get('contentNumber') + '" data-element="' + descendantChildCell.id + '">C' + descendantChildCell.get('contentNumber') + '</a></li>';

                                        $('#content-nodes').append(newContentElement);

                                        contentStream.individualisationAppend({
                                            type: 'content',
                                            content: descendantChildCell.get('contentFull')
                                        });

                                    }

                                    window.hudModel.contentElements = contentElements;

                                    reverseCellConnections = cellView.model.get('reversedConnectionTargets');

                                    //console.log(' going to now recurse from this contentwrapper we found linked to the reversedconnection above ', descendantCellView);

                                    setTimeout(calculateDescendants(descendantCellView), 250);


                                    break;

                                case 'logicwrapper':



                                    //console.log('arrived at a logicwrapper - will highlight the question inside');


                                    attrs = descendantCell.get('attrs');
                                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                    attrs.rect['fill'] = style.node.fill.normal;
                                    attrs.rect['fill-opacity'] = style.node.fillOpacity.normal;
                                    attrs.rect['stroke-width'] = style.node.strokeWidth.normal;
                                    attrs.rect['stroke'] = style.node.stroke.normal;
                                    attrs.rect['stroke-opacity'] = style.node.strokeOpacity.normal;
                                    attrs.text['fill'] = style.text.fill.normal;

                                    descendantCell.set('attrs', attrs);

                                    descendantCellView.render().el;


                                    helpers.showAlert("Please answer question Q" + descendantCell.get('questionNumber'), 2500);


                                    var descendantChildCells = descendantCell.getEmbeddedCells();

                                    for (var d in descendantChildCells) {
                                        attrs = descendantChildCells[d].get('attrs');

                                        attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                        attrs.rect['fill'] = style.node.fill.normal;
                                        attrs.rect['fill-opacity'] = style.node.fillOpacity.normal;
                                        attrs.rect['stroke-width'] = style.node.strokeWidth.normal;
                                        attrs.rect['stroke'] = style.node.stroke.normal;
                                        attrs.rect['stroke-opacity'] = style.node.strokeOpacity.normal;
                                        attrs.text['fill'] = style.text.fill.normal;

                                        descendantChildCells[d].set('attrs', attrs);

                                        var descendantChildCellView = paper.findViewByModel(descendantChildCells[d]);
                                        descendantChildCellView.render().el;

                                    }


                                    reverseCellConnections = cellView.model.get('reversedConnectionTargets');

                                    //console.log('going to recurse from default with ', descendantCellView);

                                    setTimeout(calculateDescendants(descendantCellView), 250);

                                    break;


                                default:


                                    attrs = descendantCell.get('attrs');
                                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                                    attrs.rect['fill'] = style.node.fill.normal;
                                    attrs.rect['fill-opacity'] = style.node.fillOpacity.normal;
                                    attrs.rect['stroke-width'] = style.node.strokeWidth.normal;
                                    attrs.rect['stroke'] = style.node.stroke.normal;
                                    attrs.rect['stroke-opacity'] = style.node.strokeOpacity.normal;
                                    attrs.text['fill'] = style.text.fill.normal;

                                    descendantCell.set('attrs', attrs);

                                    descendantCellView.render().el;


                                    reverseCellConnections = cellView.model.get('reversedConnectionTargets');

                                    //console.log('going to recurse from default with ', descendantCellView);

                                    setTimeout(calculateDescendants(descendantCellView), 250);

                                    break;

                            }


                        }

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