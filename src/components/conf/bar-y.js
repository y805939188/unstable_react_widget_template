export default {
    title: {
        text: '',
        textStyle: {
            fontWeight: 'normal',
            fontSize: '16',
            color: '#212121',
        },
    },
    tooltip: {
        trigger: 'item',
        padding: 10,
        formatter(params) {
            if (params.data[3] && params.data[4]) {
                // 填充率有时会返回51.1200003%这种情况，现在的需求是只保留两位
                const rate = `${parseFloat(params.data[3]).toFixed(2)}%`;
                return `特征名 : ${params.data[5]}<br />频次 : ${params.data[2]}<br />填充率 : ${rate}<br />特征属性 : ${params.data[4]}`;
            }
            return `特征名 : ${params.data[3]}<br />特征属性 : ${params.data[2]}`;
        },
    },
    visualMap: {
        type: 'piecewise',
        precision: 4,
        pieces: [
            { max: 0.8 },
            {}, // 剩下的
        ],
        dimension: 0,
        show: false,
        color: ['#FF975E', '#55b5ca'],
    },
    dataZoom: [
        {
            type: 'slider',
            yAxisIndex: [0],
            filterMode: 'filter',
            startValue: 0,
            endValue: 0,
            showDetail: false,
            zoomLock: true,
            handleStyle: {
                opacity: 0,
            },
        },
    ],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        min: 0,
        max: 1,
        // name: '特征重要性系数',
        // nameLocation: 'middle',
        // nameGap: 25
    },
    yAxis: {
        type: 'category',
        data: [],
        axisTick: {
            lineStyle: {
                width: 0,
            },
        },
        axisLine: {
            show: false,
        },
        axisLabel: {
            margin: 22,
        },
        // name: '特征名',
        // nameLocation: 'middle',
        // nameGap: 50,
    },
    animation: false,
    series: [
        {
            type: 'bar',
            data: [],
            itemStyle: {
                normal: {
                    color: '#55b5ca',
                },
            },
            barCategoryGap: '50%',
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter(params) {
                        return params.data[0];
                    },
                    textStyle: {
                        color: '#757575',
                    },
                },
            },
        },
    ],

};

