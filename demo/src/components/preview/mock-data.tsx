const defaultData = {
  nodeId: "5ced4748-983e-41ac-b54d-be28c62b3931",
  dagRunId: "1314",
}
const defaultTaskId = "1314";

const data = [
  {
    url: 'http://localhost:20522/react-model-structure.js',
    name: 'react-model-structure',
    type: 'recommend',
    defaultProps: { workspaceId: 1, prn: 'TaskController/PicoTraining-10001544-10001544-94f5cb.model' },
  },
  {
    url: 'http://localhost:20522/reactComponent3.umd.js',
    name: 'reactComponent3',
    type: 'quality',
    defaultProps: {},
  },
  {
    url: 'http://localhost:20522/reactComponent4.umd.js',
    name: 'reactComponent4',
    type: 'quality',
    defaultProps: {},
  },
  {
    url: 'http://localhost:20522/reactComponent5.umd.js',
    name: 'reactComponent5',
    type: 'quality',
    defaultProps: {},
  },
  {
    url: 'http://localhost:20522/reactComponent6.umd.js',
    name: 'reactComponent6',
    type: 'quality',
    defaultProps: {},
  },
  {
    url: 'http://localhost:20522/reactComponent7.umd.js',
    name: 'reactComponent7',
    type: 'ranking',
    defaultProps: {},
  },
  {
    url: 'http://localhost:20522/reactComponent1.umd.js',
    name: 'reactComponent1',
    type: 'ranking',
    defaultProps: {},
  },
  {
    url: 'http://localhost:20522/reactComponent0.umd.js',
    name: 'reactComponent0',
    type: 'downloads',
    defaultProps: { taskId: "1314", data: defaultData, stop: true },
  },
  // {
  //   url: 'http://localhost:20522/react-model-structure.js',
  //   name: 'reactComponent0',
  //   type: 'downloads',
  //   defaultProps: { workspaceId: 1, prn: 'TaskController/PicoTraining-10001544-10001544-94f5cb.model' },
  // }
  // {
  //   url: 'http://localhost:20522/react-model-structure.js',
  //   name: 'react-model-structure',
  //   type: 'downloads',
  //   defaultProps: { workspaceId: 1, prn: 'TaskController/PicoTraining-10001544-10001544-94f5cb.model' },
  // },
];

export default data;
