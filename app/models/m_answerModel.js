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
                logicVisible: false
            }
        );

        return answerModel;

});