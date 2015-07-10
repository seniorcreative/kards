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
                    var newSectionTitle = $('#sectionTitle').val() == '' ? this.model.sectionTitle : $('#sectionTitle').val();
                    $('#sectionTitle').val(newSectionTitle);

                    helpers.resetElementStyles('section');

                    wraptext = joint.util.breakText(newSectionTitle, {
                        width: layout.section.size.width,
                        height: layout.section.size.height
                    });

                    var sectionNumber = this.model.sections.length + 1;

                    var section = new joint.shapes.devs.Model({
                        ktype: 'section',
                        position: { x: parseInt(layout.stage.centerX + layout.section.startX), y: parseInt(layout.section.startY) }, // layout.stage.centerX - (layout.section.size.width / 2), layout.stage.centerY - (layout.section.size.height / 2)
                        size: { width: layout.section.size.width, height: layout.section.size.height },
                        attrs: {
                            '.label': { text: 'S ' + sectionNumber, 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
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
                        sectionFull: newSectionTitle,
                        interactive: true,
                        reversedConnectionTargets: {},
                        connectionTargets: {}
                    });

                    section.set('inPorts', ['in']);
                    section.set('outPorts', ['out']);

                    graph.addCells([section]);

                    // Add question to questions model.

                    this.model.sections.push({
                        id: sectionNumber,
                        element: section.id
                    });

                    //console.log('try to add link from ',section.id,'to', window.selectedReport.model.get('id'));
                    if (sectionNumber == 1  && window.selectedReport != null) {

                        var link = new joint.shapes.devs.Link({
                            source: {
                                id: section.id,
                                port: 'in'
                            },
                            target: {
                                id: window.selectedReport.model.get('id'),
                                port: 'out'
                            }
                        });
                        // Assume graph has the srcModel and dstModel with in and out ports.
                        graph.addCell(link);

                    }

                    window.selectedSection = paper.findViewByModel(section); // Make so is the selected straight away.

                    $('.formQuestionOptions').css('opacity', 1);
                    //$('.formContentOptions').css('opacity', 1);

                    $('.formQuestionOptions').css('pointer-events', 'auto');
                    //$('.formContentOptions').css('pointer-events', 'auto');


                },
                sectionUpdate: function(e)
                {
                    // Set the initial text in the model so if we change anything else in the view panel this stays in the text field
                    this.model.set('sectionTitle', this.$(e.target).val());

                    if (window.selectedSection != null)
                    {

                        attrs = window.selectedSection.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.section.size.width,
                            height: layout.section.size.height
                        });

                        attrs.text.text = wraptext;
                        window.selectedSection.model.set('attrs', attrs);
                        window.selectedSection.model.set('sectionFull', this.$(e.target).val());
                        window.selectedSection.render().el;
                    }
                }
            }
        );

        return sectionControlsView;

});