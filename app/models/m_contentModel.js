define(
    ['backbone'],

    function(Backbone) {

        var contentModel = Backbone.Model.extend(
            {
                contentText: '',
                contentTypeTemplate: '',
                contentCategoriesTemplate: '',
                contentTypeID: '',
                contentCategoryID: ''
            }
        );

        return contentModel


});