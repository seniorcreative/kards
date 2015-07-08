define(['jquery','backbone'], function ($,Backbone) {


    var layout = Backbone.Model.extend({

        stage:
        {
            centerX: parseInt(window.innerWidth / 2),
            centerY: parseInt(window.innerHeight / 2)
        },
        question: {
            '1': {
                qSize: {width: 180, height: 50},
                aSize: {width: 100, height: 40},
                answers: []
            },
            '2': {
                qSize: {width: 180, height: 50},
                aSize: {width: 100, height: 40},
                answers: []
            },
            '3': {
                qSize: {width: 180, height: 50},
                aSize: {width: 100, height: 10},
                answers: []
            }
        },
        content:
        {
            wrapperSize: {width: 350, height: 150},
            bodySize: {width: 320, height: 90}
        },
        report: {
            size: {width: 180, height: 50},
            startX: 0,
            startY: 100
        },
        section: {
            size: {width: 140, height: 50},
            startX: -250,
            startY: 200
        },
        endpoint: {
            size: {width: 140, height: 50}
        },
        answerMargin: 20,
        logicWrapperPadding: 30,
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