// Controls

define(
    ['joint'],

function(joint) {


    var init = function(graph, paper) {

        //console.log('inited ', graph);

        var formView = Backbone.View.extend(
            {
                events: {
                    'click .addQuestion': 'addQuestion',
                    'click .logGraph': 'saveGraph'
                },
                render: function () {
                    this.$el.html('<form>' +
                    '<input type="button" id="btnAdd" name="btnAdd" class="addQuestion" value="Add Question">' +
                    '<input type="button" id="btnLog" name="btnLog" class="logGraph" value="Log Graph">' +
                    '</form>');
                    return this;
                },
                addQuestion: function () {
                    console.log('clicked', graph);

                    var rect = new joint.shapes.basic.Rect({
                        position: { x: 1000 * Math.random(), y: 800 * Math.random() },
                        size: { width: 50 + (200 * Math.random()), height: 25 + (100 * Math.random())  },
                        attrs: { rect: { fill: 'white', 'stroke-width': 2, stroke: 'rgb(0,0,0)', rx: 4, ry: 4 }, text: { text: 'my box', fill: 'black' } }
                    });

                    //var link = new joint.dia.Link({
                    //    source: { id: rect.id },
                    //    target: { id: rect2.id }
                    //});

                    graph.addCells([
                        rect
                    ]);
                },
                saveGraph: function () {
                    console.log(JSON.stringify(graph.toJSON()));
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