import { xAxisStyle, yAxisStyle } from './axis';

export default {
    tooltip: {
        show: true,
    },
    grid: {
        x: 40, // 默认是80px
        y: 20, // 默认是60px
        x2: 20, // 默认80px
        y2: 80, // 默认60px
    },
    xAxis: {
        type: 'category',
        ...xAxisStyle,
        data: ['召回率(Recall)', 'TNR(Specificity)', '精准率(Precision)', 'NPV', '准确率(Accuracy)', 'F1 score'],
        axisLabel: {
            rotate: 30,
            interval: 0,
            margin: 12,
            fontSize: 12,
            color: '#626262',
        },
    },
    yAxis: {
        type: 'value',
        ...yAxisStyle,
        axisLabel: {
            formatter(value) {
                if (value !== 0) return `${value * 100}%`;
                return value;
            },
            color: '#626262',
        },
        min: 0,
        max: 1,
    },
    series: [{
        type: 'bar',
        barWidth: 50,
        animation: false,
        label: {
            normal: {
                show: true,
                position: 'top',
                textStyle: {
                    color: '#000000',
                },
            },
        },
        itemStyle: {
            normal: {
                color: '#80caa3',
            },
        },
        data: [0.5, 0.6, 0.4, 0.7, 0.6, 0.7, 0.4],
    }],
};
