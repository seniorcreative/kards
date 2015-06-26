define(
    ['backbone'],


    function(Backbone) {

        var questionModel = Backbone.Model.extend(
            {
                questionValue: '',
                questionTypeTemplate: '', // Need to get this by loading JSON from PHP into handlebars
                questionVariableTypeTemplate: '',
                questionTypeID: '',
                questionVariableTypeID: '',
                questionDatapointID: '',
                choicesAccepted: 1,
                questions: []
            }
        );

        return questionModel;

});