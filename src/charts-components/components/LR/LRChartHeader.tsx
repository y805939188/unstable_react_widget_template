// @ts-nocheck
import React, { PureComponent } from 'react';
import TableToolbar from '../../app/component/TableToolbar';
import _ from 'lodash';

/**
 * data,
 * onchange
 */
class LRChartHeader extends PureComponent {
    constructor(...args) {
        super(...args);
        this.state = {
            orderBy: 'slot',
            ordering: 'asc',
            query: null,
        };
        this.handleSortBy = this.handleSortBy.bind(this);
        this.searchSlotName = this.searchSlotName.bind(this);
    }

    handleSortBy(type) {
        const { ordering, orderBy } = this.state;
        let newOrdering = 'desc';
        if (type === orderBy) {
            newOrdering = ordering === 'desc' ? 'asc' : 'desc';
        }
        const newData = this.search({
            orderBy: type,
            ordering: newOrdering,
            query: this.state.query,
        });
        if (this.props.onChange) this.props.onChange(newData);
        this.setState({
            ordering: newOrdering,
            orderBy: type,
        });
    }

    searchSlotName(value) {
        const newData = this.search({ query: value.trim() });
        if (this.props.onChange) this.props.onChange(newData);
        this.setState({
            query: value.trim(),
        });
    }

    search({ orderBy, ordering, query }) {
        const data = _.cloneDeep(this.props.data);
        let newData = [];
        if (query && query !== '') {
            data.forEach((item) => {
                if (item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) newData.push(item);
            });
        } else {
            newData = data;
        }

        if (orderBy === 'boxplot') {
            if (ordering === 'asc') {
                newData.sort((a, b) => a.tipWithoutZero.variance - b.tipWithoutZero.variance);
            } else if (ordering === 'desc') {
                newData.sort((a, b) => -(a.tipWithoutZero.variance - b.tipWithoutZero.variance));
            }
        } else {
            newData = this.sortData({ ordering, orderBy, data: newData });
        }

        let featureList = '';
        newData.forEach((item) => {
            featureList = `${featureList + item.name} \n`;
        });
        console.log('---------------featureList:-----------');
        console.log(featureList);
        console.log('--------------------------------------');
        return newData;
    }

    sortData({ ordering, orderBy, data }) {
        if (ordering === 'asc') {
            data.sort((a, b) => a[orderBy] - b[orderBy]);
        } else if (ordering === 'desc') {
            data.sort((a, b) => -(a[orderBy] - b[orderBy]));
        }
        return data;
    }

    render() {
        const messages = '请搜索特征名称';
        // eslint-disable-next-line react/prop-types
        const toolbar = [{
            type: 'order',
            name: 'slot',
            showname: '特征名',
            clickHandle: this.handleSortBy,
        },
        {
            type: 'order',
            name: 'boxplot',
            showname: '箱线图',
            clickHandle: this.handleSortBy,
        },
        {
            type: 'order',
            name: 'nonZeroRatio',
            showname: '有效特征占比',
            clickHandle: this.handleSortBy,
        },
        {
            type: 'order',
            name: 'featureRatio',
            showname: '特征维度占比',
            clickHandle: this.handleSortBy,
        }];
        const seachobj = {
            placeholder: messages,
            searchHandle: this.searchSlotName,
        };
        const { orderBy, ordering } = this.state;
        const sortobj = {
            sort: orderBy,
            order: ordering,
        };
        return (
            <div className="lrchart-header">
                <TableToolbar
                    toolbarlist={toolbar}
                    search={seachobj}
                    sortobj={sortobj}
                />
            </div>
        );
    }
}

export default LRChartHeader;
