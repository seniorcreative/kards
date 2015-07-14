define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout',
        'modules/helpers',
        'modules/pseudoCode'
    ],

    function($, Backbone, joint, style, layout, helpers, pseudoCode) {

        var that;
        var graph;
        var paper;

        var wraptext;

        var answerInputValues;

        var answerControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

                    helpers.init(that, paper, graph);
                    pseudoCode.init(that, paper, graph);

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

                    var ruleOutput = pseudoCode.answerSelected();

                    if (ruleOutput)
                    {

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
                    console.log('answer value is changing', e, this.$(e.target).val());
                    if (window.selectedQuestion != null && window.selectedAnswer != null)
                    {
                        // adjust value of selected answer
                        window.selectedAnswer.model.set({'answer_value': this.$(e.target).val()});

                        answerInputValues = window.answerModel.answerInputValues;
                        answerInputValues[window.selectedAnswer.model.get('answerKey')] = this.$(e.target).val();
                        window.answerModel.set('answerInputValues', answerInputValues);

                        //console.log('changed ', this.model.answerKey, this.model, window.answerModel.answerInputValues);

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

                        answerInputValues = window.answerModel.answerInputValues;
                        answerInputValues[window.selectedAnswer.model.get('answerKey')] = this.$(e.target).val();
                        window.answerModel.set('answerInputValue2s', answerInputValues);

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