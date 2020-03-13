import { xAxisStyle, yAxisStyle } from './axis';

const auc: any = {
	tooltip: { trigger: 'axis' },
	title: {
		text: null,
		textStyle: { fontSize: 14, color: '#ccc', fontWeight: 'normal' },
		top: 20,
		x: 'center',
		y: 0,
	},
	color: ['#00c8ff', '#36b37e'],
	legend: {
		itemWidth: 8,
		itemHeight: 8,
		right: 60,
		top: 30,
		data: [{ name: '训练AUC', icon: 'rect' }],
	},
	xAxis: {
		type: 'category',
		name: 'iterations',
		...xAxisStyle,
		boundaryGap: false,
	},
	yAxis: {
		type: 'value',
		name: 'AUC',
		...yAxisStyle,
		min: 0,
		max: 1,
		nameGap: 60,
	},
	series: [{
		type: 'line',
		symbolSize: 12,
		showSymbol: false,
		smooth: true,
		hoverAnimation: false,
		itemStyle: { normal: { lineStyle: { width: 3 } } },
		data: [
			[0, 0],
			[100, 0.07],
			[1000, 0.4],
			[2000, 0.50],
			[3000, 0.46],
			[4000, 0.52],
			[5000, 0.55],
			[10000, 0.43],
			[12000, 0.62],
			[15000, 0.71],
			[18000, 0.60],
			[20000, 0.80],
		],
	}],
};
export default auc;
