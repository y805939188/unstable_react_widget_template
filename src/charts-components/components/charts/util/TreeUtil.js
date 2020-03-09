import * as d3Hierarchy from 'd3-hierarchy';
import * as d3Shape from 'd3-shape';

export const getLayoutTree = (rootData, treeCanvasStyles) => {
    // TODO: 可以根据树深度动态计算整个宽度
    const tree = d3Hierarchy.tree()
        .size([treeCanvasStyles.width, treeCanvasStyles.height]);
    const nodesData = rootData.descendants();
    const linksData = tree(rootData).links();

    if (treeCanvasStyles.spaceY) {
        nodesData.forEach((d) => {
            d.y = d.depth * treeCanvasStyles.spaceY;
        });
    }
    return { linksData, nodesData };
};

export const toggleNode = (node) => {
    if (node.children) { // 如果有子节点
        node._children = node.children; // 将该子节点保存到 _children
        node.children = null; // 将子节点设置为null
    } else { // 如果没有子节点
        node.children = node._children; // 从 _children 取回原来的子节点
        node._children = null; // 将 _children 设置为 null
    }
};

export const diagonal = d3Shape.linkVertical()
    .x(d => d.x)
    .y(d => d.y);

export const transform = (translate, scale) => {
    if (typeof translate === 'string') {
        const ret = {};
        const tr = /translate\((.+?)\)/;
        const tm = translate.match(tr);
        if (tm) {
            // chrome下通过逗号分割，IE下通过空格分割
            if (tm[1].includes(',')) {
                ret.translate = tm[1].split(/\s*,\s*/);
            } else {
                ret.translate = tm[1].split(/\s+/);
            }
        }
        const sr = /scale\((.+?)\)/;
        const sm = translate.match(sr);
        if (sm) {
            ret.scale = sm[1].trim();
        }
        return ret;
    }
    const translateStr = translate.join(',');
    let str = `translate(${translateStr})`;
    if (scale != null) {
        str += `scale(${scale})`;
    }
    return str;
};

export const getScale = (outer, inner, scale) => {
    const wPadding = 20;
    const hPadding = 20;
    const wRatio = (outer.width - (2 * wPadding)) / (inner.width / scale);
    const hRatio = (outer.height - (2 * hPadding)) / (inner.height / scale);
    const scaleFinal = hRatio < wRatio ? hRatio : wRatio;
    return scaleFinal;
};
