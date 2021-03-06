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
                test: 'rgb(202,247,255)',
                testDeselected: 'rgb(255,255,255)',
                testInputChanged: 'rgb(150,255,40)'
            },
            fillOpacity:
            {
                normal: 1,
                testDeselected: 0.4
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
                testDeselected: 0.4
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
                testDeselected: 0.4
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
                testDeselected: 0.4
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
                testDeselected: 0.4
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
                testDeselected: 0.4
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
                label: '8px',
                node: '11px',
                question: '12px'
            }
        },
        link:
        {
            outside:
            {
                router: 'manhattan',
                connector: 'rounded',
                width: 5,
                cap: 'round',
                opacity:.3
            },
            inside:
            {
                router: 'orthogonal',
                connector: 'normal',
                width: 2,
                cap: 'round',
                opacity:.5
            }
        }
    });

    return new style();

});