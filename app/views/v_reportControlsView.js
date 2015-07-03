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

        var wraptext;

        var reportControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

                    //console.log(s, graph, paper);

                    this.template = _.template($('.formReportOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.model.on('change', function () {
                        this.render()
                    }, this);

                },
                events: {
                    'click #btnAddReport': 'addReport',
                    'keyup #reportTitle': 'reportUpdate',
                    'change #reportCategory': 'reportCategoryUpdate'
                },
                render: function () {


                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#reportTitle').val(this.model.get('reportTitle'));

                    if (this.model.get('reportCategoryID') != undefined) {
                        //console.log('supposed to be setting your answer value data type id value to ', this.model.get('answerValueDataTypeID'));
                        this.$el.find('#reportCategory').val(this.model.get('reportCategoryID'));
                    }

                    return this;
                },
                addReport: function () {

                    var newReportTitle = $('#reportTitle').val() == '' ? 'New report *' : $('#reportTitle').val();
                    $('#reportTitle').val(newReportTitle);

                    var wraptext = joint.util.breakText(newReportTitle, {
                        width: layout.report.size.width,
                        height: layout.report.size.height
                    });

                    var report = new joint.shapes.devs.Model({
                        ktype: 'report',
                        position: {x: parseInt(layout.stage.centerX - (layout.report.size.width / 2) + layout.report.startX), y: parseInt(layout.report.startY)},
                        size: {width: layout.report.size.width, height: layout.report.size.height},
                        attrs: {
                            '.label': {text: 'R', 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label},
                            rect: {
                                fill: style.node.fill.normal,
                                'fill-opacity': style.node.fillOpacity.normal,
                                'stroke-width': style.node.strokeWidth.normal,
                                stroke: style.node.stroke.normal,
                                'stroke-opacity': style.node.strokeOpacity.normal,
                                'stroke-dasharray': style.node.strokeDashArray.selected,
                                style: {'pointer-events': ''}
                            },
                            text: {
                                text: wraptext, fill: style.text.fill.normal
                            },
                            '.inPorts circle': {
                                fill: style.port.in.fill.hidden,
                                stroke: style.port.in.stroke.hidden,
                                style: {'pointer-events': 'none'}
                            },
                            '.outPorts circle': {
                                fill: style.port.out.fill.normal
                            }
                        },
                        report_category_id: this.$('#reportCategory option:selected').val(),
                        interactive: true
                    });

                    report.set('inPorts', ['']);
                    report.set('outPorts', ['out']);

                    graph.addCells([report]);

                    // Disable the add button.
                    this.$('#btnAddReport').attr('disabled', 'disabled');
                    this.$('#btnAddReport').slideUp('slow');

                    window.selectedReport = paper.findViewByModel(report); // Assign the selected report after it is first added.

                    $('.formSectionOptions').css('opacity', 1);
                    $('.formSectionOptions').css('pointer-events', 'auto');

                },
                reportUpdate: function (e) {
                    if (window.selectedReport != null) {
                        attrs = window.selectedReport.model.get('attrs');

                        var wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.report.size.width,
                            height: layout.report.size.height
                        });

                        attrs.text.text = wraptext;
                        window.selectedReport.model.set('attrs', attrs);
                        window.selectedReport.render().el;
                    }
                },
                reportCategoryUpdate: function () {
                    if (window.selectedReport) {
                        window.selectedReport.model.set(
                            {
                                report_category_id: this.$('#reportCategory option:selected').val()
                            }
                        );
                    }
                }
            }
        );

        return reportControlsView;

});