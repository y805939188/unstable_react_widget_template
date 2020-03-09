import * as d3Selection from 'd3-selection';
import { throwError } from '../util/LogUtil.js';

const defaultProps = {
    position: 'LeftTop',
};
export default class Legend {
    constructor(props) {
        this.props = Object.assign({}, defaultProps, props);
    }

    static getDisplayName() {
        return 'Legend';
    }

    setParent($parent) {
        this.$parent = $parent;
    }

    getWrapperStyle() {
        let style = 'background-color: #fff; padding: 12px; color: #7f7f7f;';
        if (this.props.position === 'LeftTop') {
            style += 'position: absolute; left: 30px; top: 20px';
        }
        return style;
    }

    render() {
        const $divDom = this.$parent;
        if (!$divDom) throwError('can\'t find dom');
        this.$container = d3Selection.select($divDom)
            .insert('div')
            .attr('class', 'pcharts-legend-wrapper')
            .attr('style', this.getWrapperStyle());
        if (this.props.title) {
            this.$container
                .append('div')
                .html(this.props.title)
                .attr('style', 'font-size: 14px; margin-left: 20px');
        }
        if (this.props.data) {
            const $legendItem = this.$container.selectAll('.legend-item')
                .data(this.props.data)
                .enter()
                .append('div')
                .attr('class', 'legend-item')
                .attr('style', 'margin-top: 8px');
            $legendItem.append('span')
                .attr('style', d => `display: inline-block; width: 12px; height: 12px; background-color: ${d.color}; margin-right: 12px;`);
            $legendItem.append('span')
                .html(d => d.text);
        }
    }
}
