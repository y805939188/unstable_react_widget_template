// @ts-nocheck
import React from 'react';
import GBDTChartHeader from './GBDTChartHeader';
import GBDTChart from './GBDTChart';
import GBDTDetail from './GBDTDetail';
import './GBDT.less';
import { GBDTMODEL } from './constants';

export default class GBDT extends React.Component {
    constructor(...args) {
        super(...args);
        const { data } = this.props;
        this.state = {
            detail: data[0],
            linkLegend: GBDTMODEL.INS_NUM,
            showLoading: false,
        };
        this.onTreeIndexChange = this.onTreeIndexChange.bind(this);
        this.onLinkLegendChange = this.onLinkLegendChange.bind(this);
        this.onNodeHover = this.onNodeHover.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                detail: nextProps.data[0],
                showLoading: false,
            });
        }
    }

    onNodeHover(detail) {
        this.setState({
            detail,
        });
    }

    onTreeIndexChange(value) {
        if (this.props.onTreeIndexChange) {
            // 上报给 ReportStructure.jsx
            this.props.onTreeIndexChange(value);
            this.setState({
                showLoading: true,
            });
        }
    }

    onLinkLegendChange(linkLegend) {
        this.setState({
            linkLegend,
        });
    }

    render() {
        const legend = {
            title: '饼状图图例',
            data: [{
                text: '正样本',
                color: '#31b5b8',
            }, {
                text: '负样本',
                color: '#d6f0f1',
            }],
        };
        const { showLoading, linkLegend } = this.state;
        const { width, height } = this.props;
        return (
            <div id="gbdt" className="gbdt-container">
                {/* <GBDTChartHeader
                    treeCount={this.props.treeCount}
                    onTreeIndexChange={this.onTreeIndexChange}
                    onLinkLegendChange={this.onLinkLegendChange}
                /> */}
                <GBDTChart
                    data={this.props.data}
                    onNodeHover={this.onNodeHover}
                    legend={legend}
                    linkLegend={linkLegend}
                    loading={showLoading}
                    height={height}
                    width={width}
                />
                <GBDTDetail
                    detail={this.state.detail}
                />
            </div>
        );
    }
}
