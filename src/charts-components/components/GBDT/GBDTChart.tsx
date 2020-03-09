// @ts-nocheck
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';
// import { LocalLoading } from 'apollo-widgets';
import { Tree } from '../charts';
import { getTreeData, getHierarchyTree, defaultLayout, expandLayout } from './util.js';
import { GBDTMODEL } from './constants';

const maxWidth = 12;
const minWidth = 2;

// 被应用到 Model.jsx GBDT.jsx
export default class GBDTChart extends React.Component {
    constructor(...args) {
        super(...args);
        const { showDefault, linkLegend, loading } = this.props;

        this.state = {
            showDefault,
            loading,
        };
        this.linkLegend = linkLegend;
    }

    componentDidMount() {
        this.initTree();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.linkLegend = nextProps.linkLegend;
            const treeData = this.initTreeData(nextProps.data);
            if (this.treeChart.updateData) this.treeChart.updateData(treeData);
        } else if (nextProps.linkLegend !== this.props.linkLegend) {
            this.linkLegend = nextProps.linkLegend;
            const treeData = this.updateTreeDataByLinkLegend();
            if (this.treeChart.updateData) this.treeChart.updateData(treeData);
        }
        if (nextProps.loading !== this.state.loading) {
            this._updateTreeData();
        }
    }

    componentWillUnmount() {
        this.treeChart.removeListener();
    }

    onNodeHover(mouse) {
        if (this.props.onNodeHover) this.props.onNodeHover(mouse);
    }

    getBoxTooltip(activeIndex) {
        const rootData = this.data[0];
        const data = this.data[activeIndex];
        const totalInsNum = data[GBDTMODEL.INS_NUM];
        const totalInsNumRatio = data[GBDTMODEL.INS_NUM] / rootData[GBDTMODEL.INS_NUM];
        const { positive, negative } = data;
        const nodePositiveRatio = positive / totalInsNum;
        const nodeNegativeRatio = negative / totalInsNum;
        const rootPositiveRatio = positive / rootData.positive;
        const rootNegativeRatio = negative / rootData.negative;

        const style = {
            margin: '0px',
            padding: '5px 14px',
            backgroundColor: 'rgba(72,72,72,0.8)',
            boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
            color: '#fff',
        };

        const titleStyle = {
            fontSize: '14px',
            marginBottom: '10px',
            marginTop: '10px',
        };
        const pStyle = {
            fontSize: '12px',
            marginBottom: '5px',
        };
        const Wrapper = () => (
            <div style={style} className="gbdt-tooltip">
                <p style={titleStyle}>总样本数：</p>
                <p style={pStyle}>占总样本数的比例：{`${(totalInsNumRatio * 100).toFixed(2)}%`}</p>
                <p style={titleStyle}>正样本数：{`${positive}`}</p>
                <p style={pStyle}>占节点样本数的比例：{`${(nodePositiveRatio * 100).toFixed(2)}%`}</p>
                <p style={pStyle}>占总正样本数的比例：{`${(rootPositiveRatio * 100).toFixed(2)}%`}</p>
                <p style={titleStyle}>负样本数：{`${negative}`}</p>
                <p style={pStyle}>占节点样本数的比例：</p>
                <p style={pStyle}>占总负样本数的比例：</p>
            </div>
        );
        const htmlString = ReactDOMServer.renderToStaticMarkup(Wrapper());
        return htmlString;
    }

    initTree() {
        const {
            id, data, zoomToFit, enableEvent, styles, legend,
        } = this.props;
        const $gbdt = document.getElementById(id);
        const content = activeIndex => this.getBoxTooltip(activeIndex);
        const treeData = this.initTreeData(data);
        const treeChartProps = {
            $dom: $gbdt,
            data: treeData,
            styles,
            legend,
            tooltip: {
                trigger: 'none',
                content,
            },
            onNodeHover: this.onNodeHover.bind(this),
            enableEvent,
            zoomToFit,
        };
        this.treeChart = new Tree(treeChartProps);
    }

    initTreeData(data) {
        this.data = getTreeData(data);
        this.data = this.parseData(this.data);
        this.treeData = getHierarchyTree(this.data);
        if (this.state.showDefault) {
            defaultLayout(this.treeData);
        } else {
            expandLayout(this.treeData);
        }

        this.setState({
            loading: false,
        });
        return this.treeData;
    }

    parseData(data) {
        const newData = _.cloneDeep(data);
        this._getPieData(newData);
        this._getLinkData(newData);
        return newData;
    }

    _getPieData(tree) {
        tree.map((node) => {
            /** model：解析模型获得正负样本数 */
            const positive = node[GBDTMODEL.LABEL_SUM][0];
            const negative = node[GBDTMODEL.INS_NUM] - positive;
            node.positive = Number.isNaN(positive) ? 1 : positive;
            node.negative = Number.isNaN(negative) ? 0 : negative;
            return node;
        });
        return tree;
    }

    // 线代表的含义
    _getLinkData(tree) {
        const rootNode = tree[0];
        tree.map((node) => {
            const linkWidth = ((node[this.linkLegend] / rootNode[this.linkLegend]) *
                (maxWidth - minWidth)) + minWidth;
            node.linkWidth = Number.isNaN(linkWidth) ? 2 : linkWidth;
            return node;
        });
        return tree;
    }

    updateTreeDataByLinkLegend() {
        const rootNode = this.treeData.data;
        const { linkLegend } = this;
        function loop(node) {
            const { data } = node;
            const linkWidth = ((data[linkLegend] / rootNode[linkLegend]) *
                (maxWidth - minWidth)) + minWidth;
            data.linkWidth = Number.isNaN(linkWidth) ? 2 : linkWidth;
            if (node.children) {
                loop(node.children[0]);
                loop(node.children[1]);
            }
        }
        loop(this.treeData);
        return this.treeData;
    }

    displayDefaultLayout(isTrue) {
        const { showDefault } = this.state;
        if (showDefault === isTrue) {
            return;
        }

        if (isTrue) {
            defaultLayout(this.treeData);
        } else {
            expandLayout(this.treeData);
        }

        this.setState({
            loading: true,
        }, () => {
            setTimeout(() => {
                if (this.treeChart.updateData) {
                    this.treeChart.updateData(this.treeData);
                    // TODO: 如果之后是动态计算宽度，每次change 默认/全部 这里需要进行自适应展示
                    // this.treeChart.zoomToFit();
                }

                this.setState({
                    showDefault: isTrue,
                });
            }, 100);
        });
    }

    _updateTreeData() {
        this.setState({
            loading: true,
        }, () => {
            setTimeout(() => {
                if (this.treeChart.updateData) {
                    this.treeChart.updateData(this.treeData);
                }

                this.setState({
                    loading: false,
                });
            }, 100);
        });
    }

    _renderPlugin() {
        const defaultClassName = this.state.showDefault ? 'icon default-layout hover' : 'icon default-layout';
        const expandClassName = !this.state.showDefault ? 'icon expand-layout hover' : 'icon expand-layout';
        return (
            <div className="gbdt-plugin">
                <div
                    className="icon-wrapper"
                    role="presentation"
                    onClick={() => this.displayDefaultLayout(true)}
                >
                    <span className={defaultClassName} />
                    <span>显示默认</span>
                </div>
                <div
                    className="icon-wrapper"
                    role="presentation"
                    onClick={() => this.displayDefaultLayout(false)}
                >
                    <span className={expandClassName} />
                    <span>显示全部</span>
                </div>
            </div>
        );
    }

    render() {
        const { id, showPlugin, width, height } = this.props;
        const { loading } = this.state;

        return (
            <div id={id} style={{ width, height, position: 'relative' }}>
                {showPlugin ? this._renderPlugin() : null}
                {loading && (
                    <div
                        style={{
                            width: 900,
                            height: 500,
                            textAlign: 'center',
                            paddingTop: 160,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            backgroundColor: 'rgba(255,255,255,0.75)',
                        }}
                    >
                        {/* <LocalLoading /> */}
                        loading...
                    </div>
                )}
            </div>
        );
    }
}

GBDTChart.defaultProps = {
    id: 'gbdt-graph',
    height: 560,
    width: 900,
    showPlugin: true,
    enableEvent: true,
    zoomToFit: false,
    showDefault: true,
    linkLegend: GBDTMODEL.INS_NUM,
};
