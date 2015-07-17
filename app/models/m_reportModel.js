define(
    ['backbone'],


    function(Backbone) {

        var d = new Date();
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        var reportModel = Backbone.Model.extend(
            {
                reportTitle: 'Report ' + d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes(),
                reportCategoryID: '',
                mode: 'build'
            }
        );

        return reportModel;

});