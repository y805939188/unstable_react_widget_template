export const xAxisStyle = {
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: {
        color: '#626262',
    },
    axisLine: {
        lineStyle: {
            color: '#d5d9dd',
        },
    },
    axisTick: {
        show: false,
    },
    axisLabel: {
        color: '#626262',
    },
    splitLine: {
        show: false,
    },
};
function getLongIntAbbr(value) {
    if (value >= 100000) {
        return value.toExponential(2);
    }
    return value;
}
export const yAxisStyle = {
    nameLocation: 'middle',
    nameTextStyle: {
        color: '#626262',
    },
    axisLine: {
        lineStyle: {
            color: '#d5d9dd',
        },
    },
    axisTick: {
        show: false,
    },
    axisLabel: {
        color: '#626262',
        formatter: getLongIntAbbr,
    },
    splitLine: {
        show: true,
        lineStyle: {
            color: '#d5d9dd',
        },
    },
};
