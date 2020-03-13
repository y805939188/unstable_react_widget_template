import { xAxisStyle, yAxisStyle } from './axis';
import { defineMessages } from 'i18n-acceleration';
import { intl } from '../../../config/self-intl-provider';

export default {
    tooltip: {
        show: true,
    },
    xAxis: {
        type: 'value',
        name: intl.formatMessage(defineMessages({ value: { id: 'f3f69ebaf44ce82ac3579cb22ed2b942', defaultMessage: '占数据集的百分比' } }).value),
        ...xAxisStyle,
        min: 0,
        max: 100,
    },
    yAxis: {
        type: 'value',
        name: 'Lift',
        ...yAxisStyle,
        nameGap: 40,
        min: 0,
        max: 3,
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
