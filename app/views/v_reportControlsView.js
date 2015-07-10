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
                    'click #btnSaveReport': 'saveReport',
                    'keyup #reportTitle': 'reportUpdate',
                    'change #reportCategory': 'reportCategoryUpdate',
                    'change #reportJSON': 'loadChartFromJSON'
                },
                render: function () {


                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#reportTitle').val(this.model.reportTitle);
                    $('#reportName').text(this.model.reportTitle);

                    if (this.model.get('reportCategoryID') != undefined) {
                        //console.log('supposed to be setting your answer value data type id value to ', this.model.get('answerValueDataTypeID'));
                        this.$el.find('#reportCategory').val(this.model.get('reportCategoryID'));
                    }

                    return this;
                },
                addReport: function () {

                    var newReportTitle = $('#reportTitle').val() == '' ? this.model.reportTitle : $('#reportTitle').val();
                    $('#reportTitle').val(newReportTitle);
                    $('#reportName').text(newReportTitle);

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
                        reportFull: newReportTitle,
                        report_category_id: this.$('#reportCategory option:selected').val(),
                        interactive: true,
                        reversedConnectionTargets: {},
                        connectionTargets: {}
                    });

                    report.set('inPorts', ['']);
                    report.set('outPorts', ['out']);

                    graph.addCells([report]);

                    // Disable the add button.
                    this.$('#btnAddReport').attr('disabled', 'disabled');
                    this.$('#btnAddReport').addClass('hidden');

                    window.selectedReport = paper.findViewByModel(report); // Assign the selected report after it is first added.

                    $('.formSectionOptions').css('opacity', 1);
                    $('.formSectionOptions').css('pointer-events', 'auto');

                    $('#btnSaveReport').removeClass('hidden');

                },
                reportUpdate: function (e) {

                    // Set the initial text in the model so if we change anything else in the view panel this stays in the text field
                    this.model.reportTitle = this.$(e.target).val();

                    $('#reportName').text(this.$(e.target).val());

                    if (window.selectedReport != null) {

                        attrs = window.selectedReport.model.get('attrs');

                        var wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.report.size.width,
                            height: layout.report.size.height
                        });

                        attrs.text.text = wraptext;
                        window.selectedReport.model.set('attrs', attrs);
                        window.selectedReport.model.set('reportFull', this.$(e.target).val());
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
                },
                loadChartFromJSON: function(e)
                {

                    //console.log('changed report', $(e.target).val());

                     if ($(e.target).val() != '')
                     {

                         //console.log('gonna load', "data/" + $(e.target).val());

                         //wherever you need to do the ajax
                         Backbone.ajax({
                             dataType: "json",
                             url: "data/" + $(e.target).val(),
                             data: "",
                             success: function (data) {

                                 //console.log('loaded chart', data);

                                 // At this point here we want to set up our app (selected items)
                                 // and models (questions, answers, logic rules etc(

                                graph.fromJSON(data.chartLayout);

                                 if (data.selectedReport != undefined) window.selectedReport = paper.findViewByModel(data.selectedReport.id);
                                 if (data.selectedSection != undefined) window.selectedSection = paper.findViewByModel(data.selectedSection.id);
                                 if (data.selectedQuestion != undefined) window.selectedQuestion = paper.findViewByModel(data.selectedQuestion.id);
                                 if (data.selectedAnswer != undefined) window.selectedAnswer = paper.findViewByModel(data.selectedAnswer.id);
                                 if (data.selectedContent != undefined) window.selectedContent = paper.findViewByModel(data.selectedContent.id);
                                 if (data.selectedEndPoint != undefined) window.selectedEndPoint = paper.findViewByModel(data.selectedEndPoint.id);

                                 if (data.questions) window.questionModel.questions      = data.questions;
                                 if (data.answers)window.questionModel.answerValues   = data.answers;
                                 if (data.logic) window.logicModel.questionLogic     = data.logic;

                                 paper.scale(data.paper.scaleX, data.paper.scaleY); // set scale from saved settings
                                 paper.setOrigin(data.paper.originX, data.paper.originY);
                                 paper.setDimensions(data.paper.width, data.paper.height);
                                 paper.options.gridSize = data.paper.gridSize;

                                 $('#reportName').text(data.reportTitle);
                                 $('#reportTitle').val(data.reportTitle);
                                 window.reportModel.reportTitle = data.reportTitle;

                                 $('#btnAddReport').attr('disabled', 'disabled');
                                 $('#btnAddReport').addClass('hidden');

                                 //$('.formSectionOptions').css('opacity', 1);
                                 //$('.formSectionOptions').css('pointer-events', 'auto');

                                 $('#btnSaveReport').removeClass('hidden');

                             }
                         });

                     }

                },
                saveReport: function()
                {


                    var jsonSaveObject = "{";

                        if (window.selectedReport != null) jsonSaveObject += "\"reportTitle\": \""+ this.model.reportTitle +"\", \"selectedReport\": " + JSON.stringify(window.selectedReport.model) + ",";
                        if (window.selectedSection != null)         jsonSaveObject += "\"selectedSection\": " + JSON.stringify(window.selectedSection.model) + ",";
                        if (window.selectedQuestion != null)        jsonSaveObject += "\"selectedQuestion\": " + JSON.stringify(window.selectedQuestion.model) + ",";
                        if (window.selectedAnswer != null)          jsonSaveObject += "\"selectedAnswer\": " + JSON.stringify(window.selectedAnswer.model) + ",";
                        if (window.selectedContent != null)         jsonSaveObject += "\"selectedContent\": " + JSON.stringify(window.selectedContent.model) + ",";
                        if (window.selectedEndPoint != null)        jsonSaveObject += "\"selectedEndPoint\": " + JSON.stringify(window.selectedEndPoint.model) + ",";

                        jsonSaveObject += "\"questions\": " + JSON.stringify(window.questionModel.questions) + ",";
                        jsonSaveObject += "\"answers\": " + JSON.stringify(window.questionModel.answerValues) + ",";
                        jsonSaveObject += "\"logic\": " + JSON.stringify(window.logicModel.questionLogic) + ",";

                        jsonSaveObject += "\"paper\": { \"scaleX\": "+ $('#sx').val() +",\"scaleY\": "+ $('#sy').val() +",";
                        jsonSaveObject += "\"originX\": "+ $('#ox').val() +",\"originY\": "+ $('#oy').val() +",";
                        jsonSaveObject += "\"width\": "+ $('#width').val() +",\"height\": "+ $('#height').val() +",";
                        jsonSaveObject += "\"gridSize\": "+ $('#grid').val() + "},";

                        jsonSaveObject += "\"chartLayout\": " + JSON.stringify(graph.toJSON()) + " ";

                    jsonSaveObject += "}";


                    //wherever you need to do the ajax
                    $.ajax({
                        type: "POST",
                        url: "data/savechart.php",
                        data: "reportTitle=" + this.model.reportTitle + "&chartData=" + encodeURIComponent(jsonSaveObject), // make sure to encode those ampersands and other special chars. no need to decode when loading back in...
                        datatype:"json",
                        success: function (data) {

                            var parsedData = $.parseJSON(data);

                            // Now need to loop and update the reportJSON select

                            $('#reportJSON').html(parsedData.options);

                        }

                    });



                }
            }
        );

        return reportControlsView;

});