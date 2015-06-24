define(['backbone'], function (Backbone) {


    var layout = Backbone.Model.extend({

        question: {
            boolean: {
                qSize: {width: 120, height: 75},
                aSize: {width: 120, height: 50},
                answers: []
            },
            'multiple choice': {
                qSize: {width: 120, height: 75},
                aSize: {width: 120, height: 50},
                answers: []
            },
            'numeric': {
                qSize: {width: 120, height: 75},
                aSize: {width: 120, height: 50},
                answers: []
            }
        },
        content:
        {
            wrapperSize: {width: 350, height: 150},
            bodySize: {width: 250, height: 75}
        },
        report: {
            size: {width: 200, height: 75}
        },
        section: {
            size: {width: 120, height: 75}
        }

    });


    return new layout();

});