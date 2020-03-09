import * as d3Selection from 'd3-selection';
import { throwError } from '../util/LogUtil.js';

export default class Surface {
    constructor($divDom) {
        this.$divDom = $divDom;
        return this.render();
    }

    render() {
        if (!this.$divDom) throwError('can\'t find dom');
        const $container = d3Selection.select(this.$divDom)
            .insert('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('class', 'pcharts-surface');
        return $container;
    }
}
