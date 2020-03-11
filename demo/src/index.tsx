import React from 'react';
import ReactDOM from 'react-dom';
import MyWidget from '../../dev-build';
import './index.less';

const Test: React.FC<any> = (props) => {
  return (
    <div>
      <div id="test-wrapper">Hello Widget!!</div>
      <MyWidget />
    </div>
  )
}
ReactDOM.render(
  <Test />,
  document.querySelector('#react'),
)


// tsc ./src/index.tsx --esModuleInterop  --emitDeclarationOnly --declaration --jsx react 