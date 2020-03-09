// @ts-nocheck
import React from 'react';
import util from './util.js';
import * as d3Selection from 'd3-selection';
import LRTooltip from './LRTooltip';
import LRBoxplotAxis from './LRBoxplotAxis';

const boxplotRange = [20, 396];
const nonZeroRatioRange = [50, 128];
const featureRatioRange = [50, 128];
const height = 33;
const percent = 0.3;
const progressHeight = height * percent;
const r = progressHeight / 2;
const y1 = (height - progressHeight) / 2;
const y3 = ((height - progressHeight) / 2) + progressHeight;
const x1 = nonZeroRatioRange[0] + (progressHeight / 2);
const x2 = nonZeroRatioRange[1] - (progressHeight / 2);
const pathBack = `M${x1} ${y1}H${x2} A ${r} ${r} 0 1 1 ${x2} ${y3}H${x1} A ${r} ${r} 0 1 1 ${x1} ${y1}`;

export default class LRChart extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            showTooltip: false,
            activeData: null,
            boxplotDomain: util.getDomainByDataKey(this.props.data, 'withoutZero'),
        };
        this.boxplotAxis = this.getBoxplotData2Axis(this.state.boxplotDomain);
        this.nonZeroRatioAxis = this.getNonZeroRatioData2Axis();
        this.featureRatioAxis = this.getFeatureRatioData2Axis();

        // brush需要的是初始坐标转换，domain是坐标轴最大最小值（坐标轴根据数据的domain进行了优化）
        this.initBoxplotAxis = this.boxplotAxis;
        this.initBoxplotDomain = this.getBrushData();
    }

    onRowClick(item, event) {
        if (this.props.onClick) this.props.onClick(item);

        // 将clicked置为选中状态
        const $clickeds = document.getElementById(this.props.id).getElementsByClassName('row selected');
        for (let i = 0; i < $clickeds.length; i += 1) {
            $clickeds[i].className = 'row';
        }
        const $row = event.currentTarget;
        $row.className = 'row selected';
    }

    onBrushed() {
        if (d3Selection.event.sourceEvent && d3Selection.event.sourceEvent.type === 'zoom') return;
        const { selection } = d3Selection.event;
        const s = selection ? [selection[0], selection[1]] : this.initBoxplotAxis.range();
        const boxplotDomain = s.map(this.initBoxplotAxis.invert, this.initBoxplotAxis);
        this.boxplotAxis = this.getBoxplotData2Axis(boxplotDomain);
        this.setState({
            boxplotDomain,
        });
    }

    getBrushData() {
        const ticks = this.boxplotAxis.ticks(5);
        const len = ticks.length;
        return [ticks[0], ticks[len - 1]];
    }

    getBoxplotData2Axis(domain) {
        return util.domainToRangeNice(domain, boxplotRange);
    }

    getNonZeroRatioData2Axis() {
        let domain = util.getDomainByDataKey(this.props.data, 'nonZeroRatio');
        domain = [0, domain[1]];
        return util.domainToRange(domain, nonZeroRatioRange);
    }

    getFeatureRatioData2Axis() {
        let domain = util.getDomainByDataKey(this.props.data, 'featureRatio');
        domain = [0, domain[1]];
        return util.domainToRange(domain, featureRatioRange);
    }

    showTooltip(activeData, event) {
        if (event) event.stopPropagation();
        const newActiveData = activeData;
        newActiveData.position = {
            x: event.clientX,
            y: event.clientY + 10,
        };
        this.setState({
            activeData: newActiveData,
            showTooltip: true,
        });
    }

    hideTooltip() {
        this.setState({
            showTooltip: false,
        });
    }

    renderChart() {
        const { data } = this.props;
        return (
            <div className="chart-wrapper">
                <div
                    className="row table-header flex"
                >
                    <div className="td">序号</div>
                    <div className="td">特征名</div>
                    <div className="td">箱线图</div>
                    <div className="td">有效特征占比</div>
                    <div className="td">特征维度占比</div>
                </div>
                {data.map((item, index) => this.renderRows(item, index))}
            </div>
        );
    }


    renderRows(item, index) {
        return (
            <div
                key={`${item.name}_${item.slot}`}
                role="presentation"
                className="row"
                onMouseOver={e => this.showTooltip(item, e)}
                onMouseOut={() => this.hideTooltip()}
                onClick={e => this.onRowClick(item, e)}
            >
                <div className="td">{index + 1}</div>
                <div className="td" title={item.name}>{item.name}</div>
                <div className="td">{this.renderBoxplot(item)}</div>
                <div className="td">{this.renderNonZeroRatio(item)}</div>
                <div className="td">{this.renderFeatureRatio(item)}</div>
            </div>
        );
    }

    renderBoxplot(item) {
        const colors = this.props.styleColors;
        const startY = (height * (1 - percent)) / 2;
        const gap = height * percent;
        const whisker1 = this.boxplotAxis(item.withoutZero[0]);
        const whisker2 = this.boxplotAxis(item.withoutZero[4]);
        const q1 = this.boxplotAxis(item.withoutZero[1]);
        const q2 = this.boxplotAxis(item.withoutZero[3]);
        const median = this.boxplotAxis(item.withoutZero[2]);
        const whisker1Path = `M${whisker1} ${startY}V${gap + startY}`;
        const whisker2Path = `M${whisker2} ${startY}V${gap + startY}`;
        const centerPath = `M${whisker1} ${height / 2} H${whisker2} `;
        const quartilePath = `M${q1} ${startY}H${q2} V${gap + startY} H${q1} V${startY}`;
        const medianPath = `M${median} ${startY}V${gap + startY}`;
        const { boxFill } = colors;
        return (
            <svg>
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

    renderNonZeroRatio(item) {
        const colors = this.props.styleColors;
        const xdata = this.nonZeroRatioAxis(item.nonZeroRatio);
        const pathProgress = `M${x1} ${y1}H${xdata} A ${r} ${r} 0 1 1 ${xdata} ${y3}H${x1} A ${r} ${r} 0 1 1 ${x1} ${y1}`;
        return (
            <svg>
                <g>
                    <path className="progress-back" fill={colors.barTrail} d={pathBack} />
                    <path className="progress" fill={colors.barStroke} d={pathProgress} />
                    <text
                        className="progress-text"
                        x={nonZeroRatioRange[1] + 70}
                        y={height / 2}
                        dy="0.3em"
                        textAnchor="end"
                    >
                        {`${(item.nonZeroRatio * 100).toFixed(2)}%`}
                    </text>
                </g>
            </svg>
        );
    }

    renderFeatureRatio(item) {
        const colors = this.props.styleColors;
        const xdata = this.featureRatioAxis(item.featureRatio);
        const pathProgress = `M${x1} ${y1}H${xdata} A ${r} ${r} 0 1 1 ${xdata} ${y3}H${x1} A ${r} ${r} 0 1 1 ${x1} ${y1}`;
        const featureCount = Math.ceil(this.props.featureDimension * item.featureRatio);
        return (
            <svg>
                <g>
                    <path className="progress" fill={colors.barStroke} d={pathProgress} />
                    <text
                        className="progress-text"
                        x={nonZeroRatioRange[1] + 70}
                        y={height / 2}
                        dy="0.3em"
                        textAnchor="end"
                    >
                        {`${(item.featureRatio * 100).toFixed(2)}%`}
                    </text>
                    <text
                        className="progress-text"
                        x={nonZeroRatioRange[1] + 148}
                        y={height / 2}
                        dy="0.3em"
                        textAnchor="end"
                        fill="#b6b6b6"
                    >
                        {featureCount}
                    </text>
                </g>
            </svg>
        );
    }

    render() {
        const { id } = this.props;
        const { showTooltip, activeData } = this.state;
        return (
            <div id={id} className="lrchart">
                {this.renderChart()}
                <LRTooltip showTooltip={showTooltip} activeData={activeData} id={id} />
                <LRBoxplotAxis
                    boxplotAxis={this.boxplotAxis}
                    initBoxplotDomain={this.initBoxplotDomain}
                    onBrushed={() => this.onBrushed()}
                />
            </div>
        );
    }
}

LRChart.defaultProps = {
    id: 'lr-graph',
    styleColors: {
        barTrail: '#dbdbdb',
        barStroke: '#00adaf',
        boxFill: '#00adaf',
        boxLine: '#b6b6b6',
        boxMedian: '#fff',
    },
};

