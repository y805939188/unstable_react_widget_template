// @ts-nocheck
import React from 'react';

export default class LRTooltip extends React.Component {
    componentDidUpdate() {
        this.updateTooltipPosition();
    }

    updateTooltipPosition() {
        const { activeData } = this.props;
        if (!activeData) return;
        const { id } = this.props;
        const $chart = document.getElementById(id);
        const $tooltip = $chart.getElementsByClassName('lr-tooltip')[0];
        const { y } = this.calcTooltipPosition($chart, $tooltip, activeData.position);
        $tooltip.setAttribute('style', `transform: translate(-50%, ${y}px)`);
    }

    calcTooltipPosition($chart, $tooltip, position) {
        let y;
        const gap = 20;

        const boundingClientRect = $chart.getBoundingClientRect();
        const chartTop = boundingClientRect.top;
        const chartHeight = boundingClientRect.height;

        const tooltipHeight = $tooltip.clientHeight;
        const tooltipEndY = (position.y - chartTop) + tooltipHeight;

        if (tooltipEndY > (chartHeight - gap)) {
            /* ---弹框显示在上方---*/
            y = position.y - chartTop - tooltipHeight - gap;
        } else {
            /* ---弹框显示在下方---*/
            y = (position.y - chartTop) + gap;
        }
        return {
            x: position.x,
            y,
        };
    }

    render() {
        const item = this.props.activeData;
        if (!item) return null;
        const { name, tipWithoutZero } = item;
        const {
            min, max, quantile25, quantile75, medium, mean, variance,
        } = tipWithoutZero;
        const className = this.props.showTooltip ? 'lr-tooltip show' : 'lr-tooltip hide';
        const tooltipStyle = {
            transform: 'translate(-50%, -99999px)',
        };
        return (
            <div className={className} style={tooltipStyle}>
                <table>
                    <thead>
                        <tr>
                            <th>{name}</th>
                            <th>最小值</th>
                            <th>后25%</th>
                            <th>中位数</th>
                            <th>前25%</th>
                            <th>最大值</th>
                            <th>平均值</th>
                            <th>方差</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>权重</td>
                            <td>{min.weight && Number(min.weight).toFixed(2)}</td>
                            <td>{quantile25.weight && Number(quantile25.weight).toFixed(2)}</td>
                            <td>{medium.weight && Number(medium.weight).toFixed(2)}</td>
                            <td>{quantile75.weight && Number(quantile75.weight).toFixed(2)}</td>
                            <td>{max.weight && Number(max.weight).toFixed(2)}</td>
                            <td>{mean.weight && Number(mean.weight).toFixed(2)}</td>
                            <td>{variance && Number(variance).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>特征值</td>
                            <td>{min.value}</td>
                            <td>{quantile25.value}</td>
                            <td>{medium.value}</td>
                            <td>{quantile75.value}</td>
                            <td>{max.value}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

LRTooltip.defaultProps = {
    showTooltip: false,
    activeData: null,
};
