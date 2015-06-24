define(
    ['backbone'],


    function(Backbone) {

        var questionModel = Backbone.Model.extend(
            {
                questionValue: '',
                questionTypeTemplate: '', // Need to get this by loading JSON from PHP into handlebars
                questionVariableTypeTemplate: '',
                questionTypeID: '1',
                questionVariableTypeID: '3',
                questionDatapointID: '',
                choicesAccepted: 1
            }
        );

        return questionModel;

});