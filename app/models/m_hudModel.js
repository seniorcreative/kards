define(
    ['backbone'],

    function(Backbone) {

        var hudModel = Backbone.Model.extend(
            {
                contentElements: [],
                hudStreamStartpoints: []
            }
        );

        return hudModel;
});