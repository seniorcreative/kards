define(
    ['backbone'],

    function(Backbone) {

        var logicModel = Backbone.Model.extend(
            {
                logicRuleTemplate: ''
            }
        );

        return logicModel;
});