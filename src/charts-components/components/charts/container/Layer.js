export default class Layer {
    constructor($parent, className) {
        this.$parent = $parent;
        this.className = className;
        return this.render();
    }

    render() {
        const className = this.className ? `pcharts-layer ${this.className}` : 'pcharts-layer';
        const $container = this.$parent
            .insert('g')
            .attr('class', className);
        return $container;
    }
}
