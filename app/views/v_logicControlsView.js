define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout',
        'modules/helpers'],

    function($, Backbone, joint, style, layout, helpers) {

        var scope;
        var graph;
        var paper;


        var layoutControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');
                    
                    helpers.init(that, paper, graph);

                    this.template = _.template($('#logic-modal').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var
                    this.$el.find('#logic-rules').html(this.model.get('logicRuleTemplate'));

                    this.model.on('change', function(){

                        this.render()

                    }, this);

                },
                events: {
                    //'click #btnQuestionAdd': 'addQuestion',
                    //'keyup #questionValue': 'questionUpdate',
                    //'change #questionType': 'changeQuestionTypeDropdown',

                    // rule for add rule...

                    // rule for add action...
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#logic-rules').html(this.model.get('logicRuleTemplate'));

                    return this;
                }
            }
        );

        return layoutControlsView;

});