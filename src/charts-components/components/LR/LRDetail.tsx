// @ts-nocheck
import React from 'react';
// import { RadioGroup } from 'lamma-ui';
import { Circle } from '../charts';

const strokeColor = '#00adaf';

export default class LRDetail extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            scoreCardName: 'top500',
        };
    }

    componentDidMount() {
        const $nonZeroRatioCicle = document.getElementById('lr-circle-nonZeroRatio');
        const nonZeroRatioCicleProps = {
            $dom: $nonZeroRatioCicle,
            strokeColor,
        };
        this.nonZeroRatioCicle = new Circle(nonZeroRatioCicleProps);

        const $featureRatioCircle = document.getElementById('lr-circle-featureRatio');
        const featureRatioCircleProps = {
            $dom: $featureRatioCircle,
            strokeColor,
        };
        this.featureRatioCircle = new Circle(featureRatioCircleProps);
    }

    componentDidUpdate() {
        const { nonZeroRatio, featureRatio } = this.props.data;
        if (this.nonZeroRatioCicle) this.nonZeroRatioCicle.update(nonZeroRatio);
        if (this.featureRatioCircle) this.featureRatioCircle.update(featureRatio);
    }

    onChangeScoreCardName(value) {
        this.setState({
            scoreCardName: value,
        });
    }

    onSlotClose() {
        if (this.props.onClose) this.props.onClose();
        // 很trick的方式改掉选中的状态
        const $clickeds = document.querySelector(`#${this.props.id} .row.selected`);
        for (let i = 0; i < $clickeds.length; i += 1) {
            $clickeds[i].className = 'row';
        }
    }

    download() {
        const { slot } = this.props.data;
        if (this.props.download) this.props.download(slot);
    }

    renderScoreCard() {
        const featureDetail = this.props.data;
        const { scoreCardName } = this.state;
        const details = featureDetail[scoreCardName];
        if (!details) return null;
        return details.map((item, index) => {
            const weight = Number(item.weight).toFixed(6);
            return (
                <tr key={`${item.weight}_${index}`} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
                    <td title={item.value}>{item.value}</td>
                    <td title={weight}>{weight}</td>
                </tr>
            );
        });
    }

    render() {
        const showFeatureDetail = this.props.show;
        const featureDetail = this.props.data;
        const { name, featureCount } = featureDetail;
        const { scoreCardName } = this.state;
        const { showLoading } = this.props;
        return (
            <div id="lr-feature-detail" className={showFeatureDetail ? 'show' : 'hide'}>
                <div className="close" role="presentation" onClick={() => this.onSlotClose()} />
                <h3 className="name">{name}</h3>
                <p className="feature-count">特征维度：{featureCount}</p>
                <div id="lr-detail-graph">
                    <div className="lr-circle-nonZeroRatio-container">
                        <div id="lr-circle-nonZeroRatio" />
                        <p className="nonZeroRatio-label">有效特征占比</p>
                    </div>
                    <div className="lr-circle-featureRatio-container">
                        <div id="lr-circle-featureRatio" />
                        <p className="featureRatio-label">特征维度/总特征维度</p>
                    </div>
                </div>
                <div className="row flex">
                    <div className="col-8 detail-select">
                        {/* <RadioGroup
                            options={[{
                                value: 'top500',
                                text: '权重前500',
                            }, {
                                value: 'bottom500',
                                text: '权重后500',
                            }]}
                            value={scoreCardName}
                            onChange={value => this.onChangeScoreCardName(value)}
                        /> */}
                    </div>
                    {/* <div className="col-4 download" role="presentation" onClick={() => this.download()}>
                        <span className="idownload" />
                        下载全部
                    </div> */}
                </div>
                {!showLoading ?
                    <div className="detail-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>特征值</th>
                                    <th>权重</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderScoreCard()}</tbody>
                        </table>
                    </div>
                    :
                    <div className="detail-loading">
                        正在加载中，请稍后...
                    </div>
                }
            </div>
        );
    }
}

LRDetail.defaultProps = {
    id: 'lr-graph',
};

