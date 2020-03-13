import React from 'react';
import './css/training-process-tab.css';

export default class TrainingProcessTab extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            focusedIndex: 0,
        };
        this.onTabClick = this.onTabClick.bind(this);
    }

    onTabClick(item, index) {
        if (index !== this.state.focusedIndex) {
            this.setState({
                focusedIndex: index,
            });
            if (this.props.onTabChange) {
                this.props.onTabChange(item);
            }
        }
    }

    render() {
        const items = this.props.items.map((item, index) => {
            const tabClass = this.state.focusedIndex === index ? 'tab focused ' : 'tab';
            return (
                <div
                    key={`tab_${index}`}
                    onClick={() => this.onTabClick(item, index)}
                    onKeyPress={console.log('keyDown')}
                    role="presentation"
                    className={tabClass}
                >
                    {item.name}
                </div>
            );
        });
        return (
            <div style={{ padding: this.props.padding, fontSize: '14px' }}>
                {items}
            </div>
        );
    }
}
