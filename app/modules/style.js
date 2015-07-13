define(
    ['backbone'],

function (Backbone) {


    var style = Backbone.Model.extend({
        node:
        {
            strokeDashArray:
            {
                selected: '2,3',
                deselected: '',
                testDeselected:''
            },
            fill:
            {
                normal: 'rgb(255,255,255)',
                testDeselected: 'rgba(255,255,255)'
            },
            fillOpacity:
            {
                normal: 1,
                testDeselected: 0.2
            },
            strokeWidth:
            {
                normal: 2,
                testDeselected: 1
            },
            stroke:
            {
                normal: 'rgb(0,0,0)',
                testDeselected: 'rgba(0,0,0,0.5)'
            },
            strokeOpacity:
            {
                normal: 1,
                testDeselected: 0.2
            }
        },
        wrapper:
        {
            strokeDashArray:
            {
                selected: '2,3',
                deselected: '',
                testDeselected:''
            },
            fill:
            {
                normal: 'rgb(255,255,255)',
                testDeselected: 'rgba(255,255,255)'
            },
            fillOpacity:
            {
                normal: 0.5,
                testDeselected: 0.2
            },
            strokeWidth:
            {
                normal: 2,
                testDeselected: 1
            },
            stroke:
            {
                normal: 'rgb(0,0,0)',
                testDeselected: 'rgba(0,0,0,0.5)'
            },
            strokeOpacity:
            {
                normal: 0.5,
                testDeselected: 0.2
            }
        },
        endpoint:
        {
            strokeDashArray:
            {
                selected: '2,3',
                deselected: '',
                testDeselected:''
            },
            fill:
            {
                normal: 'rgb(255,190,190)',
                testDeselected: 'rgb(255,190,190)'
            },
            fillOpacity:
            {
                normal: 1,
                testDeselected: 0.2
            },
            strokeWidth:
            {
                normal: 2,
                testDeselected: 1
            },
            stroke:
            {
                normal: 'rgb(0,0,0)',
                testDeselected: 'rgba(0,0,0,0.5)'
            },
            strokeOpacity:
            {
                normal: 1,
                testDeselected: 0.2
            }
        },
        port:
        {
            in:
            {
                fill:
                {
                    normal: 'rgb(190,190,190)',
                    hidden: 'rgba(0,0,0,0)'
                },
                stroke:
                {
                    normal: 'rgb(190,190,190)',
                    hidden: 'rgba(0,0,0,0)'
                }
            },
            out:
            {
                fill:
                {
                    normal: 'rgb(190,190,190)',
                    hidden: 'rgba(0,0,0,0)'
                },
                stroke:
                {
                    normal: 'rgb(190,190,190)',
                    hidden: 'rgba(0,0,0,0)'
                }
            }
        },
        text:
        {
            fill:
            {
                normal: 'rgb(0,0,0)',
                testDeselected: 'rgba(0,0,0,0.5)'
            },
            fontSize:
            {
                label: '8px'
            }
        }
    });

    return new style();

});