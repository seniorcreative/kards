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

        var answerInputControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

                    helpers.init(that, paper, graph);

                    //console.log('answer controls view inited');

                    this.template = _.template($('.formAnswerInputOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.model.on('change', function(){

                        this.render()

                    }, this);

                },
                events: {
                    //'change #answerInput-date': 'answerUpdate',
                    //'keyup #answerInput-string': 'answerUpdate',
                    'change': 'answerUpdate',
                    'keyup': 'answerUpdate',
                    'click #btnAnswerInputConfirm': 'applyAnswer'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    //this.$el.find('#answerLabel').val(this.model.get('answerLabel'));

                    //console.log('something changed ', parseInt(this.model.answerInputValueDatatypeID));

                    $('.form-controls--toggle').addClass('hidden');

                    switch(parseInt(this.model.get('answerInputValueDatatypeID')))
                    {

                        case 5:

                            // date - ( date )

                            $('#answerInputControls-date').removeClass('hidden');

                        break;

                        case 3:

                            // number

                            $('#answerInputControls-number').removeClass('hidden');

                            break;

                        case 6:

                            // string (word or letter)

                            $('#answerInputControls-string').removeClass('hidden');

                            break;

                        default:
                        case 2:

                            // true or false / boolean  ( checkbox )

                            $('#answerInputControls-checkbox').removeClass('hidden');

                            break;

                    }

                    return this;
                },
                answerUpdate: function(e)
                {

                    //if (window.selectedQuestion != null && window.selectedAnswer != null)
                    //{

                        var answerInputValues = window.answerModel.answerInputValues;

                        var answerKey = window.selectedAnswer.model.get('answerKey');

                        var keyInput;

                        // When adding an answer in the input dialog, we should also set the input value in the object
                        // that we used to loop over previously clicked answers, when testing.
                        // see (A)

                        switch (parseInt(this.$(e.target).data('type'))) {

                            case 2:
                                // checkbox (default)

                                answerInputValues[answerKey] = [this.$(e.target).is(":checked")];

                                // convert to 1 or 0
                                var switchValue = (this.$(e.target).is(":checked")) ? 1 : 0;

                                window.selectedAnswer.model.set({'answer_value': switchValue});


                                // (A)

                                window.logicModel.questionChoices[window.selectedQuestion.model.get('questionNumber')] = switchValue;


                                break;



                            case 3:
                                // number

                                keyInput = parseInt(this.$(e.target).val());

                                answerInputValues[answerKey] = [keyInput];

                                window.selectedAnswer.model.set({'answer_value': keyInput});

                                // (A)

                                window.logicModel.questionChoices[window.selectedQuestion.model.get('questionNumber')] = keyInput;

                               break;

                            default:
                            case 5:
                                // date
                            case 16:
                                // time
                            case 6:
                                // string (word or letter)

                                keyInput = this.$(e.target).val();

                                answerInputValues[answerKey] = [keyInput];

                                window.selectedAnswer.model.set({'answer_value': keyInput});

                                // (A)

                                window.logicModel.questionChoices[window.selectedQuestion.model.get('questionNumber')] = keyInput;


                                break;


                        }

                        window.answerModel.set('answerInputValues', answerInputValues);

                        console.log('stored your input ', window.answerModel.answerInputValues, window.logicModel.questionChoices);

                    //}


                },
                applyAnswer: function(e)
                {

                    helpers.hideAnswerInput();

                }
            }
        );


        return answerInputControlsView;

});