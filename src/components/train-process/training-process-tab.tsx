import React, { PureComponent } from 'react';
import { IGraphItemsProps } from './index';

interface IProps {
  items: IGraphItemsProps[];
  onTabChange: (item: IGraphItemsProps) => void;
}

interface IState {
  focusedIndex: number;
}

export default class TrainingProcessTab extends PureComponent<IProps, IState> {
	constructor(props: IProps) {
    super(props);
    this.state = { focusedIndex: 0 };
	}

  onTabClick = (item: IGraphItemsProps, index: number) => {
    if (index !== this.state.focusedIndex) {
      this.setState({ focusedIndex: index });
      const { onTabChange } = this.props;
      onTabChange && onTabChange(item);
    }
  }

  render() {
    const items = this.props.items.map((item, index) => {
      const tabClass = this.state.focusedIndex === index ? 'tab focused ' : 'tab';
      return (
        <div
          key={`tab_${index}`}
          onClick={() => this.onTabClick(item, index)}
          role="presentation"
          className={tabClass}
        >
          {item.name}
        </div>
      );
    });
    return (<div id="training-bar-style-wrapper" >{items}</div>);
  }
}
