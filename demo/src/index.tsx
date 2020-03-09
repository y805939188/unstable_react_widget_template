import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// import Component1 from '../../src/index';
// import Echarts from '../../src/index';
import FeatureImportanceReport from '../../src/feature-importance-report';
import ModelStructureReport from '../../src/model-structure-report';
import ModelPreview from '../../src/model-preview';
// import { ReactFrame } from 'react-vue-micro-frame';
import { ReactFrame } from './components/src';
// @ts-ignore
// import ModelPreview from '../../dev-build/app';
import 'antd/dist/antd.css';

// @ts-ignore
import DingTest from '../../dev-build/app';

console.log(111, DingTest)

const T = DingTest as any;
const defaultData = {
  nodeId: "43ffb22e-5b08-4c85-a866-e00dd3e08bfe",
  dagRunId: "22404",
}
const defaultTaskId = "22404";

const Test: React.FC<any> = (props) => {
  // const [ number, setNumber ] = useState<number>(1);
  // const handleClick = () => setNumber(number + 1);

  return (
    <div>
      {/* <DingTest workspaceId={1} prn="TaskController/PicoTraining-10001544-10001544-94f5cb.model" /> */}
      {/* <DingTest  workspaceId={1} prn="TaskController/PicoTraining-10001548-10001548-cd230b.model"/> */}
      {/* <DingTest workspaceId={1} prn={'TaskController/PicoTraining-10001544-10001544-94f5cb.model'} /> */}
      {/* <Echarts
        stop={false}
        data={defaultData}
        taskId={defaultTaskId}
      /> */}
      {/* <button onClick={handleClick}>点我+1</button>
      <Component1 number={number} /> */}
      {/* TaskController/PicoTraining-10001544-10001544-94f5cb.model */}
      {/* <FeatureImportanceReport workspaceId={1} prn="TaskController/PicoTraining-10001890-10001890-eaf315.model" /> */}
      {/* <ModelStructureReport workspaceId={1} prn="TaskController/PicoTraining-10001890-10001890-eaf315.model" /> */}
      {/* <FeatureImportanceReport workspaceId={1} prn="TaskController/PicoTraining-10001544-10001544-94f5cb.model" />
      <ModelStructureReport workspaceId={1} prn="TaskController/PicoTraining-10001544-10001544-94f5cb.model" />     */}
            {/* <FeatureImportanceReport workspaceId={1} prn="TaskController/PicoTraining-10001548-10001548-cd230b.model" />
      <ModelStructureReport workspaceId={1} prn="TaskController/PicoTraining-10001548-10001548-cd230b.model" />    */}
      {/* <ModelPreview workspaceId={1} prn={'TaskController/PicoTraining-10001544-10001544-94f5cb.model'} /> */}
      <ReactFrame jsurl={"http://localhost:5566/app.js"} extraProps={{ workspaceId: 1, prn: 'TaskController/PicoTraining-10001544-10001544-94f5cb.model' }} />
    </div>
  )
}

ReactDOM.render(
  <Test />,
  document.querySelector('#react'),
)
