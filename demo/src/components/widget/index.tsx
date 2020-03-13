import React, { useState, useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
// import useMount from 'react-use/esm/useMount';
import Widget from '../../../../dev-build';

import './index.less';

interface IProps extends RouteComponentProps<{ url: any }> {}

const WidgetBoard: React.FC<IProps> = (props) => {

  return (
    <div id="board-widget-wrapper">
      <div className="board-widget-welcome">Hello Widget!!</div>
      <div className="board-widget-content">
        <div className="board-widget-board">
          <Widget />
        </div>
      </div>
    </div>
  )
}

export default React.memo(WidgetBoard);
