define(
    ['backbone'],

    function(Backbone) {

        var sectionModel = Backbone.Model.extend(
            {
                sectionTitle: 'Section',
                sections: []
            }
        );

        return sectionModel;
});