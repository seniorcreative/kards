define(
    ['backbone'],

    function(Backbone) {

        var answerModel = Backbone.Model.extend(
            {
                answerLabel: '',
                answerValue: '',
                answerValue2: '',
                valueDataTypeTemplate: '',
                answerValueDataTypeID: 1,
                answerDatapointID: '',
                answerParentQuestion: '',
                answerInputValues: {},
                answerInputValue2s: {},
                logicVisible: false
            }
        );

        return answerModel;

});