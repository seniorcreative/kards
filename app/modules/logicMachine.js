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

        var calculateDescendants = function( cellView )
        {

            var answerLinkRuleAttrObject;

            for (var cl in graph.getConnectedLinks(cellView.model))
            {

                answerLinkRuleAttrObject = graph.getConnectedLinks(cellView.model)[cl].attributes.attrs;

                if (answerLinkRuleAttrObject != undefined && answerLinkRuleAttrObject.rule != undefined)
                {


                    var reverseCellConnections = graph.getCell(cellView.model.get('parent')).get('reversedConnectionTargets');

                    var descendantCell = graph.getCell(reverseCellConnections[answerLinkRuleAttrObject.rule.outport]);

                    if (descendantCell) {

                        attrs = descendantCell.get('attrs');
                        attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.selected;
                        attrs.rect['fill'] = style.node.fill.normal;
                        attrs.rect['fill-opacity'] = style.node.fillOpacity.normal;
                        attrs.rect['stroke-width'] = style.node.strokeWidth.normal;
                        attrs.rect['stroke'] = style.node.stroke.normal;
                        attrs.rect['stroke-opacity'] = style.node.strokeOpacity.normal;
                        attrs.text['fill'] = style.text.fill.normal;

                        descendantCell.set('attrs', attrs);
                        paper.findViewByModel(descendantCell).render().el;

                    }

                }

            }

        };

        return {
            init: init,
            checkIfAnswerInputNeeded: checkIfAnswerInputNeeded,
            calculateDescendants: calculateDescendants
        }


    }
);