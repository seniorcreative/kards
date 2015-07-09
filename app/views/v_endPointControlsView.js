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

        var endPointControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

                    this.template = _.template($('.formEndPointOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#endPointTypeTemplate').html(this.model.get('endPointTypeTemplate'));

                    this.model.on('change', function () {
                        this.render()
                    }, this);

                    //autocompleteSearch();

                },
                events: {
                    'click #btnAddEndPoint': 'addEndPoint',
                    'keyup #endPointTitle': 'endPointUpdate',
                    'change #endPointTypeID': 'changeEndPointTypeDropdown'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#endPointTitle').val(this.model.get('endPointTitle'));

                    if (this.model.get('endPointTypeID') != undefined) {
                        this.$el.find('#endPointTypeID').val(this.model.get('endPointTypeID'));
                    }


                    return this;
                },
                addEndPoint: function () {


                    var endPointNumber = this.model.endPointArray.length + 1;

                    var newEndPointText = ($('#endPointTitle').val() == '') ? 'New endpoint *' : $('#endPointTitle').val();
                    $('#endPointTitle').val(newEndPointText);

                    wraptext = joint.util.breakText(newEndPointText, {
                        width: layout.endpoint.size.width,
                        height: layout.endpoint.size.height
                    }) + '...';

                    var endPoint = new joint.shapes.devs.Model({
                        ktype: 'endpoint',
                        position: { x: parseInt(layout.stage.centerX - (layout.endpoint.size.width/2)), y: parseInt(layout.stage.centerY - (layout.endpoint.size.height/2)) },
                        size: { width: layout.endpoint.size.width, height: layout.endpoint.size.height },
                        attrs: {
                            '.label': { text: 'E ' + endPointNumber, 'ref-x': .1, 'ref-y': .1, 'font-size': style.text.fontSize.label },
                            rect: {
                                fill: style.node.fill.endPoint,
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
                        endPointFull: newEndPointText,
                        interactive: false,
                        cms_endpoint_type_id: parseInt(this.$('#endPointTypeID option:selected').val())
                    });

                    endPoint.set('inPorts', ['in']);
                    //endPointWrapper.set('outPorts', ['out']);


                    graph.addCells([endPoint]);

                    this.model.endPointArray.push({
                        id: endPointNumber,
                        element: endPoint.id
                    });

                    //endPointWrapper.embed(endPoint);

                    //window.selectedEndPoint = endPoint; // at this stage this is a model - we want it to be a 'view'
                    window.selectedEndPoint = paper.findViewByModel(endPoint); // now its the 'view'


                },
                endPointUpdate: function (e) {

                    // Set the initial text in the model so if we change anything else in the view panel this stays in the text field
                    this.model.set('endPointTitle', this.$(e.target).val());

                    if (window.selectedEndPoint != null) {
                        attrs = window.selectedEndPoint.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.endpoint.size.width,
                            height: layout.endpoint.size.height
                        }) + '...';

                        attrs.text.text = wraptext;

                        window.selectedEndPoint.model.set('attrs', attrs);
                        window.selectedEndPoint.model.set('endPointFull', this.$(e.target).val());
                        window.selectedEndPoint.render().el;
                    }

                },
                changeEndPointTypeDropdown: function () {

                    endPointModel.set(
                        {
                            endPointTypeID: parseInt(this.$('#endPointTypeID option:selected').val())
                        }
                    );

                    //console.log(window.selectedEndPoint, window.selectedEndPoint.model);

                    if (window.selectedEndPoint != null) {
                        window.selectedEndPoint.model.set(
                            {
                                'cms_endpoint_type_id': parseInt(this.$('#endPointTypeID option:selected').val())
                            }
                        )
                    }

                }
            });


        return endPointControlsView;

});