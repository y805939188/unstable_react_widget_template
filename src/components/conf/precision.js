import { xAxisStyle, yAxisStyle } from './axis';

export default {
    tooltip: {
        show: true,
    },
    xAxis: {
        type: 'value',
        name: 'Recall',
        ...xAxisStyle,
        min: 0,
        max: 1,
    },
    yAxis: {
        type: 'value',
        name: 'Precision',
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
                lineStyle: {
                    color: '#55ca9f',
                    width: 3,
                },
            },
        },
        data: [
            [0, 0.9],
            [0.05, 0.9],
            [0.20, 0.9],
            [0.30, 0.9],
            [0.36, 0.8],
            [0.42, 0.8],
            [0.50, 0.8],
            [0.55, 0.7],
            [0.60, 0.6],
            [0.70, 0.5],
            [0.95, 0.4],
            [1, 0.2],
        ],
    }],
};
