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

        var contentControlsView = Backbone.View.extend(
            {
                initialize: function () {

                    that = this.model.get('that');
                    graph = this.model.get('graph');
                    paper = this.model.get('paper');

                    this.template = _.template($('.formContentOptions').html());
                    this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#cmsContentTypeTemplate').html(this.model.get('contentTypeTemplate'));
                    this.$el.find('#cmsContentCategoryTemplate').html(this.model.get('contentCategoryTemplate'));

                    this.model.on('change', function () {
                        this.render()
                    }, this);

                    //autocompleteSearch();

                },
                events: {
                    'click #btnAddContent': 'addContent',
                    'keyup #contentText': 'contentUpdate',
                    'change #cmsContentTypeID': 'changeContentTypeDropdown',
                    'change #cmsContentCategoryID': 'changeContentCategoryDropdown'
                },
                render: function () {
                    //this.$el.html(this.template()); // this.$el is a jQuery wrapped el var

                    this.$el.find('#contentText').val(this.model.get('contentText'));

                    if (this.model.get('contentTypeID') != undefined) {
                        this.$el.find('#cmsContentTypeID').val(this.model.get('contentTypeID'));
                    }

                    if (this.model.get('contentCategoryID') != undefined) {
                        this.$el.find('#cmsContentCategoryID').val(this.model.get('contentCategoryID'));
                    }

                    return this;
                },
                addContent: function () {


                    var contentWrapper = new joint.shapes.devs.Model({
                        ktype: 'logicwrapper',
                        position: {
                            x: layout.stage.centerX - (layout.content.wrapperSize.width / 2),
                            y: layout.stage.centerY - (layout.content.wrapperSize.height / 2)
                        },
                        size: {width: layout.content.wrapperSize.width, height: layout.content.wrapperSize.height},
                        attrs: {
                            '.label': {
                                text: 'CONTENT',
                                'ref-x': .1,
                                'ref-y': .1,
                                'font-size': style.text.fontSize.label
                            },
                            rect: {
                                fill: style.node.fill.wrapper,
                                'fill-opacity': style.node.fillOpacity.wrapper,
                                'stroke-width': style.node.strokeWidth.wrapper,
                                stroke: style.node.stroke.wrapper,
                                rx: 2,
                                ry: 4
                            },
                            '.inPorts circle': {fill: style.port.in.fill.normal},
                            '.outPorts circle': {fill: style.port.out.fill.normal}
                        }
                    });

                    contentWrapper.set('inPorts', ['in']);
                    contentWrapper.set('outPorts', ['out']);

                    var newContentText = $('#contentText').val() == '' ? 'lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing. lorem ipsum dolor sit amet nonummy nunquam necessit dolor ad pisicing.' : $('#contentText').val();
                    $('#contentText').val(newContentText);

                    wraptext = joint.util.breakText(newContentText, {
                        width: layout.content.bodySize.width,
                        height: layout.content.bodySize.height
                    }) + '...';

                    var content = new joint.shapes.html.Element({
                        ktype: 'content',
                        position: {
                            x: layout.stage.centerX - (layout.content.bodySize.width / 2),
                            y: layout.stage.centerY - (layout.content.bodySize.height / 2)
                        },
                        size: {width: layout.content.bodySize.width, height: layout.content.bodySize.height},
                        attrs: {
                            rect: {
                                fill: style.node.fill.normal,
                                'fill-opacity': style.node.fillOpacity.normal,
                                'stroke-width': style.node.strokeWidth.normal,
                                stroke: style.node.stroke.normal,
                                'stroke-dasharray': style.node.strokeDashArray.selected,
                                style: {'pointer-events': ''}
                            },
                            text: {
                                text: wraptext, fill: style.text.fill.normal
                            }
                        },
                        contentFull: newContentText,
                        interactive: false,
                        cms_content_type_id: parseInt(this.$('#cmsContentTypeID option:selected').val()),
                        cms_content_category_id: parseInt(this.$('#cmsContentCategoryID option:selected').val())
                    });

                    graph.addCells([contentWrapper, content]);

                    contentWrapper.embed(content);

                    window.selectedContent = content;

                },
                contentUpdate: function (e) {

                    if (window.selectedContent != null) {
                        attrs = window.selectedContent.model.get('attrs');

                        wraptext = joint.util.breakText(this.$(e.target).val(), {
                            width: layout.content.bodySize.width,
                            height: layout.content.bodySize.height
                        }) + '...';

                        attrs.text.text = wraptext;

                        window.selectedContent.model.set('attrs', attrs);
                        window.selectedContent.model.set('contentFull', this.$(e.target).val());
                        window.selectedContent.render().el;
                    }

                },
                changeContentTypeDropdown: function () {

                    contentModel.set(
                        {
                            contentTypeID: parseInt(this.$('#cmsContentTypeID option:selected').val())
                        }
                    );

                    if (window.selectedContent != null) {
                        window.selectedContent.model.set(
                            {
                                'cms_content_type_id': parseInt(this.$('#cmsContentTypeID option:selected').val())
                            }
                        )
                    }

                },
                changeContentCategoryDropdown: function () {

                    contentModel.set(
                        {
                            contentCategoryID: parseInt(this.$('#cmsContentCategoryID option:selected').val())
                        }
                    );

                    if (window.selectedContent != null) {
                        window.selectedContent.model.set(
                            {
                                'cms_content_category_id': parseInt(this.$('#cmsContentCategoryID option:selected').val())
                            }
                        )
                    }

                }
            });


        return contentControlsView;

});