define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout',
        'modules/helpers'
    ],

    function($, Backbone, joint, style, layout, helpers) {

        var that;
        var graph;
        var paper;

        var wraptext;

        var answerControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

                    helpers.init(that, paper, graph);

                    //console.log('answer controls view inited');

                    this.template = _.template($('.formAnswerOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    this.$el.find('#valueDataTypeTemplate').html(this.model.get('valueDataTypeTemplate'));

                    this.model.on('change', function(){

                        this.render()

                    }, this);

                },
                events: {
                    'keyup #answerLabel': 'answerUpdate',
                    'keyup #answerValue': 'answerValueUpdate',
                    'keyup #answerValue2': 'answerValue2Update',
                    'click #btnAddLogicOutPoint': 'addLogicOutPoint',
                    'change #valueDataType': 'changeValueDataTypeDropdown',
                    'change #answerDataPoint': 'changeAnswerDatapointDropdown'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#answerLabel').val(this.model.get('answerLabel'));
                    this.$el.find('#answerValue').val(this.model.get('answerValue'));
                    this.$el.find('#answerValue2').val(this.model.get('answerValue2'));

                    if (this.model.get('answerValueDataTypeID') != undefined) {
                        //console.log('supposed to be setting your answer value data type id value to ', this.model.get('answerValueDataTypeID'));
                        this.$el.find('#valueDataType').val(this.model.get('answerValueDataTypeID'));
                    }

                    if (this.model.get('answerDatapointID') != undefined) {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#answerDataPoint').val(this.model.get('answerDatapointID'));
                    }



                    // Now - when this answer is selected, I want to loop through this question's rules
                    // and show a summary of the logic in which this answer is implicated.

                    // First get the selected question from this answer.

                    if (window.selectedQuestion != null && window.selectedAnswer != null && this.model.get('answerParentQuestion') != undefined) {

                        var ruleOutput = "";
                        var rule, calc, question;
                        var ruleObject, calcObject, questionObject;

                        for(rule in window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules'])
                        {

                            ruleObject = window.logicModel.questionLogic[window.selectedQuestion.model.get('questionNumber')]['rules'][rule];

                            switch(ruleObject.type)
                            {

                                case 'rule':

                                    ruleOutput += helpers.getPrefixOperatorByID(ruleObject.prefixOperator).label + "<br>";

                                    // Now loop calc blocks.
                                    for (calc in ruleObject.calculationBlocks) {

                                        calcObject = ruleObject.calculationBlocks[calc];

                                        ruleOutput += helpers.getNormalOperatorByID(calcObject.calculationOperator).label + " " ;

                                        if (calcObject.customValue != undefined  && calcObject.customValue != '' )
                                        {
                                            ruleOutput += helpers.getCustomValueTypeByID(calcObject.customValueType).label + " " + calcObject.customValue;
                                        }
                                        else {

                                            var qOp = [];

                                            for (var qOperand in calcObject.questionOperand)
                                            {
                                                qOp.push("Q" + calcObject.questionOperand[qOperand]);
                                            }
                                            ruleOutput += " " + qOp.join("&") + " ";

                                        }

                                    }

                                    // Now append suffix.
                                    ruleOutput += "<br>" + helpers.getNormalOperatorByID(ruleObject.suffixOperator).label + " ";

                                    if (ruleObject.suffixCustomValue != undefined && ruleObject.suffixCustomValue != '' )
                                    {
                                        ruleOutput += helpers.getCustomValueTypeByID(ruleObject.suffixCustomValueType).label + " " + ruleObject.suffixCustomValue;
                                    }
                                    else {

                                        var sOp = [];
                                        var sOpSplit;

                                        for (var sAOperand in ruleObject.suffixAnswerOperands)
                                        {
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

                            ruleOutput+= "<br>";


                        }

                        this.$el.find('#answerLogicRules').html(ruleOutput);

                    }






                    return this;
                },
                answerUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val(), window.selectedQuestion);
                    //console.log('selectd question', window.selectedQuestion);
                    //console.log('selectd answer', window.selectedAnswer);

                    if (window.selectedQuestion != null && window.selectedAnswer != null)
                    {
                        // adjust text of clicked element
                        attrs           = window.selectedAnswer.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.question[layout.get('newQuestionTypeID')].qSize.width,
                            height: layout.question[layout.get('newQuestionTypeID')].qSize.height
                        });

                        attrs.text.text = wraptext;
                        window.selectedAnswer.model.set('attrs', attrs);
                        window.selectedAnswer.model.set('answerFull', this.$(e.target).val());
                        window.selectedAnswer.render().el;


                        // update the specific

                        //console.log(' scope for ext model ', window.questionModel );

                        var localAnswerValues = window.questionModel.answerValues;

                        //console.log(' selected Q num ', window.selectedQuestion.model.get('questionNumber'), ' selected A num ', window.selectedAnswer.model.get('answerNumber') );

                        localAnswerValues[window.selectedQuestion.model.get('questionNumber')][window.selectedAnswer.model.get('answerNumber')].label = "Q" + window.selectedQuestion.model.get('questionNumber') + ", A" + window.selectedAnswer.model.get('answerNumber') + " - (" + this.$(e.target).val().substring(0, 8) + "...)";

                        //console.log('local answer values ', localAnswerValues);

                        window.questionModel.set(
                        {
                            answerUpdated: true,
                            answerValues: localAnswerValues
                        });

                    }
                },
                answerValueUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (window.selectedQuestion != null && window.selectedAnswer != null)
                    {
                        // adjust value of selected answer
                        window.selectedAnswer.model.set({'answer_value': this.$(e.target).val()});
                        //window.selectedAnswer.render().el;
                    }
                },
                answerValue2Update: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (window.selectedQuestion != null && window.selectedAnswer != null)
                    {
                        // adjust value of selected answer
                        window.selectedAnswer.model.set({'answer_value2': this.$(e.target).val()});
                        //window.selectedAnswer.render().el;
                    }
                },
                changeValueDataTypeDropdown: function()
                {
                    //var newValueDataType = this.$('#valueDataType option:selected').text().toLowerCase();

                    if (window.selectedQuestion != null && window.selectedAnswer != null) {
                        window.selectedAnswer.model.set(
                            {
                                answer_value_datatype_id: this.$('#valueDataType option:selected').val()
                            }
                        );

                        // also pass to the answer input in case we need to show that.
                        window.answerInputModel.set(
                            {
                                answerInputValueDatatypeID: this.$('#valueDataType option:selected').val()
                            }
                        );
                    }

                },
                changeAnswerDatapointDropdown: function()
                {
                    //console.log('data point type ', this.$('#answerDataPoint option:selected').val());

                    this.model.set(
                        {
                            answerDatapointID: parseInt(this.$('#answerDataPoint option:selected').val())
                        }
                    );

                    if (window.selectedAnswer)
                    {
                        window.selectedAnswer.model.set(
                            {
                                'ehr_datapoint_id': parseInt(this.$('#answerDataPoint option:selected').val())
                            }
                        )
                    }

                }
            }
        );

        //$('#logic-modal').modal();

        return answerControlsView;

});