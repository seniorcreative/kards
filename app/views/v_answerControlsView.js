define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout',
        'modules/helpers'],

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

                    return this;
                },
                answerUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val(), this.model.get('selectedQuestion'));
                    //console.log('selectd question', this.model.get('selectedQuestion'));
                    //console.log('selectd answer', this.model.get('selectedAnswer'));

                    if (this.model.get('selectedQuestion') != null && this.model.get('selectedAnswer') != null)
                    {
                        // adjust text of clicked element
                        attrs           = this.model.get('selectedAnswer').model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.question[layout.get('newQuestionType')].qSize.width,
                            height: layout.question[layout.get('newQuestionType')].qSize.height
                        });

                        attrs.text.text = wraptext;
                        this.model.get('selectedAnswer').model.set('attrs', attrs);
                        this.model.get('selectedAnswer').render().el;

                    }
                },
                answerValueUpdate: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (this.model.get('selectedQuestion') != null && this.model.get('selectedAnswer') != null)
                    {
                        // adjust value of selected answer
                        this.model.get('selectedAnswer').model.set({'answer_value': this.$(e.target).val()});
                        //this.model.get('selectedAnswer').render().el;
                    }
                },
                answerValue2Update: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (this.model.get('selectedQuestion') != null && this.model.get('selectedAnswer') != null)
                    {
                        // adjust value of selected answer
                        this.model.get('selectedAnswer').model.set({'answer_value2': this.$(e.target).val()});
                        //this.model.get('selectedAnswer').render().el;
                    }
                },
                changeValueDataTypeDropdown: function()
                {
                    //var newValueDataType = this.$('#valueDataType option:selected').text().toLowerCase();
                    //console.log(' q type ', newQuestionType);

                    if (this.model.get('selectedQuestion') != null && this.model.get('selectedAnswer') != null) {
                        this.model.get('selectedAnswer').model.set(
                            {
                                answer_value_datatype_id: this.$('#valueDataType option:selected').val()
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

                    if (this.model.get('selectedAnswer'))
                    {
                        this.model.get('selectedAnswer').model.set(
                            {
                                'ehr_datapoint_id': parseInt(this.$('#answerDataPoint option:selected').val())
                            }
                        )
                    }

                },
                addLogicOutPoint: function()
                {

                    // Let's add an out port to the parent of the selected answer.

                    if (this.model.get('selectedAnswer') != null) {

                        var parentLogicWrapper = graph.getCell(this.model.get('selectedAnswer').model.get('parent'));

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