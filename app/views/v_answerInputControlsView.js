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

                        case 6:

                            // date - ( date )

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

                        //console.log('selected answer answer key', answerKey);

                        //answerInputValues[answerKey] = '';

                        //console.log('checking for answer value change of ', parseInt(this.$(e.target).data('type')));

                        switch (parseInt(this.$(e.target).data('type'))) {

                            case 5:
                                // date
                            case 16:
                                // time

                                answerInputValues[answerKey] = this.$(e.target).val();

                                window.selectedAnswer.model.set({'answer_value': this.$(e.target).val()});

                                // date

                                break;

                            case 3:
                                // number
                            case 6:
                                // string (word or letter)

                                answerInputValues[answerKey] = this.$(e.target).val();

                                window.selectedAnswer.model.set({'answer_value': this.$(e.target).val()});

                                break;

                            default:
                            case 2:
                                // checkbox (default)

                                answerInputValues[answerKey] = this.$(e.target).is(":checked");

                                // convert to 1 or 0
                                var switchValue = (this.$(e.target).is(":checked")) ? 1 : 0;

                                window.selectedAnswer.model.set({'answer_value': switchValue});


                                break;

                        }

                        window.answerModel.set('answerInputValues', answerInputValues);

                        console.log('stored your input ', window.answerModel.get('answerInputValues'), window.answerModel.answerInputValues);

                    //}


                },
                applyAnswer: function(e)
                {




                }
            }
        );


        return answerInputControlsView;

});