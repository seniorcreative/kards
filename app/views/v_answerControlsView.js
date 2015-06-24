define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout'],

    function($, Backbone, joint, style, layout) {

        var scope;
        var graph;
        var paper;

        var answerControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    scope = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

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

                    if (this.model.get('answerValueDataTypeID') != '') {
                        //console.log('supposed to be setting your answer value data type id value to ', this.model.get('answerValueDataTypeID'));
                        this.$el.find('#valueDataType').val(this.model.get('answerValueDataTypeID'));
                    }

                    if (this.model.get('answerDatapointID') != '') {
                        //console.log('supposed to be setting your question type value to ', this.model.get('questionTypeID'));
                        this.$el.find('#answerDataPoint').val(this.model.get('answerDatapointID'));
                    }

                    return this;
                },
                answerUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());

                    if (selectedQuestion && selectedAnswer)
                    {
                        // adjust text of clicked element
                        attrs           = selectedAnswer.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.question[newQuestionType].qSize.width,
                            height: layout.question[newQuestionType].qSize.height
                        });

                        attrs.text.text = wraptext;
                        selectedAnswer.model.set('attrs', attrs);
                        selectedAnswer.render().el;

                    }
                },
                answerValueUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (selectedQuestion && selectedAnswer)
                    {
                        // adjust value of selected answer
                        selectedAnswer.model.set({'answer_value': this.$(e.target).val()});
                        //selectedAnswer.render().el;
                    }
                },
                answerValue2Update: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (selectedQuestion && selectedAnswer)
                    {
                        // adjust value of selected answer
                        selectedAnswer.model.set({'answer_value2': this.$(e.target).val()});
                        //selectedAnswer.render().el;
                    }
                },
                changeValueDataTypeDropdown: function()
                {
                    //var newValueDataType = this.$('#valueDataType option:selected').text().toLowerCase();
                    //console.log(' q type ', newQuestionType);

                    if (selectedQuestion && selectedAnswer) {
                        selectedAnswer.model.set(
                            {
                                answer_value_datatype_id: this.$('#valueDataType option:selected').val()
                            }
                        );
                    }

                },
                changeAnswerDatapointDropdown: function()
                {
                    //newQuestionVariableType = this.$('#questionDataPoint option:selected').text().toLowerCase();
                    console.log(' datat point type ', this.$('#answerDataPoint option:selected').val());

                    answerModel.set(
                        {
                            answerDatapointID: parseInt(this.$('#answerDataPoint option:selected').val())
                        }
                    );

                    if (selectedAnswer)
                    {
                        selectedAnswer.model.set(
                            {
                                'ehr_datapoint_id': parseInt(this.$('#answerDataPoint option:selected').val())
                            }
                        )
                    }

                },
                addLogicOutPoint: function()
                {

                    // Let's add an out port to the parent of the selected answer.

                    if (selectedAnswer) {

                        var parentLogicWrapper = graph.getCell(selectedAnswer.model.get('parent'));

                        var newOutports = parentLogicWrapper.attributes.outPorts;
                        var ar = [];
                        for (lo in newOutports) {
                            ar[lo] = newOutports[lo];
                        }

                        ar.push("out " + (newOutports.length + 1));
                        parentLogicWrapper.set('outPorts', ar);

                    }

                }
            }
        );


        return answerControlsView;

});