define(
    ['backbone'],

    function(Backbone) {

        var hudModel = Backbone.Model.extend(
            {
                contentElements: []
            }
        );

        return hudModel;
});