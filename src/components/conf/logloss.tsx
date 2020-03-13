import { EChartOption } from 'echarts';
import { xAxisStyle, yAxisStyle } from './axis';

// 这特么Echarts的类型怎么写啊!!!!!!!
const options: { [prop: string]: any } = {
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
		top: 25,
		data: [{ name: '训练logloss', icon: 'rect' }],
	},
	xAxis: {
		...xAxisStyle,
		type: 'category',
		name: 'iterations',
		boundaryGap: false,
	},
	yAxis: {
		...yAxisStyle,
		type: 'value',
		name: 'logloss',
		nameGap: 60,
		boundaryGap: [0, '100%'],
	},
	series: [{
		animationDelay: function (idx: number) {
			return idx * 100+ 100;
		},
		type: 'line',
		markLine: {
			// animation: 3000,
			animation: true,
			animationDuration: 3000,
		},
		animation: true,
		animationDuration: 3000,
		symbolSize: 12,
		showSymbol: false,
		itemStyle: { normal: { lineStyle: { width: 3 } } },
		hoverAnimation: false,
		connectNulls: true,
		data: [
			[1000, 15],
			[1101, 75],
			[1202, 55],
			[1303, 35],
			[1403, 5],
			[1505, 23],
			[1600, 43],
			[1701, 32],
			[1802, 43],
			[1903, 90],
			[2003, 37],
			[2105, 54],
			[2200, 34],
			[2301, 61],
			[2402, 55],
			[2503, 34],
			[2603, 43],
			[2705, 54],
			[2800, 43],
			[2901, 32],
			[3002, 23],
			[3103, 34],
			[3203, 23],
			[3305, 12],
		],
	}],
}

export default options;
