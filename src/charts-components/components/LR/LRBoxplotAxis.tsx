// @ts-nocheck
import React from 'react';
import * as d3Brush from 'd3-brush';
import * as d3Selection from 'd3-selection';

export default class LRBoxplotAxis extends React.Component {
    componentDidMount() {
        this.bindBrush();
    }

    bindBrush() {
        const padding = 20;
        this.$brush = d3Selection.select('.xbrush');
        const { initBoxplotDomain, onBrushed, boxplotAxis } = this.props;
        const startX = boxplotAxis(initBoxplotDomain[0]);
        const endX = boxplotAxis(initBoxplotDomain[1]);

        const brushWidth = 414;
        const brushHeight = 15;

        const brush = d3Brush.brushX()
            .extent([[padding, 0], [brushWidth - padding, brushHeight]])
            .on('brush end', onBrushed);

        this.$brush
            .call(brush)
            .call(brush.move, [startX, endX]);
        this.$brush
            .select('.overlay')
            .attr('fill', '#ececec');
        this.$brush
            .select('.selection')
            .attr('fill', '#777');
        this.$brush
            .selectAll('.handle')
            .attr('fill', '#dbdbdb');
    }

    render() {
        const { boxplotAxis } = this.props;
        const ticks = boxplotAxis.ticks(5);
        const ticksComponet = ticks.map((item) => {
            const d = {
                x: boxplotAxis(item),
                label: item,
            };
            const transform = `translate(${d.x}, 0)`;
            return (
                <g key={`ticks_${d.label}`} className="xaxis-ticks" transform={transform}>
                    <text
                        className="xaxis-ticks-label"
                        textAnchor="middle"
                        dy="1.2em"
                    >
                        {d.label}
                    </text>
                </g>
            );
        });
        return (
            <div className="boxplot-xaxis">
                <svg>
                    <g className="xaxis">
                        {ticksComponet}
                    </g>
                    <g className="xbrush" transform="translate(0, 23)" />
                </svg>
            </div>
        );
    }
}

LRBoxplotAxis.defaultProps = {
    boxplotAxis: () => {},
    initBoxplotDomain: [0, 0],
    onBrushed: () => {},
};
