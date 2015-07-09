define(
    ['backbone'],

function (Backbone) {


    var style = Backbone.Model.extend({
        node:
        {
            strokeDashArray:
            {
                selected: '2,3',
                deselected: ''
            },
            fill:
            {
                normal: 'rgb(255,255,255)',
                wrapper: 'rgb(255,255,255)',
                endPoint: 'rgb(255,190,190)'
            },
            fillOpacity:
            {
                normal: 1,
                wrapper: 0.5
            },
            strokeWidth:
            {
                normal: 2,
                wrapper: 2
            },
            stroke:
            {
                normal: 'rgb(0,0,0)',
                wrapper: 'rgb(0,0,0)'
            },
            strokeOpacity:
            {
                normal: 1,
                wrapper: 0.5
            }
        },
        port:
        {
            in:
            {
                fill:
                {
                    normal: '#cccccc',
                    hidden: 'rgba(0,0,0,0)'
                },
                stroke:
                {
                    normal: '#cccccc',
                    hidden: 'rgba(0,0,0,0)'
                }
            },
            out:
            {
                fill:
                {
                    normal: '#cccccc',
                    hidden: 'rgba(0,0,0,0)'
                },
                stroke:
                {
                    normal: '#cccccc',
                    hidden: 'rgba(0,0,0,0)'
                }
            }
        },
        text:
        {
            fill:
            {
                normal: 'rgb(0,0,0)'
            },
            fontSize:
            {
                label: '8px'
            }
        }
    });

    return new style();

});