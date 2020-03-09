// @ts-nocheck
import React from 'react';
// import LRChartHeader from './LRChartHeader';
import LRChart from './LRChart';
import LRDetail from './LRDetail';
import ErrorLRChart from './ErrorLRChart';
import util from './util.js';

import './LR.less';

export default class LR extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            data: util.getChartData(this.props.data),
            showFeatureDetail: false,
            showLoading: false,
        };
        this.featureDetail = {
            slot: 0,
            name: '',
            featureCount: 0,
            nonZeroRatio: 0,
            featureRatio: 0,
            top500: null,
            bottom500: null,
        };
        /* 记录点击的特征名slot，避免重复点击同一个slot时重复发送请求 */
        this.clickSlot = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.featureDetail !== this.props.featureDetail) {
            this.setState({
                showLoading: false,
            });
        }
    }

    onDataChange(data) {
        this.setState({
            data,
        });
    }

    onSlotClick(item) {
        // 点击同一个特征名不做处理
        // if (this.clickSlot === item.slot) return
        this.featureDetail = item;
        this.clickSlot = item.slot;
        if (this.props.onFeatureClick) {
            this.props.onFeatureClick(item.slot);
        }
        this.setState({
            showLoading: true,
            showFeatureDetail: true,
        });
        /* 关闭后将点击的slot置为初始值null */
        this.clickSlot = null;
    }

    onSlotClose() {
        this.setState({
            showFeatureDetail: false,
        });
    }

    render() {
        if (!this.props.data) return null;
        const { data, showFeatureDetail, showLoading } = this.state;
        const { featureDetail } = this.props;
        this.featureDetail.top500 = featureDetail && featureDetail.top500;
        this.featureDetail.bottom500 = featureDetail && featureDetail.bottom500;
        if (data.length === 0) {
            return (
                <ErrorLRChart />
            );
        }
        return (
            <div id="lr" className="lr-container">
                {/* <LRChartHeader 
                    data={util.getChartData(this.props.data)}
                    onChange={newData => this.onDataChange(newData)}
                /> */}
                <LRChart
                    featureDimension={this.props.data.featureDimension}
                    data={data}
                    onClick={slot => this.onSlotClick(slot)}
                    styleColors={this.props.styleColors}
                />
                <LRDetail
                    showLoading={showLoading}
                    show={showFeatureDetail}
                    onClose={() => this.onSlotClose()}
                    data={this.featureDetail}
                    download={this.props.download}
                />
            </div>
        );
    }
}
