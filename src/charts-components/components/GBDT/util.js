import * as d3Hierarchy from 'd3-hierarchy';
import { GBDTMODEL } from './constants';

export const getTreeData = (backend) => {
    if (!Array.isArray(backend)) {
        console.error('tree is not a Array');
        return null;
    }
    backend.forEach((node) => {
        const { lson, rson } = node;
        /** 模型文件变化会发生相应的变化 */
        const index = node[GBDTMODEL.NODE_INDEX];
        node.index = index;
        if (lson) backend[lson].parentId = index;
        if (rson) backend[rson].parentId = index;
    });
    return backend;
};

export const getHierarchyTree = (backend) => {
    const rootData = d3Hierarchy.stratify()
        .id(d => d.index)
        .parentId(d => d.parentId)(backend);
    console.log('pcharts root tree:', rootData);
    return rootData;
};

export const defaultLayout = (root) => {
    function loop(node) {
        if (node.depth < 4) {
            if (node._children) { // 点击收起节点后
                node.children = node._children;
                node._children = null;
            }
        } else if (node.depth >= 4) {
            if (node.children) { // 如果有子节点
                node._children = node.children; // 将该子节点保存到 _children
                node.children = null; // 将子节点设置为null
            }
        }

        if (node.children) {
            loop(node.children[0]);
            loop(node.children[1]);
        }
    }
    loop(root);
};
export const expandLayout = (root) => {
    function loop(node) {
        if (node._children) { // 如果有子节点
            node.children = node._children; // 将该子节点保存到 _children
            node._children = null; // 将子节点设置为null
        }
        if (node.children) {
            loop(node.children[0]);
            loop(node.children[1]);
        }
    }
    loop(root);
};
export const getTransform = (transform) => {
    if (typeof transform === 'string') {
        const ret = {};
        const tr = /translate\((.+?)\)/;
        const tm = transform.match(tr);
        if (tm) {
            // chrome下通过逗号分割，IE下通过空格分割
            if (tm[1].includes(',')) {
                ret.translate = tm[1].split(/\s*,\s*/);
            } else {
                ret.translate = tm[1].split(/\s+/);
            }
        }
        const sr = /scale\((.+?)\)/;
        const sm = transform.match(sr);
        if (sm) {
            ret.scale = sm[1].trim();
        }
        return ret;
    }
    return null;
};
