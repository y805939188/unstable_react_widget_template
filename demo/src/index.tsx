import React from 'react';
import ReactDOM from 'react-dom';
import MyWidget from '../../dev-build';
const Test: React.FC<any> = (props) => {
  return (
    <div>
      <MyWidget number={666} />
    </div>
  )
}
ReactDOM.render(
  <Test />,
  document.querySelector('#react'),
)


// tsc ./src/index.tsx --esModuleInterop  --emitDeclarationOnly --declaration --jsx react 