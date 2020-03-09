import React, { PureComponent, createRef, RefObject } from 'react';
import echarts, { EChartsResponsiveOption } from 'echarts';
import barY from './bar-y';

interface IProps {
  report: { [prop: string]: any; };
  type: string;
  displayNumber?: number; // 显示的bar的个数
}

export default class FeatureBar extends PureComponent<IProps, any> {
  private readonly wrapperRef: RefObject<HTMLDivElement> = createRef();
  componentDidMount() {
    const { report = {}, type = 'lr', displayNumber = 15 } = this.props;
    this.updateGraph(report, type, displayNumber);
  }

  componentDidUpdate() {
    const { report, type, displayNumber = 15 } = this.props;
    this.updateGraph(report, type, displayNumber);
  }

  updateGraph = (report: IProps['report'], type: IProps['type'], bar: IProps['displayNumber']) => {
    const train = this.wrapperRef.current;
    if (!train) return;
    const graph = echarts.init(train);
    const graphData = this.parseData(report, type, bar);
    if (graphData) graph.setOption((graphData as EChartsResponsiveOption));
  }

  parseData = (report: IProps['report'], type: IProps['type'], bar: IProps['displayNumber']) => {
    const { content } = report;
    if (!content) return null;
    const detailArray = content.featureDetails;
    const len = detailArray.length;
    if (len === 0) {
      barY.yAxis.data = [];
      barY.series[0].data = [];
      return barY;
    }
    if (type === 'lr') {
      this.parseLRModelImportance(detailArray, len, bar);
    } else if (type === 'gbdt' || type === 'gbdt-fpga') {
      this.parseGBDTModelImportance(detailArray, len, bar);
    }
    return barY;
  }

  parseLRModelImportance = (detailArray: any[], len: number, displayNumber: number = 15) => {
    /**
     * 如果存在负数，需要不优雅的将数据增加一个值使其大于0，并将坐标轴减去这个数使其和原值相等。
     * 从而达到负数显示的不是双向坐标轴的效果。此处主要为lr的特征重要性trick处理，
     * 后端返回会从大到小，因此最后一个值是最小值
     */
    const min = detailArray[len - 1].importance;
    const max = detailArray[0].importance;
    const offset = (max - min) / 10; // 为坐标轴预留的边距
    const addData = min < 0 ? Math.abs(min) + offset : offset;
    const nameArr: any[] = [];
    const dataArr: any[] = [];
    detailArray.forEach((detail, index) => {
      const type = detail.type === 'discrete' ? '离散' : '连续';
      const tempName = detail.name;
      // 名字长度大于60的时候截断，目前数据库对特征名的长度限制是80个
      const name = (tempName && tempName.length > 60) ? `${tempName.substr(0, 60)}…` : tempName;
      nameArr.unshift(name);
      /* lr模型解释增加一个值保证数据都是正数，从而显示不双向显示 */
      const importance = detail.importance + addData;
      if (detail.frequency && detail.fillRate) {
        const fillRate = `${detail.fillRate * 100}%`;
        dataArr.unshift([importance, len - index - 1, detail.frequency, fillRate, type, name]);
      } else {
        dataArr.unshift([importance, len - index - 1, type, name]);
      }
    });
    /* 坐标轴减去这个值使得显示和原值相等 */
    (barY.xAxis as any).axisLabel = {
      formatter: (n: any) => (n - addData).toFixed(4),
    };
    (barY.xAxis as any).max = addData + offset + max;
    (barY.yAxis as any).data = nameArr;
    (barY.series[0] as any).data = dataArr;
    barY.series[0].label.normal.formatter = params => (params.data[0] - addData).toFixed(4);
    barY.dataZoom[0].startValue = nameArr.length;
    barY.dataZoom[0].endValue = nameArr.length - displayNumber;
    return barY;
  }

  parseGBDTModelImportance = (detailArray: any[], len: number, displayNumber: number = 15) => {
    const nameArr: any[] = [];
    const dataArr: any[] = [];
    /** 结构，有组合特征
     * {
     *   "feas": [{
     *     "slotName": "f_age",
     *     "signName": "10",
     *     "slot": 1,
     *     "sign": 1244555,
     *     "type": "discrete",
     *   }],
     *   "importance": 0.8,
     *   "frequency": 66,
     * }
     */
    detailArray.forEach((detail, index) => {
      const { feas, fillRate, frequency, importance } = detail;
      // 名字长度大于60的时候截断，目前数据库对特征名的长度限制是80个
      const tempName = detail.name;
      const name = (tempName && tempName.length > 60) ? `${tempName.substr(0, 60)}…` : tempName;
      const type = feas.reduce(
        (a: string, b: any) => (a += b.type === 'discrete' ? '离散' : '连续'),
      '');
      nameArr.unshift(name);
      if (frequency && fillRate) {
        const currentFillRate = `${fillRate * 100}%`;
        dataArr.unshift([importance, len - index - 1, frequency, currentFillRate, type, name]);
      } else {
        dataArr.unshift([importance, len - index - 1, type, name]);
      }
    });
    (barY.xAxis as any).max = null;
    (barY.xAxis as any).axisLabel = { interval: 0, rotate: -30 };
    (barY.yAxis as any).data = nameArr;
    (barY.series[0] as any).data = dataArr;
    barY.series[0].label.normal.formatter = params => params.data[0];
    barY.dataZoom[0].startValue = nameArr.length;
    barY.dataZoom[0].endValue = nameArr.length - displayNumber;
    return barY;
  }

  render = () => (<div ref={this.wrapperRef} id="echarts-featurebar" style={{ height: '600px' }} />);
}