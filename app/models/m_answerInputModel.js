define(
    ['backbone'],

    function(Backbone) {

        var answerInputModel = Backbone.Model.extend(
            {
                answerInputValue: '',
                answerInputValueDatatypeID: '' // date (id 5) or checkbox (id 2)
            }
        );

        return answerInputModel;

});