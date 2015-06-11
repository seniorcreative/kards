// Controls

define(
    ['joint'],

function(joint) {


    var init = function(graph, paper) {

        //console.log('inited ', graph);

        var formView = Backbone.View.extend(
            {
                events: {
                    'click .clickable': 'handleClick'
                },
                render: function () {
                    this.$el.html('<form><input type="button" id="btnAdd" name="btnAdd" class="clickable" value="Add Question"></form>');
                    return this;
                },
                handleClick: function () {
                    console.log('clicked', graph);

                    var rect = new joint.shapes.basic.Rect({
                        position: { x: 150, y: 400 },
                        size: { width: 200, height: 100 },
                        attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)', rx: 4, ry: 4 }, text: { text: 'my box', fill: 'black' } }
                    });

                    //var link = new joint.dia.Link({
                    //    source: { id: rect.id },
                    //    target: { id: rect2.id }
                    //});

                    graph.addCells([
                        rect
                    ]);
                }
            }
        );

        var fv = new formView();
        $('body').prepend(fv.render().el);

    };

    return {
        init: init
    };


});