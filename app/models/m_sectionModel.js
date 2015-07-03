define(
    ['backbone'],

    function(Backbone) {

        var sectionModel = Backbone.Model.extend(
            {
                sectionTitle: 'New section *',
                sections: []
            }
        );

        return sectionModel;
});