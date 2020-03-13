import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
// import { piePatternSrc, bgPatternSrc } from './echarts.img';
import { getModelPreview } from './service';
import ModelPreview from './components/train-process';
import './index.less';

// const piePatternImg = new Image();
// piePatternImg.src = piePatternSrc;
// const bgPatternImg = new Image();
// bgPatternImg.src = bgPatternSrc;

// const itemStyle = {
//   normal: {
//     opacity: 0.7,
//     color: {
//       image: piePatternImg,
//       repeat: 'repeat'
//     },
//     borderWidth: 3,
//     borderColor: '#235894'
//   }
// };
// const option = {
//   backgroundColor: { image: bgPatternImg, repeat: 'repeat' },
//   title: { text: 'Echarts', textStyle: { color: '#235894' } },
//   tooltip: {},
//   series: [{
//     name: 'pie',
//     type: 'pie',
//     selectedMode: 'single',
//     selectedOffset: 30,
//     clockwise: true,
//     label: { fontSize: 18, color: '#235894' },
//     labelLine: { lineStyle: { color: '#235894' } },
//     data: [
//       {value: 335, name: '这是'},
//       {value: 310, name: 'React'},
//       {value: 234, name: '和'},
//       {value: 135, name: 'Echarts的'},
//       {value: 1548, name: 'widget'},
//     ],
//     itemStyle,
//   }]
// };

const fakePrn = 'TaskController/PicoTraining-10001684-10001684-29d882.model';
const fakeWorkspaceId = 1;
const Widget: React.FC<any> = () => {
  // return (
  //   <ReactEcharts option={option} />
  // )
  const [ data, setData ] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const result = await getModelPreview(fakePrn, fakeWorkspaceId);
      const data = result?.data?.data;
      console.log(666666, data);
      setData(data);
    })();
  }, []);
  return (
    <div>
      { data &&  <ModelPreview data={data} />}
    </div>
  )
}

export default React.memo(Widget);