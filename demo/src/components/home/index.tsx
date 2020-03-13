import React, { useState } from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
// import useMount from 'react-use/esm/useMount';
import logo from '../../resource/img/elfjs2.png';
import { Menu, Icon, Tooltip } from 'antd';
import Preview from '../preview';
import Detail from '../detail';
import Search from '../search';
import Widget from '../widget';
import './index.less';

interface IProps extends RouteComponentProps<{}> {
  [propName: string]: any;
}

const toNewWidget = () => (window.location.hash = '/new-widget');
const toSearch = () => (window.location.hash = '/search');
const toPreview = () => (window.location.hash = '/preview');
const defaultIndex = ['#/preview', '#/search'].indexOf(window.location.hash);

const Board: React.FC<IProps> = (props) => {
  // const handleClick = (widget: any) => {
  //   window.open(`/board/#/detail/${encodeURIComponent(JSON.stringify(widget))}`);
  // }
  return (
    <div id="board-content-wrapper">
      <div className="board-content-left">
        <Menu
          defaultSelectedKeys={[`${defaultIndex + 1}`]}
          mode="inline"
          theme="dark"
          inlineCollapsed={true}
        >
          <img className="logo-img" src={logo} />
          <Menu.Item key="1" onClick={toPreview}>
            <Icon type="pie-chart" />
            <span>首页</span>
          </Menu.Item>
          <Menu.Item key="2" onClick={toNewWidget}>
            <Icon type="desktop" />
            <span>开发中的 Widget</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="inbox" />
            <span>全部</span>
          </Menu.Item>
        </Menu>
      </div>
      <div className="board-content-right">
        <div className="content-header">
          <div className="header-user-logo">
            <Icon type="user" />
          </div>
          {/* {
            haveNew && !(window.location.hash.includes('detail')) ?
              (<Tooltip
                defaultVisible
                placement="bottomLeft"
                title={
                  <div>您有{haveNew.length}个新的组件, 点击 <span style={{ color: '#32cc94', cursor: 'pointer' }} onClick={handleClick.bind(null, haveNew[0])}>查看</span></div>
                }
              >
                <div className="header-user-info">你好, Test ~</div>
              </Tooltip>) :
              <div className="header-user-info">你好, Test ~</div>
          } */}
          <div className="header-user-info">你好, Test ~</div>
        </div>
        <Switch>
          <Redirect exact from="/" to="/preview" />
          <Route path="/preview" component={Preview} />
          <Route path="/new-widget" component={Widget} />
          {/* <Route path="/search" component={Search} /> */}
          <Route path="/detail/:url" component={Detail} />
        </Switch>
      </div>
    </div>
  )
}

export default Board;
