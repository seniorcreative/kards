define(
    ['backbone'],

    function(Backbone) {

        var logicModel = Backbone.Model.extend(
            {
                logicRuleTemplate: '',
                questionLogic: []
            }
        );

        return logicModel;
});