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
		padding: 10,
		formatter(params: any) {
			const { data } = params;
			if (data[3] && data[4]) {
				// 填充率有时会返回51.1200003%这种情况，现在的需求是只保留两位
				const rate = `${parseFloat(data[3]).toFixed(2)}%`;
				return `特征名 : ${data[5]}<br />频次 : ${data[2]}<br />填充率 : ${rate}<br />特征属性 : ${data[4]}`;
			}
			return `特征名 : ${data[3]}<br />特征属性 : ${data[2]}`;
		},
	},
	dataZoom: [
		{
			type: 'slider',
			yAxisIndex: [0],
			filterMode: 'filter',
			startValue: 0,
			endValue: 0,
			width: 20,
			showDetail: false,
			zoomLock: true,
			handleStyle: { opacity: 0 },
		},
	],
	grid: {
		top: 10,
		bottom: 20,
		left: 15,
		containLabel: true,
	},
	xAxis: {
		type: 'value',
		axisLine: { show: false },
		axisTick: { show: false },
		axisLabel: { color: '#626262' },
		splitLine: { lineStyle: { color: 'rgba(0,0,0,0.09)' } },
	},
	yAxis: {
		type: 'category',
		data: [],
		axisTick: { lineStyle: { width: 0 } },
		axisLine: { show: false },
		axisLabel: { margin: 16, color: '#626262' },
	},
	animation: false,
	series: [
		{
			type: 'bar',
			data: [],
			itemStyle: { normal: { color: '#16c4c6' } },
			barCategoryGap: '50%',
			label: {
				normal: {
					show: true,
					position: 'right',
					formatter(params: any) {
						return params.data[0];
					},
					textStyle: { color: '#757575' },
				},
			},
		},
	],
};
