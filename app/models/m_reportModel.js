define(
    ['backbone'],


    function(Backbone) {

        var reportModel = Backbone.Model.extend(
            {
                reportTitle: 'New report *',
                reportCategoryID: '',
                mode: 'build'
            }
        );

        return reportModel;

});