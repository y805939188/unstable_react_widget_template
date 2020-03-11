import React from 'react';
import './index.less';
const MyWidget: React.FC<any> = (props) => {
  return <div
    style={{
      fontSize: 24,
      width: 100,
      height: 100,
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >测试: {props.number}</div>
}

export default MyWidget;
