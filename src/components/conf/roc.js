import { xAxisStyle, yAxisStyle } from './axis';

export default {
    tooltip: {
        show: true,
    },
    title: {
        text: null,
        textStyle: {
            fontSize: 12,
            color: '#212121',
            fontWeight: 'normal',
        },
        top: 20,
        x: 'center',
        y: 0,
    },
    xAxis: {
        type: 'value',
        name: '1-sepcificity',
        ...xAxisStyle,
        min: 0,
        max: 1,
    },
    yAxis: {
        type: 'value',
        name: 'sensitivity',
        ...yAxisStyle,
        nameGap: 40,
        min: 0,
        max: 1,
    },
    series: [{
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
            normal: {
                areaStyle: {
                    color: 'rgba(97, 198, 207, 0.2)',
                    type: 'default',
                },
                lineStyle: {
                    color: '#55ca9f',
                    width: 3,
                },
            },
        },
        data: [
            [0, 0],
            [0.05, 0.07],
            [0.20, 0.4],
            [0.30, 0.50],
            [0.36, 0.46],
            [0.42, 0.52],
            [0.50, 0.60],
            [0.55, 0.75],
            [0.60, 0.80],
            [0.70, 0.95],
            [0.95, 0.95],
            [1, 1],
        ],
    }, {
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: '#4da0ee',
                    width: 2,
                    type: 'dashed',
                },
            },
        },
        data: [
            [0, 0],
            [1, 1],
        ],
    }],
};
