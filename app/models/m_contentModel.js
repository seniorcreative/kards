define(
    ['backbone'],

    function(Backbone) {

        var contentModel = Backbone.Model.extend(
            {
                contentText: '',
                contentTypeTemplate: '',
                contentCategoriesTemplate: '',
                contentTypeID: '',
                contentCategoryID: '',
                contentArray: [],
                defaultText: 'lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing.'
            }
        );

        return contentModel

});