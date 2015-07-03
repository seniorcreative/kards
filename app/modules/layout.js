define(['jquery','backbone'], function ($,Backbone) {


    var layout = Backbone.Model.extend({

        stage:
        {
            centerX: parseInt(window.innerWidth / 2),
            centerY: parseInt(window.innerHeight / 2)
        },
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
            bodySize: {width: 320, height: 90}
        },
        report: {
            size: {width: 200, height: 75},
            startX: 0,
            startY: 100
        },
        section: {
            size: {width: 120, height: 75},
            startX: -250,
            startY: 200
        },
        endpoint: {
            size: {width: 180, height: 100}
        },
        answerMargin: 20,
        logicWrapperPadding: 40,
        logicCenterHeight: 20
    });


    var layoutModel = new layout();

    $(window).on('resize', function()
    {
        layoutModel.stage.centerX = parseInt(window.innerWidth / 2);
        layoutModel.stage.centerY = parseInt(window.innerHeight / 2);
    });

    return layoutModel;

});