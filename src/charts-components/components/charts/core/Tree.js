import Surface from '../container/Surface.js';
import Layer from '../container/Layer.js';
import Tooltip from '../component/Tooltip.js';
import Legend from '../component/Legend.js';
import { getLayoutTree, diagonal, toggleNode, transform, getScale } from '../util/TreeUtil.js';

import * as d3Selection from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import * as d3Shape from 'd3-shape';
import * as d3Transition from 'd3-transition';
import * as d3Interpolate from 'd3-interpolate';


const defaultProps = {
    styles: {
        spaceY: 90,
        pieR: 11,
        circleR: 15,
        hoverCicleR: 24,
        positiveColor: '#31b5b8',
        negativeColor: '#d6f0f1',
        linkColor: '#31b5b8',
        textColor: '#7f7f7f',
        hoverOpacity: 0.5,
        width: 860,
        height: 520,
    },
    enableEvent: true,
};

const hPadding = 20;

export default class Tree {
    constructor(props) {
        this.init(props);
        this.props = Object.assign({}, defaultProps, props);
        this.render();
        this.renderToolTip();
        this.renderLegend();
        setTimeout(() => {
            if (this.props.zoomToFit) {
                this.zoomToFit();
            }
        }, 500);
        this.initListener();
    }

    static getDisplayName() {
        return 'Tree';
    }

    init(props) {
        const { styles } = defaultProps;
        this.styles = Object.assign({}, styles, props.styles);
        this.arc = d3Shape.arc()
            .outerRadius(styles.pieR)
            .innerRadius(0);
        this.pie = d3Shape.pie()
            .sort(null)
            .value(d => d.data);
        this.pieColor = (index) => {
            const colors = [this.styles.positiveColor, this.styles.negativeColor];
            return colors[index];
        };
    }

    initListener() {
        this.props.$dom.addEventListener('click', this);
    }

    removeListener() {
        this.props.$dom.removeEventListener('click', this);
    }

    handleEvent() {
        this.updateData(this.treeData);
    }

    /* 创建svg, defs, treeContainer, linksContainer, nodesContainer */
    renderContainer() {
        this.$chart = new Surface(this.props.$dom);
        this.renderLinerGradient();
        this.$tree = new Layer(this.$chart, 'pcharts-tree');
        this.$ascestorLinks = new Layer(this.$tree, 'pcharts-ascestor-links');
        this.$links = new Layer(this.$tree, 'pcharts-links');
        this.$sameNodes = new Layer(this.$tree, 'pcharts-same-nodes');
        this.$nodes = new Layer(this.$tree, 'pcharts-nodes');

        this.treeData = this.props.data;
        this.draw(this.treeData, this.treeData);

        this.initTransformTree();
    }

    updateData(data) {
        this.treeData = data;
        this.draw(this.treeData, this.treeData);
        // 清空选中的node样式
        this.setNodeHoverStyle();
        // 给右侧选中的数据是根结点
        this.resetHoverData();
    }

    resetHoverData() {
        const d = this.treeData;
        if (this.Tooltip) this.Tooltip.hide();
        const decisionRoad = this.getDecisionRoad(d);
        d.data.decisionRoad = decisionRoad;
        if (this.props.onNodeHover) this.props.onNodeHover(d.data);
    }

    draw(source, data) {
        const treeCanvasStyles = {
            spaceY: this.styles.spaceY,
            width: this.styles.width,
            height: this.styles.height,
        };
        const { linksData, nodesData } = getLayoutTree(data, treeCanvasStyles);
        this.nodesData = nodesData;
        this.linksData = linksData;
        data.x0 = data.x;
        data.y0 = data.y;
        this.renderNodes(source);
        this.renderLinks(source);
        nodesData.forEach((node) => {
            node.x0 = node.x;
            node.y0 = node.y;
        });
    }

