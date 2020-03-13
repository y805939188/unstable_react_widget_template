import React, { useState, useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
// import useMount from 'react-use/esm/useMount';
import { ReactFrame } from 'react-vue-micro-frame';

import './index.less';

interface IProps extends RouteComponentProps<{ url: any }> {}

const Detail: React.FC<IProps> = (props) => {
  const currentUrl = JSON.parse(decodeURIComponent(props.match.params.url));
  return (
    <div id="board-detail-wrapper">
      <ReactFrame jsurl={currentUrl.url} extraProps={currentUrl.defaultProps} />
    </div>
  )
}

export default Detail;
