define(
    ['backbone'],

    function(Backbone) {

        var answerInputModel = Backbone.Model.extend(
            {
                answerInputValue: undefined,
                answerInputValueDatatypeID: 2 // date (id 5) or checkbox (id 2)
            }
        );

        return answerInputModel;

});