    /* 创建渐变颜色，用以表示下游可以展开 */
    renderLinerGradient() {
        const $svgDefs = this.$chart.append('defs');
        const $linkFadeGradient = $svgDefs.append('linearGradient')
            .attr('id', 'linkFadeGradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        $linkFadeGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', this.styles.startColor ? this.styles.startColor : this.styles.linkColor)
            .attr('stop-opacity', 1);
        $linkFadeGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#fff')
            .attr('stop-opacity', 0.2);

        // mini chart 颜色是紫色渐变
        const { linkColor } = this.styles;
        if (linkColor === 'url(#linkGradient)') {
            const $linkGradient = $svgDefs.append('linearGradient')
                .attr('id', 'linkGradient')
                .attr('x1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%');
            $linkGradient
                .append('stop')
                .attr('offset', '0%')
                .attr('stop-color', this.styles.startColor);
            $linkGradient
                .append('stop')
                .attr('offset', '100%')
                .attr('stop-color', this.styles.endColor);
        }

        const { circleColor } = this.styles;
        if (circleColor === 'url(#circleGradient)') {
            const $circleGradient = $svgDefs.append('linearGradient')
                .attr('id', 'circleGradient')
                .attr('x1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%');
            $circleGradient
                .append('stop')
                .attr('offset', '0%')
                .attr('stop-color', this.styles.endColor);
            $circleGradient
                .append('stop')
                .attr('offset', '100%')
                .attr('stop-color', this.styles.startColor);
        }
    }

