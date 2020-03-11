import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { piePatternSrc, bgPatternSrc } from './echarts.img';

const piePatternImg = new Image();
piePatternImg.src = piePatternSrc;
const bgPatternImg = new Image();
bgPatternImg.src = bgPatternSrc;

const itemStyle = {
  normal: {
    opacity: 0.7,
    color: {
      image: piePatternImg,
      repeat: 'repeat'
    },
    borderWidth: 3,
    borderColor: '#235894'
  }
};
const option = {
  backgroundColor: { image: bgPatternImg, repeat: 'repeat' },
  title: { text: 'Echarts', textStyle: { color: '#235894' } },
  tooltip: {},
  series: [{
    name: 'pie',
    type: 'pie',
    selectedMode: 'single',
    selectedOffset: 30,
    clockwise: true,
    label: { fontSize: 18, color: '#235894' },
    labelLine: { lineStyle: { color: '#235894' } },
    data: [
      {value: 335, name: '这是'},
      {value: 310, name: 'React'},
      {value: 234, name: '和'},
      {value: 135, name: 'Echarts的'},
      {value: 1548, name: 'widget'},
    ],
    itemStyle,
  }]
};

const Widget: React.FC<null> = () => {
  return (
    <ReactEcharts option={option} />
  )
}

export default React.memo(Widget);