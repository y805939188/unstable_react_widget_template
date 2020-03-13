export const xAxisStyle = {
	nameLocation: 'middle',
	nameGap: 30,
	nameTextStyle: { color: '#626262' },
	axisLine: { lineStyle: { color: '#d5d9dd' } },
	axisTick: { show: false },
	axisLabel: { color: '#626262' },
	splitLine: { show: false },
};
const getLongIntAbbr = (value: number) => (value >= 100000) ? value.toExponential(2) : value; 

export const yAxisStyle = {
	nameLocation: 'middle',
	nameTextStyle: { color: '#626262' },
	axisLine: { lineStyle: { color: '#d5d9dd' } },
	axisTick: { show: false },
	axisLabel: { color: '#626262', formatter: getLongIntAbbr },
	splitLine: {
		show: true,
		lineStyle: { color: '#d5d9dd' },
	},
};
