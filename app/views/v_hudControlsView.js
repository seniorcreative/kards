define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout',
        'modules/helpers',
        'modules/contentStream'],

    function($, Backbone, joint, style, layout, helpers, contentStream) {

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
                'click #content-nodes li a': 'contentNodeClickHandler',
                'click #btnResetContentStream': 'resetHandler',
                'click #btnResetClearAnswers': 'resetClearAnswers',
                'click #btnShowIndividualisation': 'showIndividualisationHandler',
                'mouseout #content-nodes li a': 'outHandler'
            },
            render: function () {

                return this;
            },
            overHandler: function (e)
            {

                //console.log('mouse over a content node', e.currentTarget.dataset.element);

                this.model.set('contentElement', e.currentTarget.dataset.element);
                this.model.set('contentMouseOver', true);

                $('.formContentOptions').animate({'bottom': 175}, 100);

            },
            contentNodeClickHandler: function(e)
            {

                $(e.currentTarget).addClass('selected');

            },
            resetHandler: function(e)
            {

                //

                $('#content-nodes').html('');
                window.hudModel.contentElements = [];
                contentStream.reset();
                helpers.deselectElementStylesForTest();
                window.logicModel.questionChoices = {};

            },
            resetClearAnswers: function(e)
            {

                //

                for (var iv in window.answerModel.answerInputValues) {
                    window.answerModel.answerInputValues[iv] = ['', ''];
                }

                $('#content-nodes').html('');
                window.hudModel.contentElements = [];
                contentStream.reset();
                helpers.deselectElementStylesForTest();
                window.logicModel.questionChoices = {};

            },
            showIndividualisationHandler: function(e)
            {

                //
                $('#individualisation-output').html(contentStream.getIndividualisation());
                $('#individualisation-modal').show();

            },
            outHandler: function (e)
            {

                //console.log('mouse out a content node');

                if (!$(e.currentTarget).hasClass('selected')) {

                    $('.formContentOptions').animate({'bottom': -500}, 100);

                }

            }
        });


        return hudControlsView;

});