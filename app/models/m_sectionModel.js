define(
    ['backbone'],

    function(Backbone) {

        var sectionModel = Backbone.Model.extend(
            {
                sectionTitle: 'New section *'
            }
        );

        return sectionModel;
});