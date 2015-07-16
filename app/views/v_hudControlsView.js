define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout'],

    function($, Backbone, joint, style, layout) {

        var that;
        var graph;
        var paper;

        var hudControlsView = Backbone.View.extend(
        {
            initialize: function () {

                that = this.model.get('that');
                graph = this.model.get('graph');
                paper = this.model.get('paper');

                this.template = _.template($('.hudControlPanel').html());
                this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                this.model.on('change', function () {
                    this.render()
                }, this);


            },
            events: {
                'mouseover #content-nodes li a': 'overHandler',
                'click #content-nodes li a': 'clickHandler',
                'mouseout #content-nodes li a': 'outHandler'
            },
            render: function () {

                return this;
            },
            overHandler: function (e)
            {

                console.log('mouse over a content node', e.currentTarget.dataset.element);

                this.model.set('contentElement', e.currentTarget.dataset.element);
                this.model.set('contentMouseOver', true);

                $('.formContentOptions').animate({'bottom': 175}, 100);

            },
            clickHandler: function(e)
            {

            },
            outHandler: function (e)
            {

                console.log('mouse out a content node');

                $('.formContentOptions').animate({'bottom': -500}, 100);

            }
        });


        return hudControlsView;

});