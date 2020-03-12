import React from 'react';
import './index.<%= style%>';

const Widget: React.FC<any> = () => {
  return <div
    style={{
      textShadow: '#3900ff 0 0 10px',
      color: 'white',
      fontSize: '60px',
    }}
  >Test</div>
}

export default React.memo(Widget);