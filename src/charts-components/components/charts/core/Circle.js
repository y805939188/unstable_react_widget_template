import Surface from '../container/Surface.js';
import * as d3 from 'd3';

const defaultProps = {
    ratio: 0,
    radius: 34,
    strokeWidth: 4,
    strokeColor: '#008ae4',
    trailColor: '#ececec',
};

export default class Circle {
    constructor(props) {
        this.props = Object.assign({}, defaultProps, props);
        this.render();
    }

    static getDisplayName() {
        return 'Circle';
    }

    roll(ratio) {
        if (ratio === undefined) return;
        this.$path
            .transition()
            .duration(1000)
            .attrTween('d', () => {
                const interpolate = d3.interpolate(0, 2 * Math.PI * ratio.toFixed(3));
                return t => this.arc({
                    endAngle: interpolate(t),
                });
            });
        this.$ratio
            .text(ratio.toFixed(4));
    }

    render() {
        const {
            ratio, radius, strokeWidth, strokeColor, trailColor,
        } = this.props;
        this.$surface = new Surface(this.props.$dom);

        this.arc = d3.arc()
            .innerRadius(radius - strokeWidth)
            .outerRadius(radius)
            .startAngle(0);

        const $container = this.$surface
            .insert('g')
            .attr('transform', `translate(${radius}, ${radius})`);

        $container.insert('path')
            .attr('fill', trailColor)
            .attr('d', this.arc({ endAngle: 2 * Math.PI }));

        $container.insert('path')
            .attr('class', 'arcPath')
            .attr('fill', strokeColor);

        $container.insert('text')
            .attr('class', 'ratio')
            .attr('stroke', strokeColor)
            .attr('dy', '0.3em')
            .attr('text-anchor', 'middle')
            .text(ratio);

        this.$path = this.$surface.select('.arcPath');
        this.$ratio = this.$surface.select('.ratio');
        this.roll(ratio);
    }

    update(ratio) {
        this.roll(ratio);
    }
}
