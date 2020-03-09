import * as d3Selection from 'd3-selection';
import { throwError } from '../util/LogUtil.js';

const defaultProps = {
    trigger: 'axis',
    triggerColor: 'rgba(0,138,228, 0.1)',
};

export default class Tooltip {
    constructor(props) {
        this.props = Object.assign({}, defaultProps, props);
    }

    static getDisplayName() {
        return 'Tooltip';
    }

    setParent($parent) {
        this.$parent = $parent;
    }

    render() {
        const $divDom = this.$parent;
        if (!$divDom) throwError('can\'t find dom');
        this.$container = d3Selection.select($divDom)
            .insert('div')
            .attr('class', 'pcharts-tooltip-wrapper')
            .style('visibility', 'hidden');
        if (!this.props.content) {
            this.$default = this.$container
                .insert('div')
                .attr('class', 'pcharts-default-tooltip')
                .attr('style', 'margin: 0px; padding: 5px 14px; background-color: rgba(72,72,72,0.8); box-shadow: 0 0 10px 0 rgba(0,0,0,0.5); border-radius: 2px; white-space: nowrap; color: #fff');
        }
        if (this.$default) {
            this.$label = this.$default.insert('p')
                .attr('class', 'pcharts-tooltip-label');
            this.$value = this.$default.insert('div')
                .attr('class', 'pcharts-tooltip-value-container');
        }

        this.activeAxis();
    }

    show(mouse) {
        let { activeCoordinate } = mouse;
        const {
            activeSize,
            activeIndex, activeLabel,
            activeTooltipContent, tickTop, tickGap,
        } = mouse;

        if (!this.props.content) {
            this.activeIndex = activeIndex;
            if (this.$label) this.$label.html(activeLabel);

            const $value = this.$value
                .selectAll('.pcharts-tooltip-value')
                .data(activeTooltipContent);
            $value.enter()
                .insert('p')
                .attr('class', 'pcharts-tooltip-value')
                .html(d => `${d.name}: ${d.playLoad.toString()}`);
            $value
                .html(d => `${d.name}: ${d.playLoad.toString()}`);
            $value.exit()
                .remove();
        } else {
            const dom = this.props.content(activeIndex);
            this.$container
                .html(dom);
        }

        if (this.$axisTrigger) {
            const y = (activeIndex * tickGap) + tickTop;
            this.$axisTrigger
                .style('height', `${tickGap}px`)
                .style('transform', `translate(0px, ${y}px)`)
                .style('visibility', 'visible');
        }

        activeCoordinate = this.getPosition(activeCoordinate, activeSize);
        this.$container
            .attr('style', `z-index: 100000;visibility: visible; position: absolute; top: 0px; transform: translate(${activeCoordinate.x}px, ${activeCoordinate.y}px)`);
    }

    getPosition(activeCoordinate, activeSize = { width: 0, height: 0 }) {
        const canvas = this.$parent.getBoundingClientRect();
        const tooltip = this.$container.node().getBoundingClientRect();
        const newActiveCoordinate = activeCoordinate;
        newActiveCoordinate.y =
            !Math.max(0, (activeCoordinate.y + tooltip.height) - canvas.height) ?
                activeCoordinate.y + activeSize.height :
                activeCoordinate.y - tooltip.height - activeSize.height;
        newActiveCoordinate.x = !Math.max(0, (activeCoordinate.x + tooltip.width) - canvas.width) ?
            activeCoordinate.x + activeSize.width :
            activeCoordinate.x - tooltip.width - activeSize.width;
        return activeCoordinate;
    }

    activeAxis() {
        if (this.props.trigger === 'axis') {
            this.$axisTrigger = d3Selection.select(this.$parent)
                .insert('div')
                .attr('class', 'pcharts-tooltip-axis-trigger')
                .attr('style', `visibility: hidden; position: absolute; top: 0px; left: 0px; width: 100%;cursor: pointer;background-color: ${this.props.triggerColor}`);
        }
    }

    hide() {
        this.$container.style('visibility', 'hidden');
        if (this.$axisTrigger) this.$axisTrigger.style('visibility', 'hidden');
    }
}
