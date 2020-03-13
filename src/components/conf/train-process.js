const iterArray = [];
for (let i = 0; i < 20000; i += 1) {
    iterArray[i] = i;
}

export default {
    tooltip: {
        show: true,
    },
    title: {
        text: '训练过程概要',
    },
    xAxis: [{
        type: 'value',
        name: 'iterations',
        nameLocation: 'middle',
        nameGap: 25,
        min: 0,
        max: 20000,
        splitLine: {
            show: false,
        },
    }],
    yAxis: [{
        type: 'value',
        name: 'log loss',
        min: 0,
        max: 6,
        splitLine: {
            show: false,
        },
    }, {
        type: 'value',
        name: 'auc',
        position: 'right',
        min: 0,
        max: 1,
        splitLine: {
            show: false,
        },
    }],
    series: [{
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: 'rgba(97, 198, 207, 1)',
                    width: 2,
                },
            },
        },
        data: [
            [0, 5],
            [2000, 4.5],
            [3000, 4],
            [4000, 3.5],
            [6000, 3],
            [8000, 2.5],
            [10000, 2],
            [12000, 1.5],
            [16000, 1],
            [18000, 0.5],
        ],
    }, {
        type: 'line',
        smooth: true,
        showSymbol: false,
        yAxisIndex: 1,
        itemStyle: {
            normal: {
                lineStyle: {
                    color: 'rgba(97, 198, 207, 1)',
                    width: 2,
                },
            },
        },
        data: [
            [0, 0.1],
            [2000, 0.2],
            [3000, 0.3],
            [4000, 0.35],
            [6000, 0.3],
            [8000, 0.4],
            [10000, 0.5],
            [12000, 0.7],
            [16000, 0.8],
            [18000, 0.85],
        ],
    }],
};
