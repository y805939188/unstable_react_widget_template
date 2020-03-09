import * as d3Scale from 'd3-scale';
import { extent as d3Extent } from 'd3-array';
import commonUtil from '../common/js/util.js';

const util = {

    getChartData: (backend) => {
        if (!backend) return null;
        const boxData = [];
        backend.featureDetails.forEach((item) => {
            const obj = {
                slot: item.slot,
                name: item.name,
                nonZeroRatio: item.detail.nonZeroCount / item.detail.featureCount,
                featureRatio: item.detail.featureCount / backend.featureDimension,
                featureCount: item.detail.featureCount,
                tipWithZero: item.detail.withZero,
                tipWithoutZero: item.detail.withoutZero,
                withZero: util.getBoxplotData(item.detail.withZero),
                withoutZero: util.getBoxplotData(item.detail.withoutZero),
            };
            boxData.push(obj);
        });
        boxData.sort((a, b) => (a.slot - b.slot));
        return boxData;
    },

    getBoxplotData: (tipDetail) => {
        const boxplot = [];
        boxplot.push(Number(tipDetail.min.weight));
        boxplot.push(Number(tipDetail.quantile25.weight));
        boxplot.push(Number(tipDetail.medium.weight));
        boxplot.push(Number(tipDetail.quantile75.weight));
        boxplot.push(Number(tipDetail.max.weight));
        return boxplot;
    },

    getValueByDataKey: (obj, dataKey) => {
        if (commonUtil.isNil(obj)) return null;
        if (commonUtil.isStr(dataKey)) return obj[dataKey];
        return null;
    },

    getDomainByDataKey: (data, dataKey) => {
        const displayedData = data.map(item => util.getValueByDataKey(item, dataKey));
        let domain;
        if (commonUtil.isNumber(displayedData[0])) {
            domain = d3Extent(displayedData);
        } else if (commonUtil.isArray(displayedData[0])) {
            domain = util.getExtentMatrix(displayedData);
        }
        return domain;
    },

    getExtentMatrix: (matrix) => {
        let data = [];
        matrix.forEach((item) => {
            data = data.concat(item);
        });
        return d3Extent(data);
    },

    domainToRange: (domain, range) => d3Scale.scaleLinear()
        .domain(domain)
        .range(range),

    domainToRangeNice: (domain, range, tickCount = 5) => d3Scale.scaleLinear()
        .domain(domain)
        .range(range)
        .nice(tickCount),
};

export default util;