    /* 创建连线 */
    renderLinks(source) {
        // 获取连线update部分
        let linkUpdate = this.$links.selectAll('.link')
            .data(this.linksData, d => d.target.id);
            // 获取连线的enter部分
        const linkEnter = linkUpdate.enter();
        // 获取连线的exit部分
        const linkExit = linkUpdate.exit();

        const enterLinks = linkEnter.insert('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('d', () => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });

        linkUpdate = enterLinks.merge(linkUpdate);
        linkUpdate.transition()
            .duration(500)
            .attr('d', d => diagonal({
                source: d.source,
                target: d.target,
            }))
            .attr('stroke', this.styles.linkColor)
            .attr('stroke-width', d => d.target.data.linkWidth);

        linkExit.transition()
            .duration(500)
            .attr('d', () => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();
    }

    /* 创建节点 */
    renderNodes(source) {
        // 获取节点的update部分
        let nodeUpdate = this.$nodes.selectAll('.node')
            .data(this.nodesData, d => d.id);
            // 获取节点的enter部分
        const nodeEnter = nodeUpdate.enter();
        // 获取节点的exit部分
        const nodeExit = nodeUpdate.exit();


        /** ****-------------------enter--------------------------****** */
        const enterNodes = nodeEnter.append('g')
            .attr('class', 'node')
            .attr('transform', `translate(${source.x0},${source.y0})`)
            .attr('style', 'font: 10px sans-serif;')
            .attr('cursor', d => (!d.data.is_leaf ? 'pointer' : 'normal'));

        if (this.props.enableEvent) {
            enterNodes
                .on('click', (d) => {
                    toggleNode(d);
                    this.draw(d, this.treeData);
                    this.setNodeHoverStyle(d, true);
                })
                .on('mouseover', (d) => {
                    this.setNodeHoverStyle(d);
                    const mouse = this.getMouseInfo(d);
                    if (this.Tooltip) this.Tooltip.show(mouse);
                    const decisionRoad = this.getDecisionRoad(d);
                    d.data.decisionRoad = decisionRoad;
                    this.draw(d, this.treeData);
                    if (this.props.onNodeHover) this.props.onNodeHover(d.data);
                })
                .on('mouseout', () => {
                    if (this.Tooltip) this.Tooltip.hide();
                });
        }

        enterNodes.append('circle')
            .attr('r', 0)
            .attr('fill', '#fff')
            .attr('stroke', this.styles.circleColor ? this.styles.circleColor : this.styles.linkColor);

        const arcs = enterNodes.selectAll('.arc')
            .data(d => this.pie([{
                index: 0, label: '正样本', data: d.data.positive, is_leaf: d.data.is_leaf,
            }, {
                index: 1, label: '负样本', data: d.data.negative, is_leaf: d.data.is_leaf,
            }]))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', '')
            .style('fill-opacity', 0);

        enterNodes
            .append('text')
            .attr('class', 'decision')
            .attr('x', d => (d.children ? -(d.x - d.children[0].x) / 2 : 0))
            .attr('y', this.styles.spaceY / 2)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .attr('style', `fill-opacity: 0; fill: ${this.styles.textColor}`);

        enterNodes
            .append('text')
            .attr('class', 'decision_right')
            .attr('x', d => (d.children ? (d.x - d.children[0].x) / 2 : 0))
            .attr('y', this.styles.spaceY / 2)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .attr('style', `fill-opacity: 0; fill: ${this.styles.textColor}`);

        enterNodes.select('.weight')
            .append('text')
            .attr('class', 'weight')
            .attr('y', this.styles.circleR * 1.8)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .attr('style', `fill-opacity: 0; fill: ${this.styles.textColor}`);


        // 表示结点有下游
        enterNodes.append('rect')
            .attr('class', 'linkfade');


        /** ****-------------------update--------------------------****** */
        // 将update和enter merge，保证所有新增加的结点都会进行update的动画操作
        nodeUpdate = enterNodes.merge(nodeUpdate);
        const updateNodes = nodeUpdate.transition()
            .duration(500)
            .attr('transform', d => `translate(${d.x},${d.y})`);

        updateNodes.select('circle')
            .attr('r', this.styles.circleR)
            .attr('stroke-width', (this.styles.circleR - this.styles.pieR) / 2);

        nodeUpdate.selectAll('.arc')
            .data(d => this.pie([{
                index: 0, label: '正样本', data: d.data.positive, is_leaf: d.data.is_leaf,
            }, {
                index: 1, label: '负样本', data: d.data.negative, is_leaf: d.data.is_leaf,
            }]))
            .select('path')
            .attr('d', d => this.arc({ startAngle: d.startAngle, endAngle: d.endAngle }))
            .attr('fill', d => this.pieColor(d.index))
            .style('fill-opacity', 1);

        updateNodes.select('.decision')
            .attr('x', d => (d.children ? -(d.x - d.children[0].x) / 2 : 0))
            .text(d => this.getDecision(d, this.getDecisionId(source)))
            .style('fill-opacity', 1);

        updateNodes.select('.decision_right')
            .attr('x', d => (d.children ? (d.x - d.children[0].x) / 2 : 0))
            .text(d => this.getDecisionRight(d, this.getDecisionId(source)))
            .style('fill-opacity', 1);

        updateNodes.select('.weight')
            .text(d => this.getWeightData(d))
            .style('fill-opacity', 1);

        updateNodes.select('.linkfade')
            .attr('x', d => -d.data.linkWidth / 2)
            .attr('y', this.styles.circleR)
            .attr('width', d => d.data.linkWidth)
            .attr('height', d => (d._children ? this.styles.spaceY / 2 : 0))
            .attr('fill', 'url(#linkFadeGradient)');

        /** ****-------------------exit--------------------------****** */
        const exitNodes = nodeExit.transition()
            .duration(500)
            .attr('transform', `translate(${source.x},${source.y})`)
            .remove();
        exitNodes.selectAll('.arc path')
            .attr('d', '');
        exitNodes.selectAll('.decision')
            .style('fill-opacity', 0);
        exitNodes.selectAll('.weight')
            .style('fill-opacity', 0);
        exitNodes.select('.linkfade')
            .attr('height', 0);
        exitNodes.select('circle')
            .attr('r', 0);
    }

    getDecisionText(d) {
        let text = '';
        if (!d.data.is_nominal) {
            /** 连续特征 */
            text = `${d.data.featureName} <= ${d.data.condition}`;
        } else {
            /** 离散特征 */
            text = `${d.data.featureName} isn't ${d.data.featureValue}`;
        }
        return text.length > 20 ? `${text.substr(0, 20)}...` : text;
    }

    getDecisionTextRight(d) {
        let text = '';
        if (!d.data.is_nominal) {
            /** 连续特征 */
            text = `${d.data.featureName} >= ${d.data.condition}`;
        } else {
            /** 离散特征 */
            text = `${d.data.featureName} is ${d.data.featureValue}`;
        }
        return text.length > 20 ? `${text.substr(0, 20)}...` : text;
    }

    getDecision(d, decisionIds = []) {
        let text = '';
        if (decisionIds.length > 1) {
            if (decisionIds.includes(d.id)) {
                // 判断hover节点数组里是否包含该节点的左子节点，如果包含则说明左分支为决策分支
                if (!d.data.is_leaf && d.children && decisionIds.includes(d.children[0].id)) {
                    text = this.getDecisionText(d);
                }
            }
        } else if (!d.data.is_leaf && d.children && d.depth < 4) {
            text = this.getDecisionText(d);
        }
        return text;
    }

    getDecisionRight(d, decisionIds = []) {
        let text = '';
        if (decisionIds.length > 1) {
            if (decisionIds.includes(d.id)) {
                // 判断hover节点数组里是否包含该节点的右子节点，如果包含则说明右分支为决策分支
                if (!d.data.is_leaf && d.children && decisionIds.includes(d.children[1].id)) {
                    text = this.getDecisionTextRight(d);
                }
            }
        }
        return text;
    }

    getWeightData(d) {
        let weight = null;
        if (d.data.is_leaf) {
            weight = d.data.weight[0].toFixed(4);
        }
        return weight;
    }

    getMouseInfo(d) {
        // tooltip位置随着缩放，移动位置会不同，需要计算
        const newTransform = d3Zoom.zoomTransform(this.$chart.node());

        const activeCoordinate = {
            x: (newTransform.k * d.x) + newTransform.x,
            y: (newTransform.k * d.y) + newTransform.y,
        };

        const activeSize = {
            width: this.styles.hoverCicleR,
            height: this.styles.hoverCicleR,
        };

        const activeIndex = d.data.index;
        const activeLabel = d.data.featureName;
        const activeTooltipContent = [{
            name: '正样本',
            playLoad: d.data.positive,
        }, {
            name: '负样本',
            playLoad: d.data.negative,
        }];
        return {
            activeIndex,
            activeCoordinate,
            activeSize,
            activeLabel,
            activeTooltipContent,
        };
    }

    getDecisionId(d) {
        const ancestors = d.ancestors();
        return ancestors.map(n => n.id);
    }

    getDecisionRoad(d) {
        const road = [];
        const ancestors = d.ancestors();
        const len = ancestors.length;
        for (let i = len - 1; i > 0; i -= 1) {
            const node = ancestors[i].data;
            const nextNode = ancestors[i - 1].data;
            const { lson, rson } = node;
            if (!node.is_nominal) {
                if (lson === nextNode.index) {
                    road.push(`${node.featureName} <= ${node.condition}`);
                } else if (rson === nextNode.index) {
                    road.push(`${node.featureName} > ${node.condition}`);
                }
            } else if (lson === nextNode.index) {
                /**
                 * 离散特征可以认为condition是0.5，左边是<=0.5, 右边是 > 0.5。
                 * 对于离散特征，出现意味1，没有出现意味着0，
                 * 所以左边是isn't ，右边是is
                 *  */
                road.push(`${node.featureName} isn't ${node.featureValue}`);
            } else if (rson === nextNode.index) {
                road.push(`${node.featureName} is ${node.featureValue}`);
            }
        }
        return road;
    }

    setAncestorsStyle(d, fromClick) {
        const ancestors = d ? d.ancestors() : [];
        const linksData = [];
        const len = ancestors.length;
        for (let i = len - 1; i >= 0; i -= 1) {
            const node = ancestors[i];
            const nextNode = ancestors[i - 1];
            if (nextNode) {
                linksData.push({
                    source: node,
                    target: nextNode,
                });
            }
        }
        // 获取连线update部分
        let linkUpdate = this.$ascestorLinks.selectAll('.link')
            .data(linksData, linkData => linkData.target.id);
            // 获取连线的enter部分
        const linkEnter = linkUpdate.enter();
        // 获取连线的exit部分
        let linkExit = linkUpdate.exit();

        /** *****------------enter-------------------***** */
        const enterLinks = linkEnter.insert('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('d', () => {
                const o = { x: linksData[0].source.x0, y: linksData[0].source.y0 };
                return diagonal({ source: o, target: o });
            });

        /** *****------------update-------------------***** */
        linkUpdate = enterLinks.merge(linkUpdate);
        linkUpdate = fromClick ? linkUpdate.transition().duration(500) : linkUpdate;
        linkUpdate
            .attr('d', linkData => diagonal({
                source: linkData.source,
                target: linkData.target,
            }))
            .attr('stroke', this.styles.linkColor)
            .attr('stroke-opacity', this.styles.hoverOpacity)
            .attr('stroke-width', linkData => linkData.target.data.linkWidth + 10);

        /** *****------------exit-------------------***** */
        linkExit = fromClick ? linkExit.transition().duration(500) : linkExit;
        linkExit
            .attr('d', (linkData) => {
                const o = { x: linkData.source.x, y: linkData.source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();
    }

    setSameNodesStyle(d, fromClick) {
        let sameNodes = [];
        // 叶子结点，只高亮自己；非叶子结点，将特征名相同的结点都高亮
        if (d && !d.data.is_leaf) {
            this.nodesData.forEach((node) => {
                if (node.data.featureName === d.data.featureName) {
                    sameNodes.push(node);
                }
            });
        } else if (d && d.data.is_leaf) {
            sameNodes = [d];
        }
        let nodeUpdate = this.$sameNodes.selectAll('.node')
            .data(sameNodes, nodeData => nodeData.id);
        const nodeEnter = nodeUpdate.enter();
        const nodeExit = nodeUpdate.exit();

        const enterNodes = nodeEnter
            .insert('circle')
            .attr('class', 'node')
            .attr('transform', nodeData => `translate(${nodeData.x0},${nodeData.y0})`)
            .attr('r', 0);

        nodeUpdate = enterNodes.merge(nodeUpdate);
        nodeUpdate = fromClick ? nodeUpdate.transition().duration(500) : nodeUpdate;
        nodeUpdate
            .attr('transform', nodeData => `translate(${nodeData.x},${nodeData.y})`)
            .attr('r', this.styles.hoverCicleR)
            .attr('fill', this.styles.linkColor)
            .attr('fill-opacity', this.styles.hoverOpacity);

        nodeExit
            .style('fill-opacity', 0)
            .remove();
    }

    setNodeHoverStyle(d, fromClick = false) {
        this.setAncestorsStyle(d, fromClick);
        this.setSameNodesStyle(d, fromClick);
    }

    renderToolTip() {
        if (this.props.tooltip) {
            this.Tooltip = new Tooltip(this.props.tooltip);
            this.Tooltip.setParent(this.props.$dom);
            this.Tooltip.render();
        }
    }

    renderLegend() {
        if (this.props.legend) {
            this.Legend = new Legend(this.props.legend);
            this.Legend.setParent(this.props.$dom);
            this.Legend.render();
        }
    }

    bindEvents() {
        // 目前在整个画布上绑定的是zoom事件
        // 每个节点上绑定了click和hover事件
        this.zoomBehavior = d3Zoom.zoom()
            .scaleExtent([0.25, 4])
            .on('zoom', () => {
                const t = d3Selection.event.transform;
                this.$tree
                    .attr('transform', `translate(${t.x}, ${t.y}) scale(${t.k})`);
                if (this.Tooltip) this.Tooltip.hide();
            });
        this.$chart.call(this.zoomBehavior)
            .on('dblclick.zoom', null);

        this.resetZoomTransform([0, 2 * this.styles.hoverCicleR], 1);
    }


    initTransformTree() {
        this.$tree.attr('transform', `translate(${0},${2 * this.styles.hoverCicleR})`);
    }

    resetZoomTransform(translate, scale) {
        const newTransform = d3Zoom.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
        if (this.zoomBehavior) this.$chart.call(this.zoomBehavior.transform, newTransform);
    }

    zoomAnimation(newTranslate, newScale) {
        const oldTransform = d3Zoom.zoomTransform(this.$chart.node());
        const oldTranslate = [oldTransform.x, oldTransform.y];
        const oldScale = oldTransform.k;

        d3Transition.transition()
            .duration(750)
            .tween('zoom', () => {
                const translate = d3Interpolate.interpolate(oldTranslate, newTranslate);
                const scale = d3Interpolate.interpolate(oldScale, newScale);
                return (p) => {
                    const t = translate(p);
                    const s = scale(p);
                    this.$tree.attr('transform', transform(t, s));
                };
            });

        setTimeout(() => {
            this.resetZoomTransform(newTranslate, newScale);
        }, 750);
    }

    zoomToFit() {
        const oldTransform = d3Zoom.zoomTransform(this.$chart.node());
        const oldScale = oldTransform.k;

        const outer = this.$chart.node().getBoundingClientRect();
        const inner = this.$chart.node().getBBox();
        const scaleFinal = Math.min(getScale(outer, inner, oldScale), 1);
        // FIXME: translateXY计算错误
        const translateX = (outer.width / 2) -
            (scaleFinal * (inner.x + (inner.width / oldScale / 2)));
        const translateY = ((outer.height / 2) -
            (scaleFinal * (inner.y + (inner.height / 2)))) + hPadding;
        this.zoomAnimation([translateX, translateY], scaleFinal);
    }

    render() {
        this.renderContainer();
        if (this.props.enableEvent) {
            this.bindEvents();
        }
    }
}
