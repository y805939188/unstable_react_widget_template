// @ts-nocheck
import React from 'react';
import ErrorLRChart from './ErrorLRChart';
import util from './util.js';
import './LRMini.less';

const rowHeight = 36;
const percent = 0.23;
const xuhaoLength = 38;
const maxNameLength = 104;

export default class LRChartMini extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            boxplotWidth: 218,
            displayNumber: 9,
        };
        this.chartData = this.getChartData();
        if (this.chartData.length > 0) {
            this.boxplotDomain = util.getDomainByDataKey(this.chartData, 'withoutZero');
            this.boxplotAxis = this.getBoxplotData2Axis(this.boxplotDomain);
        }
    }
    componentDidMount() {
        // 加载完成后根据父组件的大小自适应调整箱线图的大小；
        if (this.chartData.length > 0) {
            this.layoutAdaption();
        }
    }


    getChartData(displayNumber = this.state.displayNumber) {
        let chartData = util.getChartData(this.props.data);
        chartData.sort((a, b) => -(a.tipWithoutZero.variance - b.tipWithoutZero.variance));
        chartData = chartData.length > displayNumber ?
            chartData.slice(0, displayNumber) : chartData;
        return chartData;
    }

    getBoxplotData2Axis(domain, boxplotWidth = this.state.boxplotWidth) {
        const boxplotRange = [10, (boxplotWidth - 10)];
        return util.domainToRangeNice(domain, boxplotRange);
    }
    getRows(item, index) {
        const { boxplotWidth } = this.state;
        return (
            <div key={`${item.name}_${item.slot}`} className="row flex">
                <div className="td">{index + 1}</div>
                <div className="td" title={item.name}>{item.name}</div>
                <div className="td" style={{ width: `${boxplotWidth}px` }}>{this.getBoxplot(item)}</div>
            </div>
        );
    }

    getBoxplot(item) {
        const colors = this.props.styleColors;
        const startY = (rowHeight * (1 - percent)) / 2;
        const gap = rowHeight * percent;
        const whisker1 = this.boxplotAxis(item.withoutZero[0]);
        const whisker2 = this.boxplotAxis(item.withoutZero[4]);
        const q1 = this.boxplotAxis(item.withoutZero[1]);
        const q2 = this.boxplotAxis(item.withoutZero[3]);
        const median = this.boxplotAxis(item.withoutZero[2]);
        const whisker1Path = `M${whisker1} ${startY}V${gap + startY}`;
        const whisker2Path = `M${whisker2} ${startY}V${gap + startY}`;
        const centerPath = `M${whisker1} ${rowHeight / 2} H${whisker2} `;
        const quartilePath = `M${q1} ${startY}H${q2} V${gap + startY} H${q1} V${startY}`;
        const medianPath = `M${median} ${startY}V${gap + startY}`;
        const boxFill = colors.box ? colors.box : 'url(#boxGradient)';
        return (
            <svg>
                { colors.box ?
                    null :
                    <defs>
                        <linearGradient id="boxGradient" x1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#b988e5" />
                            <stop offset="100%" stopColor="#6152f7" />
                        </linearGradient>
                    </defs>
                }
                <g>
                    <path className="whisker" d={whisker1Path} stroke={colors.boxLine} strokeWidth="1" />
                    <path className="whisker" d={whisker2Path} stroke={colors.boxLine} strokeWidth="1" />
                    <path className="center" d={centerPath} stroke={colors.boxLine} strokeWidth="1" />
                    <path className="quartile" d={quartilePath} fill={boxFill} />
                    <path className="median" d={medianPath} stroke={colors.boxMedian} strokeWidth="2" />
                </g>
            </svg>
        );
    }

    layoutAdaption() {
        const $dom = document.getElementById(this.props.id);
        const width = $dom.offsetWidth;
        const height = $dom.offsetHeight;
        const boxplotWidth = width - xuhaoLength - maxNameLength;
        const displayNumber = Math.ceil(height / rowHeight);
        this.setState({
            boxplotWidth,
            displayNumber,
        });
        this.chartData = this.getChartData(displayNumber);
        this.boxplotDomain = util.getDomainByDataKey(this.chartData, 'withoutZero');
        this.boxplotAxis = this.getBoxplotData2Axis(this.boxplotDomain, boxplotWidth);
    }

    render() {
        const { id } = this.props;
        if (this.chartData.length === 0) {
            return (
                <ErrorLRChart />
            );
        }
        return (
            <div id={id} className="lrchart-mini">
                <div className="chart-wrapper">
                    {this.chartData.map((item, index) => this.getRows(item, index))}
                </div>
            </div>
        );
    }
}

LRChartMini.defaultProps = {
    id: 'lr-graph-mini',
    styleColors: {
        boxLine: '#d5d9dd',
        boxMedian: '#fff',
        box: '#16c4c6',
    },
};
