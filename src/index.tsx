import React from 'react';
import './index.<%= style%>';

/**
 * 如果只想开发 react 相关的工具并非组件的话,
 * 直接将 src/index.tsx 重命名为 index.ts 即可
 */

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