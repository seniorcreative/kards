define(
    ['backbone'],

    function(Backbone) {

        var sectionModel = Backbone.Model.extend(
            {
                sectionTitle: 'Section 1',
                sections: []
            }
        );

        return sectionModel;
});