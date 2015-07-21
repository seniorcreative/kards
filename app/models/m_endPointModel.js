define(
    ['backbone'],

    function(Backbone) {

        var endPointModel = Backbone.Model.extend(
            {
                endPointTitle: '',
                endPointNumber: '',
                endPointTypeTemplate: '',
                endPointTypeID: '',
                endPointArray: []
            }
        );

        return endPointModel

});