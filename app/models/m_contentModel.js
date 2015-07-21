define(
    ['backbone'],

    function(Backbone) {

        var contentModel = Backbone.Model.extend(
            {
                contentText: '',
                contentNumber: 1,
                contentTypeTemplate: '',
                contentCategoriesTemplate: '',
                contentTypeID: '',
                contentCategoryID: '',
                contentArray: [],
                defaultText: 'Medical content placeholder'
            }
        );

        return contentModel

});