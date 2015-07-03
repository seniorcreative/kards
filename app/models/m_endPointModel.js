define(
    ['backbone'],

    function(Backbone) {

        var endPointModel = Backbone.Model.extend(
            {
                endPointTitle: '',
                endPointTypeTemplate: '',
                endPointTypeID: '',
                endPointArray: []
            }
        );

        return endPointModel

});