define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout',
        'modules/helpers'],

    function($, Backbone, joint, style, layout, helpers) {

        var that;
        var graph;
        var paper;

        var wraptext;

        var sectionControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

                    helpers.init(that, paper, graph);

                    this.template = _.template($('.formSectionOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.model.on('change', function(){
                        this.render()
                    }, this);

                },
                events: {
                    'click #btnAddSection': 'addSection',
                    'keyup #sectionTitle': 'sectionUpdate'
                    //'change #reportCategory': 'reportCategoryUpdate'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#sectionTitle').val(this.model.get('sectionTitle'));

                    return this;
                },
                addSection: function()
                {
                    var newSectionTitle = $('#sectionTitle').val() == '' ? 'New section *' : $('#sectionTitle').val();
                    $('#sectionTitle').val(newSectionTitle);

                    helpers.resetElementStyles('section');

                    wraptext = joint.util.breakText(newSectionTitle, {
                        width: layout.section.size.width,
                        height: layout.section.size.height
                    });

                    var section = new joint.shapes.devs.Model({
                        ktype: 'section',
                        position: { x: layout.stage.centerX - (layout.section.size.width / 2), y: layout.stage.centerY - (layout.section.size.height / 2) },
                        size: { width: layout.section.size.width, height: layout.section.size.height },
                        attrs: {
                            '.label': { text: 'S', 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                            rect: {
                                fill: style.node.fill.normal,
                                'fill-opacity': style.node.fillOpacity.normal,
                                'stroke-width': style.node.strokeWidth.normal,
                                stroke: style.node.stroke.normal,
                                'stroke-dasharray':style.node.strokeDashArray.selected,
                                style:{'pointer-events':''}
                            },
                            text: {
                                text: wraptext, fill: style.text.fill.normal
                            },
                            '.inPorts circle': { fill: style.port.in.fill.normal },
                            '.outPorts circle': { fill: style.port.out.fill.normal }
                        },
                        //report_category_id: this.$('#reportCategory option:selected').val(),
                        interactive: true
                    });

                    section.set('inPorts', ['in']);
                    section.set('outPorts', ['out']);

                    graph.addCells([section]);

                    window.selectedSection = paper.findViewByModel(section); // Make so is the selected straight away.

                    $('.formQuestionOptions').css('opacity', 1);
                    $('.formContentOptions').css('opacity', 1);

                },
                sectionUpdate: function(e)
                {
                    if (window.selectedSection != null)
                    {
                        attrs = window.selectedSection.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.section.size.width,
                            height: layout.section.size.height
                        });

                        attrs.text.text = wraptext;
                        window.selectedSection.model.set('attrs', attrs);
                        window.selectedSection.render().el;
                    }
                }
            }
        );

        return sectionControlsView;

});