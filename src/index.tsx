import React from 'react';
const Component1: React.FC<any> = (props) => {
  return <div
    style={{
      fontSize: 24,
      width: 100,
      height: 100,
      backgroundColor: 'aquamarine',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >测试外部通讯: {props.number}</div>
}

export default Component1;
