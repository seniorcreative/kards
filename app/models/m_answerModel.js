define(
    ['backbone'],

    function(Backbone) {

        var answerModel = Backbone.Model.extend(
            {
                answerLabel: '',
                answerValue: '',
                valueDataTypeTemplate: '',
                answerValueDataTypeID: 1,
                answerDatapointID: '',
                answerParentQuestion: '',
                logicVisible: false
            }
        );

        return answerModel;

});