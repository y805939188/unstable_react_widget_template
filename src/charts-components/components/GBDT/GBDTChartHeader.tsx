// @ts-nocheck
import React from 'react';
// import { RadioGroup, InputNumber } from 'lamma-ui';
import { GBDTMODEL } from './constants';

const options = [
    '总样本数',
    '正样本数',
    '负样本数',
];

export default class GBDTChartHeader extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            linkLegend: GBDTMODEL.INS_NUM,
            treeIndex: 1,
        };
        this.onChangeTreeIndex = this.onChangeTreeIndex.bind(this);
        this.onChangeLinkLegend = this.onChangeLinkLegend.bind(this);
    }

    onChangeLinkLegend(value) {
        if (this.props.onLinkLegendChange) this.props.onLinkLegendChange(value);
        this.setState({
            linkLegend: value,
        });
    }

    onChangeTreeIndex(value) {
        if (this.props.onTreeIndexChange) this.props.onTreeIndexChange(value);
        this.setState({
            treeIndex: value,
        });
    }

    render() {
        const { treeIndex, linkLegend } = this.state;
        return (
            <div className="gbdt-chart-header">
                <div className="treeindex-wrapper">
                    <span>选择树图:</span>
                    <span>error...请联系@dingyubo</span>
                    {/* <InputNumber
                        min={1}
                        max={this.props.treeCount}
                        defaultValue={1}
                        value={treeIndex}
                        step={1}
                        onChange={this.onChangeTreeIndex}
                    /> */}
                </div>
                <div className="linklegend-wrapper">
                    <span>'线的含义:'</span>
                    <span>error...请联系@dingyubo</span>
                    {/* <RadioGroup
                        options={options}
                        onChange={this.onChangeLinkLegend}
                        value={linkLegend}
                    /> */}
                </div>
            </div>
        );
    }
}
