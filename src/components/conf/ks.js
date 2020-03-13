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
        left: 50,
        top: 10,
        x: 'center',
        y: 0,
    },
    legend: {
        right: 50,
        top: 25,
        orient: 'horizontal',
        data: [{
            name: '正样本洛伦兹曲线',
            icon: 'rect',
        }, {
            name: '负样本洛伦兹曲线',
            icon: 'rect',
        }, {
            name: 'KS值',
            icon: 'rect',
        }],
    },
    xAxis: {
        type: 'value',
        name: '分组编号',
        ...xAxisStyle,
        min: 0,
        max: 1,
    },
    yAxis: {
        type: 'value',
        name: '累计占比%',
        ...yAxisStyle,
        nameGap: 40,
        min: 0,
        max: 1,
    },
    series: [{
        name: '正样本洛伦兹曲线',
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
        name: '负样本洛伦兹曲线',
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: '#4DA0EE',
                    width: 3,
                },
            },
        },
        data: [
            [0, 0],
            [0.05, 0.07],
            [0.20, 0.2],
            [0.30, 0.3],
            [0.36, 0.32],
            [0.42, 0.35],
            [0.50, 0.36],
            [0.55, 0.6],
            [0.60, 0.7],
            [0.70, 0.8],
            [0.95, 0.95],
            [1, 1],
        ],
    }, {
        name: 'KS值',
        type: 'line',
        smooth: true,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: '#fa7373',
                    width: 3,
                    type: 'dashed',
                },
            },
        },
        data: [
            [0.42, 0.52],
            [0.42, 0.35],
        ],
    }],
};
