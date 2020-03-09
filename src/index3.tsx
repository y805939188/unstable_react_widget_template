

import React, { PureComponent } from 'react';
import moment from 'moment';
import sortBy from 'lodash/sortBy'; // mac 上不区分大小写 所以放到linux上就写成sortby就报错了
import findIndex from 'lodash/findIndex';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/custom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/axis';
import 'echarts/lib/component/axisPointer';
import 'echarts/lib/component/toolbox/feature/DataZoom';
import 'echarts/lib/component/helper/sliderMove';
import 'echarts/lib/component/dataZoom/SliderZoomView';
import 'echarts/lib/component/dataZoom/SliderZoomModel';
import 'echarts/lib/component/timeline/SliderTimelineView';
import 'echarts/lib/component/timeline/SliderTimelineModel';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/toolbox/feature/SaveAsImage';
import { Button, Switch } from 'antd';
// import pwsDAO from 'app/dao/pws';
import axios from 'axios';
// @ts-ignore
import style from './index.less';
// import 'antd/es/button/style/index.less';
// import 'antd/es/switch/style/index.less';
import 'antd/dist/antd.css';
// console.log(999, style)

function getCreateTimeFromTimestamp(timestamp?: number | string) {
  if (!timestamp) return '';
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

interface IProps {
  stop: any;
  data: any;
  taskId: any;
  renderCallback?: (cb: () => void) => void;
}

const stateColor = {
  SUCCEED: 'rgba(54,179,126, 0.9)',
  FAILED: '#CC1B1B',
  START: '#0065FF',
  WAITING: 'rgba(213,208,221, 0.9)',
};

const stateHoverColor = {
  SUCCEED: '#36B37E',
  FAILED: '#CC1B1B',
  START: '#0A66FF',
  WAITING: '#DBD6DD',
};

const getTextWidth = (() => {
  const temporaryToolLabel =
    document.querySelector('#temporary-tool-label') ||
    document.createElement('span');

  temporaryToolLabel.id || (temporaryToolLabel.id = 'temporary-tool-label');
  document.body.appendChild(temporaryToolLabel);
  // @ts-ignore
  temporaryToolLabel.style.position = 'fixed';
  // @ts-ignore
  temporaryToolLabel.style.visibility = 'hidden';
  // @ts-ignore
  temporaryToolLabel.style.whiteSpace = 'nowrap';
  // @ts-ignore
  temporaryToolLabel.style.zIndex = -100;
  // @ts-ignore
  return (text = '', size = '12px') => {
    // @ts-ignore
    temporaryToolLabel.style.fontSize = size;
    // @ts-ignore
    temporaryToolLabel.innerText = text;
    return getComputedStyle(temporaryToolLabel)['width'];
  };
})();
const theCapitalWidth = parseFloat(getTextWidth('A') || '12');
const theLowercaseWidth = parseFloat(getTextWidth('a') || '10');
const theMinLimitWidth = parseFloat(getTextWidth('...') || '12');

class WaterfallPlot extends PureComponent<IProps, any> {
  // @ts-ignore
  constructor(props) {
    super(props);
    this.state = {
      lightColor: 'red',
      startColor: '#0065FF',
      futureData: 0,
      spansTarget: 1,
      dateObj: {},
      dateArr: [],
      plies: {},
      realTime: false,
      loading: true,
    };

    // @ts-ignore
    this.myEcharts = null;
    // @ts-ignore
    this.timer = null;
    // @ts-ignore
    this.unmount = null;
    this.handleOnAutoUpdateTrace = this.handleOnAutoUpdateTrace.bind(this);
    // @ts-ignore
    this.xStart = null;
    // @ts-ignore
    this.xEnd = null;
    // @ts-ignore
    this.yStart = null;
    // @ts-ignore
    this.yEnd = null;
    // @ts-ignore
    this.series = null;
  }
  componentDidMount() {
    window.addEventListener('resize', () => {
      // @ts-ignore
      if (this.myEcharts) {
        // @ts-ignore
        this.myEcharts.resize();
      }
    });
    const echartsNode = document && document.getElementById('echarts');
    if (!echartsNode) return;
    // @ts-ignore
    this.myEcharts = echarts.init(echartsNode);
    // @ts-ignore
    this.myEcharts.on('dataZoom', (params) => {
      const id = params.dataZoomId;
      if (id === 'dataZoomX') {
        // @ts-ignore
        this.xStart = params.start;
        // @ts-ignore
        this.xEnd = params.end;
      } else if (id === 'dataZoomY') {
        // @ts-ignore
        this.yStart = params.start;
        // @ts-ignore
        this.yEnd = params.end;
      }
    });
    // @ts-ignore
    this.getData(() => this.handleOnAutoUpdateTrace(!this.props.stop), true);
  }
  // @ts-ignore
  componentWillUnmount() {
    // @ts-ignore
    this.unmount = true;
    // @ts-ignore
    if (this.timer) {
      // @ts-ignore
      clearTimeout(this.timer);
      // @ts-ignore
      this.timer = null;
    }
  }

  // @ts-ignore
  getData(cb?, isMount?) {
    // @ts-ignore
    const {
      stop,
      data: { dagRunId, nodeId },
      taskId,
    } = this.props;
    if (stop) {
      this.handleOnAutoUpdateTrace(false);
      if (!isMount) return;
      // return;
    };
    // @ts-ignore
    if (this.unmount) return;
    const hasData = !!(dagRunId && nodeId);
    if (!hasData && !taskId) return;
    this.setState({
      futureData: 0,
      spansTarget: 1,
      dateObj: {},
      dateArr: [],
      plies: {},
    });

    const promise = hasData ?
      axios.get(`/task-controller/api/private/v1/run/${dagRunId}/operator/${nodeId}/trace`) :
      axios.get(`/task-controller/api/private/v1/console/tasks/${taskId}/trace`);
    // @ts-ignore
    promise.then((resp) => {
      const { infoList } = resp.data.data;
      console.info("****************",infoList)
      this.initTable(infoList);
      // @ts-ignore
      const lightColor = this.state.lightColor === 'red' ? 'green' : 'red';
      // @ts-ignore
      const startColor =
        this.state.startColor === '#0065FF' ? '#8EE5EE' : '#0065FF';
      this.setState({
        lightColor,
        startColor,
        loading: false,
      }, () => (cb && cb()));
    });
  }
  // @ts-ignore
  getDateArr(data, spansTarget) {
    // @ts-ignore
    const { plies } = this.state;
    // @ts-ignore
    let timeArr = [];
    const target = spansTarget || 'stage';
    if (!plies[target]) {
      plies[target] = true;
      this.setState({
        plies,
      });
    }
    // @ts-ignore
    data.forEach((d, index) => {
      d.spansTarget = target;
      if (d.startTime) timeArr.push(d.startTime);
      if (d.endTime) timeArr.push(d.endTime);
      if (d.startTime && !d.endTime) data[index].endTime = 'nowTime';
      if ((!d.spans || d.spans.length === 0) && !d.startTime) {
        // @ts-ignore
        const { futureData } = this.state;
        let nextFutureData = futureData;
        if (nextFutureData === 0) {
          data[index].startTime = 'nowTime';
        } else {
          timeArr.push('未来时刻');
          data[index].startTime = '未来时刻';
        }
        nextFutureData = nextFutureData + 1;
        timeArr.push('未来时刻');
        data[index].endTime = '未来时刻';
        this.setState({
          futureData: nextFutureData,
        });
      }
      // @ts-ignore
      if (d.spans) {
        // @ts-ignore
        timeArr = timeArr.concat(this.getDateArr(d.spans, `${target}Spans`));
      }
    });
    // @ts-ignore
    return timeArr;
  }
  // @ts-ignore
  getDateObject(date) {
    let value = 0;
    const dateObj = {};
    // @ts-ignore
    const dateArr = [];
    // @ts-ignore
    date.forEach((d) => {
      // @ts-ignore
      if (!dateObj[d]) {
        // @ts-ignore
        dateArr.push(d);
        // @ts-ignore
        dateObj[d] = {
          value,
          target: d,
        };

        value = value + 1;
      }
    });
    // @ts-ignore
    return { dateObj, dateArr };
  }
  // @ts-ignore
  setTime(data) {
    let newNowTime = 0;
    // @ts-ignore
    const timeArr = this.getDateArr(data);
    timeArr.push('nowTime');
    /*
      @dingyubo
      http://jira.4paradigm.com/browse/PHTCS-3867
      http://jira.4paradigm.com/browse/PHTCS-3515
      http://jira.4paradigm.com/browse/PHTEE-6077
      仨bug是一个问题 是由于个别谷歌浏览器中的sort方法实现不一致引起的
    */
    const sortTimeArr = sortBy(timeArr, (time) => {
      let t1 = time;
      if (time === 'nowTime') {
        // 当time是nowTime的时候 给他先弄成时间戳
        t1 = +new Date();
        if (t1 > newNowTime) {
          // 让newNowTime等于比较大的nowTime 是为了后面如果有未来时刻的话使用
          newNowTime = t1;
        }
      } else if (
        typeof time === 'string' &&
        time.includes('未来时刻')
      ) {
        // 未来时刻都是以'未来时刻1' '未来时刻2' 这种方式表示的
        // 所以使用最新的newNowTime 加上 '未来时刻x'中的'x' 来表示一个更大的时间
        if (!newNowTime) {
          newNowTime = +new Date();
        }
        t1 = newNowTime + Number(time.replace(/未来时刻/g, '') + 10000);
      } else {
        // 如果time是正常的日期格式的话 给他弄成时间戳
        t1 = +new Date(moment(t1).format());
      }
      // 根据时间戳排序
      return t1;
    });
    const { dateObj, dateArr } = this.getDateObject(sortTimeArr);
    this.setState({
      dateArr,
      dateObj,
      futureData: 1,
      spansTarget: 1,
    });

    return { dateObj, dateArr };
  }
  // @ts-ignore
  getOptionData(data) {
    // @ts-ignore
    const { plies, dateObj } = this.state;
    const auxiliary = {};
    // @ts-ignore
    const series = [];
    const yData = [];
    // @ts-ignore
    data.forEach((d) => {
      Object.keys(plies).forEach((plie, index) => {
        if (plie !== 'stage') {
          // @ts-ignore
          if (auxiliary[plie]) {
            // @ts-ignore
            auxiliary[plie].push('-');
          } else {
            // @ts-ignore
            auxiliary[plie] = ['-'];
          }
        }
      });
    });
    // @ts-ignore
    data.forEach((d, i) => {
      if (d.name) yData.unshift(`${d.name}(${d.epoch})`);
      if (d.startTime) {
        const serie = this.getChildSerie(data, d, i, 'stageSpans');
        series.push(serie);
        // @ts-ignore
        auxiliary.stageSpans[i] = dateObj[d.startTime].value;
      } else {
        // @ts-ignore
        this.getChildren(data, i, d, series, auxiliary, 0);
      }
    });
    Object.keys(auxiliary).forEach((a) => {
      // @ts-ignore
      auxiliary[a] = auxiliary[a].reverse();
      // @ts-ignore
      auxiliary[a].unshift('-');
    });
    yData.unshift('');
    // @ts-ignore
    sortBy(series, (s) => {
      return s && s.stack && s.stack.length;
    });
    // @ts-ignore
    this.getAssistant(series, auxiliary);
    return {
      yData,
      // @ts-ignore
      series,
    };
  }
  // @ts-ignore
  getChildren(data, index, child, series, auxiliary) {
    // @ts-ignore
    const spans = child.spans || [];
    // @ts-ignore
    spans.forEach((s, i) => {
      // @ts-ignore
      const serie = this.getChildSerie(data, s, index);
      if (i === 0) {
        auxiliary[s.spansTarget][index] = this.state.dateObj[s.startTime].value;
      }
      series.push(serie);
      this.getChildren(data, index, s, series, auxiliary);
    });
    return { series, auxiliary };
  }
  // @ts-ignore
  getChildSerie(data, span, index, spansTaget) {
    // @ts-ignore
    const { dateObj, plies, realTime } = this.state;
    let color = '';
    let title = span.name;
    if (span.status === 'START') {
      let progress = span.startInfo.progress || 0;
      progress = (Number(progress) * 100).toFixed(1);
      progress = `${progress}%`;
      title = progress;
    }
    // @ts-ignore
    color = stateColor[span.status] || stateColor['WAITING'];
    // @ts-ignore
    const hoverColor =
      // @ts-ignore
      stateHoverColor[span.status] || stateHoverColor['WAITING'];
    const dataToShow = [];
    // @ts-ignore
    const statusColor = [];
    // @ts-ignore
    const value = [];
    // @ts-ignore
    data.forEach((d, i) => {
      if (i === data.length - index - 1) {
        let showData =
          dateObj[span.endTime].value - dateObj[span.startTime].value;
        if (showData === 0) showData = 0.5;
        value.push(i);
        dataToShow.push(showData);
        statusColor.push(color);
      } else {
        dataToShow.push('-');
        statusColor.push('rgba(0, 0, 0, 0)');
      }
    });
    dataToShow.unshift('-');
    statusColor.unshift('-');
    let barWidth = 28;
    const pliesArr = Object.keys(plies);
    if (pliesArr.length >= 2) barWidth = barWidth - (pliesArr.length - 2) * 10;
    const target = spansTaget || span.spansTarget;
    if (target === 'stageSpans') barWidth = barWidth + 2;
    const obj = this;
    const toolTipString = this.getToolTips(span);
    const serie = {
      barWidth,
      // @ts-ignore
      value,
      span,
      name: span.name,
      type: 'bar',
      stack: target,
      tooltip: {
        formatter: () => {
          if (realTime) {
            // @ts-ignore
            if (obj.timer) {
              // @ts-ignore
              clearTimeout(obj.timer);
              // @ts-ignore
              obj.timer = null;
            }
            // @ts-ignore
            obj.timer = setTimeout(() => {
              obj.getData();
            },                     5000);
          }
          return toolTipString;
        },
      },

      label: {
        normal: {
          show: true,
          // @ts-ignore
          formatter: (val) => {
            // @ts-ignore
            const index = val && val.value && val.value[3];
            // @ts-ignore
            const serie = this.series && this.series && this.series[index];
            // @ts-ignore
            const width = parseInt(serie && serie.value && serie.value[4], 10);
            // @ts-ignore
            const titleWidth = parseFloat(getTextWidth(title));
            // 加2是给临界值 防止条条的宽度约等于文字宽度的情况时 文字会稍微超过条条宽度1px左右
            if (width > titleWidth + 2) return title;
            if (width < theMinLimitWidth) return '';
            if (width < theCapitalWidth + theMinLimitWidth) return '...';
            const titleLen = title.length;
            let customIndex = titleLen;
            while (customIndex -= 1) {
              // @ts-ignore
              const temporaryWidth =
                customIndex * theLowercaseWidth +
                theCapitalWidth +
                theMinLimitWidth;
              if (width > temporaryWidth) break;
            }
            return `${title.slice(0, customIndex)}...`;
          },
        },
      },

      itemStyle: {
        emphasis: {
          // @ts-ignore
          color(params) {
            // @ts-ignore
            const colorList = statusColor;
            return colorList[params.dataIndex];
          },
          borderWidth: 1,
          barBorderColor: '#fff',
        },

        normal: {
          color: hoverColor,
          borderWidth: 1,
          barBorderColor: '#fff',
        },
      },

      data: dataToShow,
      // @ts-ignore
    };

    return serie;
  }
  // @ts-ignore
  getToolTips(span) {
    let toolTipsString = `<div><h3 style="color: #ffffff; font-size:
     12px; line-height: 14px">${span.name}</h3>`;
    /*
      @dingyubo
      http://jira.4paradigm.com/browse/PHTEE-6299
      原来这里没加else if 导致startTime的条件多次被匹配 多次被修改
    */
    if (span.startTime) {
      let startTime = span.startTime;
      if (startTime.indexOf('now') !== -1) {
        startTime = '当前时刻';
      } else if (
        startTime.indexOf('未来时刻') === -1 &&
        startTime.indexOf('未来时刻') === -1
      ) {
        startTime = getCreateTimeFromTimestamp(+new Date(startTime));
      }
      toolTipsString = '<p>&nbsp;&nbsp;&nbsp;&nbsp;开始时间:&nbsp;&nbsp;</p>';
    }
    if (span.endTime) {
      let endTime = span.endTime;
      if (endTime.indexOf('now') !== -1) {
        endTime = '--';
      } else if (
        endTime.indexOf('未来时刻') === -1 &&
        endTime.indexOf('--') === -1
      ) {
        endTime = getCreateTimeFromTimestamp(+new Date(endTime));
      }
      toolTipsString = '<p>&nbsp;&nbsp;&nbsp;&nbsp;结束时间:&nbsp;&nbsp;</p>';
    }
    if (span.startInfo && Object.keys(span.startInfo).length !== 0) {
      toolTipsString = `${toolTipsString}<h5 style="color: #fff">&nbsp;&nbsp;&nbsp;
      &nbsp;
      startInfo:</h5>`;
      const arr = Object.keys(span.startInfo);
      // @ts-ignore
      const sortArr = arr.sort((a, b) => {
        // @ts-ignore
        return a.split('')[0].charCodeAt() - b.split('')[0].charCodeAt();
      });
      sortArr.forEach((param) => {
        toolTipsString = `${toolTipsString}<p>&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        ${param}: ${span.startInfo[param]}</p>`;
      });
    }
    if (span.endInfo && Object.keys(span.endInfo).length !== 0) {
      const arr = Object.keys(span.endInfo);
      // @ts-ignore
      const sortArr = arr.sort((a, b) => {
        // @ts-ignore
        return a.split('')[0].charCodeAt() - b.split('')[0].charCodeAt();
      });
      toolTipsString = `${toolTipsString}<h5 style="color: #fff">&nbsp;&nbsp;&nbsp;&nbsp;
      endInfo:</h5>`;
      sortArr.forEach((param) => {
        toolTipsString = `${toolTipsString}<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        ${param}: ${span.endInfo[param]}</p>`;
      });
    }
    toolTipsString = `${toolTipsString}</div>`;
    return toolTipsString;
  }

  // @ts-ignore
  getAssistant(series, auxiliary) {
    Object.keys(auxiliary).forEach((target, index) => {
      const assistant = {
        name: '辅助',
        type: 'bar',
        stack: target,
        tooltip: {
          show: false,
        },

        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },

          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },

        data: auxiliary[target],
      };

      series.unshift(assistant);
    });
  }
  // @ts-ignore
  handleCustomRenderSeriesValue(series, xDataArr) {
    const auxiliary = series[0];
    if (
      auxiliary &&
      auxiliary.name === '辅助'
    ) {
      const auxiliaryData = auxiliary.data || [];
      const len = series.length;
      let index = 1;
      for (let i = 1; i < len; i += 1) {
        const prevSeries = series[i - 1];
        const currentSeries = series[i];
        const prevVal = prevSeries.value || [];
        const currentVal = currentSeries.value || [];
        const currentData = currentSeries.data || [];
        const currentDataIndex = findIndex(
          currentData,
          a => typeof a === 'number',
        );
        const currentSeriesX = currentData[currentDataIndex];
        const initWidth = currentSeriesX * 2;
        if (currentVal[0] === prevVal[0]) {
          const span = currentSeries.span || {};
          const startTime = getCreateTimeFromTimestamp(
            +new Date(span.startTime),
          );
          const startTimeIndex = findIndex(xDataArr, a => a === startTime);
          const start = prevSeries.value[2];
          if (startTimeIndex > start) {
            currentVal.push(startTimeIndex, startTimeIndex + initWidth);
          } else {
            currentVal.push(start, start + initWidth);
          }
        } else {
          const start = auxiliaryData[auxiliaryData.length - index++] * 2;
          currentVal.push(start, start + initWidth);
        }
        currentVal[3] = i;
      }
    }
  }

  // @ts-ignore
  formatX(dataArr) {
    let itemIndex = 0;
    let tempArr = new Array(dataArr.length * 2).fill(null);
    tempArr = tempArr.map((item, index) => {
      if (index % 2) {
        return '';
      }
      {
        const time = dataArr[itemIndex++];
        if (time === 'nowTime') {
          return '现在时刻';
        }
        if (
          (time || '').includes('未来时刻')
        ) {
          return time;
        }
        return getCreateTimeFromTimestamp(time);
      }
    });
    return tempArr;
  }

  // @ts-ignore
  renderItem = (params, api) => {
    const categoryIndex = api.value(0);
    const start = api.coord([api.value(1), categoryIndex]);
    const end = api.coord([api.value(2), categoryIndex]);
    const height = 30;
    const width = end[0] - start[0];
    // @ts-ignore
    const serie = this.series && this.series[api.value(3)];
    if (serie) serie.value[4] = width;
    const rectShape = echarts.graphic.clipRectByRect(
      {
        height,
        x: start[0],
        y: start[1] - height / 2,
        width: width - 0.5,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      },
    );

    return (
      rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style(),
      }
    );
  }

  // @ts-ignore
  initTable(data) {
    const useData = Object.assign([], data);
    const { dateObj, dateArr } = this.setTime(useData);
    const { yData, series } = this.getOptionData(useData);
    const name = `${location.hash.slice(2).replace(/\//gi, '_')}_${moment(
      +new Date(),
    ).format()}`;
    const xDataArr = this.formatX(dateArr);
    this.handleCustomRenderSeriesValue(series, xDataArr);
    // @ts-ignore
    this.series = series;
    // @ts-ignore
    const dataZoomItem = {
      show: true,
      filterMode: 'filter',
      handleIcon:
        `M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.
        3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.
        4z M13.3,19.6H6.7v-1.4h6.6V19.6z`,
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      },
    };
    let maxLongTitle = (useData || [])
      .reduce((a: string, b: any) => (a.length > b.name.length ? a : b.name), '');
    const maxLongTitleWidth = Math.ceil(parseFloat(getTextWidth(maxLongTitle, '14px') || ''));
    const grid = { height: 350, left: maxLongTitleWidth || 50 };
    const options = {
      grid,
      toolbox: {
        feature: {
            dataZoom: {
              title: {
                zoom: '区域缩放', 
                back: '区域还原', //"restore area zooming"
              }
            }, // 区域缩放的图标
            restore: {
              title: '还原',  //"restore area zooming"
            }, // 还原的图标
            saveAsImage: {
            // 下载的图标
              name,
              title: '保存为图片'  //"restore area zooming"
            } ,
            show: true,
        },
      },

      tooltip: {
        show: true,
        triggerOn: 'mousemove',
        enterable: true,
        confine: true,
      },

      dataZoom: [
        {
          ...dataZoomItem,
          id: 'dataZoomX',
          xAxisIndex: 0,
          // @ts-ignore
          start: this.xStart || 0,
          // @ts-ignore
          end: this.xEnd || 100,
        },

        {
          ...dataZoomItem,
          id: 'dataZoomY',
          yAxisIndex: 0,
          // @ts-ignore
          start: this.yStart || 0,
          // @ts-ignore
          end: this.yEnd || 100,
        },
      ],

      xAxis: {
        boundaryGap: false,
        splitLine: {
          show: true,
          // @ts-ignore
          interval: (index, val) =>
            val.includes('现在时刻')
              ? false
              : val,
        },

        type: 'category',
        // @ts-ignore
        data: xDataArr,
        axisTick: {
          alignWithLabel: true,
          // @ts-ignore
          interval: (index, val) => val,
        },

        axisLabel: {
          rotate: -30,
          // @ts-ignore
          formatter: val => val,
        },
      },

      yAxis: {
        boundaryGap: true,
        type: 'category',
        data: yData.slice(1),
        axisTick: {
          alignWithLabel: true,
        },
      },

      series: [
        {
          type: 'custom',
          renderItem: this.renderItem,
          encode: {
            x: [1, 2],
            y: 0,
          },

          // @ts-ignore
          data: series.slice(1),
          markLine: {
            symbol: 'none',
            silent: true,
            lineStyle: {
              type: 'solid',
              color: '#16c4c6',
            },

            label: { show: true },
            data: [
              {
                lineStyle: {
                  type: 'dashed',
                  color: '#16c4c6',
                },

                label: {
                  show: false,
                },

                // name: '当前时刻',
                xAxis: this.state.dateObj.nowTime.value * 2 || 0,
              },
            ],
          },
        },
      ],
    };

    // @ts-ignore
    this.myEcharts && this.myEcharts.clear && this.myEcharts.clear();
    // @ts-ignore
    this.myEcharts &&
      // @ts-ignore
      this.myEcharts.setOption &&
      // @ts-ignore
      this.myEcharts.setOption(options, true);
  }
  renderRealTime() {
    return (
      <div className={style.refresh}>
        <Button
          size="small"
          onClick={() => this.getData(this.props.renderCallback)}
        >
          刷新
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span className={style.switchWord}>
          自动更新
        </span>
        &nbsp;&nbsp;
        <Switch
          size="small"
          className={style.switch}
          defaultChecked={true}
          onChange={this.handleOnAutoUpdateTrace}
        />
      </div>
    );
  }
  // @ts-ignore
  handleOnAutoUpdateTrace(params) {
    if (this.props.stop) return;
    this.setState({ realTime: params }, () => {
      if (!params) {
        // @ts-ignore
        clearTimeout(this.timer);
        // @ts-ignore
        this.timer = null;
      } else {
        const rerenderCallback = this.props.renderCallback;
        // @ts-ignore
        this.timer = setInterval(() => this.getData(rerenderCallback), 5000);
      }
    });
  }

  render() {
    // @ts-ignore
    const { startColor, loading } = this.state;
    const color = startColor === '#0065FF' ? '#8EE5EE' : '#0065FF';
    const loadingStyle = loading ? { visibility: 'hidden' } : {};
    return (
      <div className={style.echarts}>
        {!this.props.stop && this.renderRealTime()}
        <div className={style.show}>
          <div className={style.nowLine} />
            当前时刻
          <div className={style.succeeded} />
            运行成功
          <div className={style.failed} />
            运行失败
          <div className={style.running} />
            正在运行
          <div className={style.waiting} />
            未运行
          </div>
        <div
          id="echarts"
          className={style.wrapper}
          style={loadingStyle as any}
        />
      </div>
    );
  }
}

export default React.memo(WaterfallPlot);
