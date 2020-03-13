import React from 'react';
import ReactDOM from 'react-dom';
import RootRouter from './root-router';
import 'antd/dist/antd.css';

ReactDOM.render(
  <div id="pd-board-wrapper">
    <RootRouter />
  </div>,
  document.querySelector('#react'),
);
