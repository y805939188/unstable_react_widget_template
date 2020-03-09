// @ts-nocheck
import React from 'react';
// import { CopyText } from 'apollo-widgets';
import copy from 'copy-to-clipboard';
import { GBDTMODEL } from './constants';

export default class GBDTDetail extends React.Component {
    getDecisionRoad() {
        const { decisionRoad } = this.props.detail;
        if (decisionRoad && decisionRoad.length > 0) {
            const list = decisionRoad.map((decision, index) => (
                <p key={index}>{decision}</p>
            ));
            return (
                <div className="road-list">{list}</div>
            );
        }
        return null;
    }

    handleDetail(data) {
        const detail = {
            featureName: data.featureName,
            defvSide: data[GBDTMODEL.DEFV_SIDE] === data.lson ?
                '左边' :
                '右边', // 默认方向
            defvRatio: 1 - (data[GBDTMODEL.VALID_NUM] / data[GBDTMODEL.INS_NUM]),
            gain: data.gain,
            weight: data.weight[0],
            decisionRoad: data.decisionRoad,
            isLeaf: data.is_leaf,
        };
        return detail;
    }

    handleCopy(decisionRoadStr) {
        copy(decisionRoadStr);
    }

    render() {
        const {
            featureName, defvSide, defvRatio, gain, weight, decisionRoad, isLeaf,
        } = this.handleDetail(this.props.detail);
        const decisionRoadStr = decisionRoad && decisionRoad.join('\n');
        return (
            <div className="gbdt-detail">
                <div className="description">
                    {isLeaf ?
                        (
                            <p className="bigger">
                                权重：
                                {weight}
                            </p>
                        )
                        :
                        (
                            <div>
                                <p className="bigger">决策名称：{featureName}</p>
                                <p>缺省值路径：{defvSide}</p>
                                <p>缺省值比例：{(defvRatio * 100).toFixed(6)}%</p>
                                <p>增益：{gain}</p>
                                <p>权重：{weight}</p>
                            </div>
                        )
                    }
                </div>
                <div className="road">
                    <div className="bigger">
                        <span>决策路径：</span>
                        <div className="copy-btn-wrapper">
                            {/* <CopyText text={decisionRoadStr}><span>复制</span></CopyText> */}
                            <span onClick={this.handleCopy.bind(this, decisionRoadStr)}>复制</span>
                        </div>
                    </div>
                    {this.getDecisionRoad()}
                </div>
            </div>
        );
    }
}
