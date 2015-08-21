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

                        this.render();



                    }, this);

                },
                events: {
                    'keyup #answerLabel': 'answerUpdate',
                    'keyup #answerValue': 'answerValueUpdate',
                    'change #answerValue': 'answerValueUpdate',
                    'click #answerValue': 'answerValueUpdate',
                    'keyup #answerValue2': 'answerValue2Update',
                    'change #answerValue2': 'answerValue2Update',
                    'click #answerValue2': 'answerValue2Update',
                    'click #btnClearAnswerValues': 'clearAnswerValues',
                    'click #btnDeleteAnswer': 'deleteHandler',
                    'change #valueDataType': 'changeValueDataTypeDropdown',
                    'change #answerDataPoint': 'changeAnswerDatapointDropdown'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#answerLabel').val(this.model.get('answerLabel'));

                    //console.log('this.model.get(answerValueDataTypeID)', this.model.get('answerValueDataTypeID'));

                    if ( this.model.get('answerValueDataTypeID') != undefined) {

                        switch (parseInt(this.model.get('answerValueDataTypeID'))) {

                            case 2:
                            // TRUE OR FALSE
                            case 15:
                                // none of the above

                                $('#answerValue').attr('type', 'checkbox');
                                $('#answerValue2').attr('type', 'checkbox');

                                break;

                            case 6:

                                // word or letter


                                $('#answerValue').attr('type', 'text');
                                $('#answerValue2').attr('type', 'text');

                                break;

                            case 3:
                                // NUMBER

                                $('#answerValue').attr('type', 'number');
                                $('#answerValue2').attr('type', 'number');

                                break;

                            case 5:
                            // Date
                            case 16:
                                // YEARS

                                $('#answerValue').attr('type', 'date');
                                $('#answerValue2').attr('type', 'date');

                                break;

                        }

                        // Do this differently depending on value type

                        switch (parseInt(this.model.get('answerValueDataTypeID'))) {

                            case 2:
                            // TRUE OR FALSE
                            case 15:
                                // none of the above

                                if (this.model.get('answerValue') == true) {
                                    this.$el.find('#answerValue').prop('checked', true);

                                    //console.log('setting answerValue to checked');
                                }
                                else {
                                    this.$el.find('#answerValue').prop('checked', false);

                                    //console.log('setting answerValue to unchecked');
                                }

                                if (this.model.get('answerValue2') == true) {
                                    this.$el.find('#answerValue2').prop('checked', true);

                                    //console.log('setting answerValue2 to checked');
                                }
                                else {
                                    this.$el.find('#answerValue2').prop('checked', false);

                                    //console.log('setting answerValue2 to unchecked');
                                }

                                break;

                            case 6:
                            // WORD OR LETTER
                            case 3:
                            // NUMBER
                            case 5:
                            // DATE
                            case 16:
                                // YEARS

                                this.$el.find('#answerValue').val(this.model.get('answerValue'));
                                this.$el.find('#answerValue2').val(this.model.get('answerValue2'));

                                break;

                        }


                    }

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
                    else
                    {
                        this.$el.find('#answerLogicRules').html("");
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
                            width: layout.question[layout.get('newQuestionTypeID')].aSize.width - 40,
                            height: layout.question[layout.get('newQuestionTypeID')].aSize.height - 2
                        }) + '...';

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

                        answerInputValues = window.answerModel.answerInputValues;


                        switch(parseInt(this.$('#valueDataType option:selected').val()))
                        {

                            case 2:
                                // TRUE OR FALSE
                            case 15:
                                // none of the above

                                    answerInputValues[window.selectedAnswer.model.get('answerKey')] = [this.$('#answerValue').is(':checked'), this.$('#answerValue2').is(':checked')];

                                    // adjust value of selected answer
                                    window.selectedAnswer.model.set({'answer_value': this.$(e.target).is(':checked')});

                                break;

                            case 3:
                                // NUMBER

                                // adjust value of selected answer
                                window.selectedAnswer.model.set({'answer_value': parseInt(this.$(e.target).val())});

                                answerInputValues[window.selectedAnswer.model.get('answerKey')] = [parseInt(this.$('#answerValue').val()), parseInt(this.$('#answerValue2').val())];

                                break;

                            case 6:
                                // WORD OR LETTER
                            case 5:
                                // DATE
                            case 16:
                                // YEARS

                                    // adjust value of selected answer
                                    window.selectedAnswer.model.set({'answer_value': this.$(e.target).val()});

                                    answerInputValues[window.selectedAnswer.model.get('answerKey')] = [this.$('#answerValue').val(), this.$('#answerValue2').val()];

                                break;

                        }

                        window.answerModel.set('answerInputValues', answerInputValues);

                        console.log('changed ', this.model.answerKey, this.model, window.answerModel.answerInputValues);

                        //window.selectedAnswer.render().el;
                    }
                },
                answerValue2Update: function(e)
                {
                    //console.log('answer value is changing', e, this.$(e.target).val());
                    if (window.selectedQuestion != null && window.selectedAnswer != null)
                    {




                        answerInputValues = window.answerModel.answerInputValues;


                        switch(parseInt(this.$('#valueDataType option:selected').val()))
                        {

                            case 2:
                            // TRUE OR FALSE
                            case 15:
                                // none of the above

                                answerInputValues[window.selectedAnswer.model.get('answerKey')] = [this.$('#answerValue').is(':checked'), this.$('#answerValue2').is(':checked')];

                                // adjust value of selected answer
                                window.selectedAnswer.model.set({'answer_value2': this.$(e.target).is(':checked')});

                                break;

                            case 3:
                            // NUMBER

                                // adjust value of selected answer
                                window.selectedAnswer.model.set({'answer_value2': parseInt(this.$(e.target).val())});

                                answerInputValues[window.selectedAnswer.model.get('answerKey')] = [parseInt(this.$('#answerValue').val()), parseInt(this.$('#answerValue2').val())];


                                break;

                            case 6:
                            // WORD OR LETTER
                            case 5:
                            // DATE
                            case 16:
                                // YEARS

                                // adjust value of selected answer
                                window.selectedAnswer.model.set({'answer_value2': this.$(e.target).val()});

                                answerInputValues[window.selectedAnswer.model.get('answerKey')] = [this.$('#answerValue').val(), this.$('#answerValue2').val()];

                                break;

                        }

                        window.answerModel.set('answerInputValues', answerInputValues);

                        //console.log('changed ', this.model.answerKey, this.model, window.answerModel.answerInputValues);



                        // adjust value of selected answer
                        //window.selectedAnswer.model.set({'answer_value2': this.$(e.target).val()});
                        //
                        //answerInputValues = window.answerModel.answerInputValues;
                        //answerInputValues[window.selectedAnswer.model.get('answerKey')] = [this.$('#answerValue').val(), this.$('#answerValue2').val()];
                        //window.answerModel.set('answerInputValue2s', answerInputValues);

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

                    }

                    switch(parseInt(this.$('#valueDataType option:selected').val()))
                    {

                        case 2:
                        // TRUE OR FALSE
                        case 15:
                            // none of the above

                            $('#answerValue').attr('type', 'checkbox');
                            $('#answerValue2').attr('type', 'checkbox');

                        break;

                        case 6:

                        // word or letter


                            $('#answerValue').attr('type', 'text');
                            $('#answerValue2').attr('type', 'text');

                        break;

                        case 3:
                            // NUMBER

                            $('#answerValue').attr('type', 'number');
                            $('#answerValue2').attr('type', 'number');

                        break;

                        case 5:
                            // Date
                        case 16:
                            // YEARS

                            $('#answerValue').attr('type', 'date');
                            $('#answerValue2').attr('type', 'date');

                        break;

                    }

                    //console.log('setting window.answerInputModel.answerInputValueDatatypeID to', this.$('#valueDataType option:selected').val(),  window.answerInputModel.get('answerInputValueDatatypeID'),  window.answerInputModel.answerInputValueDatatypeID );

                    // also pass to the answer input in case we need to show that.
                    window.answerInputModel.set('answerInputValueDatatypeID', this.$('#valueDataType option:selected').val());


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

                },
                clearAnswerValues: function()
                {


                    switch (parseInt(this.model.get('answerValueDataTypeID'))) {

                        case 2:
                        // TRUE OR FALSE
                        case 15:
                            // none of the above

                            this.$el.find('#answerValue').prop('checked', false);
                            this.$el.find('#answerValue2').prop('checked', false);

                            this.model.set('answerValue', false);
                            this.model.set('answerValue2', false);

                            window.selectedAnswer.model.set('answer_value', false);
                            window.selectedAnswer.model.set('answer_value2', false);

                            break;

                        default:
                        case 6:
                        // WORD OR LETTER
                        case 3:
                        // NUMBER

                            this.$el.find('#answerValue').val('');
                            this.$el.find('#answerValue2').val('');

                            this.model.set('answerValue', '');
                            this.model.set('answerValue2', '');

                            window.selectedAnswer.model.set('answer_value', '');
                            window.selectedAnswer.model.set('answer_value2', '');



                        case 5:
                        // DATE
                        case 16:
                            // YEARS


                            this.$el.find('#answerValue').val('dd/mm/yyyy');
                            this.$el.find('#answerValue2').val('dd/mm/yyyy');

                            this.model.set('answerValue', 'dd/mm/yyyy');
                            this.model.set('answerValue2', 'dd/mm/yyyy');

                            window.selectedAnswer.model.set('answer_value', '');
                            window.selectedAnswer.model.set('answer_value2', '');

                            break;

                    }

                    window.answerModel.answerInputValues[window.selectedAnswer.model.get('answerKey')] = ['', ''];

                    $('.formAnswerInputOptions')[0].reset();


                },
                deleteHandler: function()
                {

                    if (window.selectedQuestion != null)
                    {

                        // Want to get the parent and the children of the question...

                        var answerCell = graph.getCell(window.selectedAnswer.model.get('id'));

                        var tmpObj;

                        for (var a in window.questionModel.answerValues)
                        {

                            console.log('deleting answer', a, window.questionModel.answerValues[a]);

                            //if (a != window.selectedQuestion.model.get('questionNumber'))
                            //{

                                tmpObj = {};

                                for (var aa in window.questionModel.answerValues[a])
                                {

                                    console.log('deleting answer', aa, window.questionModel.answerValues[a][aa]);

                                    if (aa != window.selectedAnswer.model.get('answerNumber'))
                                    {

                                        tmpObj[aa] = window.questionModel.answerValues[a][aa];

                                    }

                                }

                                window.questionModel.answerValues[a] = tmpObj;

                            //}
                        }

                        answerCell.remove(); // Yeay remove also remove embeds.

                        // Now let's loop the deleted links

                        // Loop question keys in answerValues
                        for (var q in window.questionModel.answerValues)
                        {

                            // Loop answers of each question
                            for (var a in window.questionModel.answerValues[q])
                            {

                                var element = window.questionModel.answerValues[q][a].element;
                                var reversedConnectionTargets = graph.getCell(graph.getCell(element).get('parent')).get('reversedConnectionTargets');

                                // Loop outports for those answers

                                for(var outport in reversedConnectionTargets)
                                {

                                    var tmpArray = [];

                                    // Loop array of reversed connections, build a tmp array without those we're deleting and pop it back in.
                                    for(var c in reversedConnectionTargets[outport])
                                    {

                                        if (window.deletedLinks.indexOf(reversedConnectionTargets[outport][c]) == -1)
                                        {
                                            tmpArray.push(reversedConnectionTargets[outport][c]);
                                        }

                                    }

                                    // set the tmp array back into the connection targets for this element
                                    reversedConnectionTargets[outport] = tmpArray;

                                }

                                graph.getCell(graph.getCell(element).get('parent')).set('reversedConnectionTargets', reversedConnectionTargets);

                            }

                        }

                        window.deletedLinks = [];


                        // Now reset interface

                        helpers.clearSelections();

                    }

                }
            }
        );

        //$('#logic-modal').modal();

        return answerControlsView;

});