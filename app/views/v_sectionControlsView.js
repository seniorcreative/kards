define(
    ['jquery',
        'backbone',
        'joint',
        'modules/style',
        'modules/layout'],

    function($, Backbone, joint, style, layout) {

        var scope;
        var graph;
        var paper;

        var sectionControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    scope = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

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

                    resetElementStyles('section');

                    wraptext = joint.util.breakText(newSectionTitle, {
                        width: layout.section.size.width,
                        height: layout.section.size.height
                    });

                    var section = new joint.shapes.devs.Model({
                        ktype: 'section',
                        position: { x: stageCenterX - (layout.section.size.width / 2), y: stageCenterY - (layout.section.size.height / 2) },
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

                    selectedSection = paper.findViewByModel(section); // Make so is the selected straight away.
                },
                sectionUpdate: function(e)
                {
                    if (selectedSection)
                    {
                        attrs = selectedSection.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.section.size.width,
                            height: layout.section.size.height
                        });

                        attrs.text.text = wraptext;
                        selectedSection.model.set('attrs', attrs);
                        selectedSection.render().el;
                    }
                }
            }
        );

        return sectionControlsView;

});