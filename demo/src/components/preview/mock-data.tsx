const defaultData = {
  nodeId: "5ced4748-983e-41ac-b54d-be28c62b3931",
  dagRunId: "1314",
}
const defaultTaskId = "1314";

const data = [
  {
    url: 'http://172.27.128.108:31633/components/widgets/area-widget/index.js',
    name: 'widget-1',
    type: 'recommend',
  },
  {
    url: 'http://172.27.128.108:31633/components/widgets/polar/index.js',
    name: 'widget2',
    type: 'quality',
    defaultProps: {},
  },
  {
    url: 'http://172.27.128.108:31633/components/widgets/polar2/index.js',
    name: 'widget3',
    type: 'quality',
    defaultProps: {},
  },
  {
    url: 'http://172.27.128.108:31633/components/widgets/pie/index.js',
    name: 'widget4',
    type: 'quality',
    defaultProps: {},
  },
  {
    url: 'http://172.27.128.108:31633/components/widgets/pie2/index.js',
    name: 'widget5',
    type: 'quality',
    defaultProps: {},
  },
  {
    url: 'http://172.27.128.108:31633/components/widgets/sunburst/index.js',
    name: 'widget6',
    type: 'ranking',
    defaultProps: {},
  },
  {
    url: 'http://172.27.128.108:31633/components/widgets/radam/index.js',
    name: 'widget7',
    type: 'ranking',
    defaultProps: {},
  },
  {
    url: 'http://172.27.128.108:31633/components/react-model-structure.js',
    name: 'react-model-structure',
    type: 'downloads',
    defaultProps: { workspaceId: 1, prn: 'TaskController/PicoTraining-10001544-10001544-94f5cb.model' },
  },
  // {
  //   url: 'http://172.27.128.108:13190/reactComponent0.umd.js',
  //   name: 'reactComponent0',
  //   type: 'downloads',
  //   defaultProps: { taskId: "22742", data: defaultData, stop: true },
  // }
];

export default data;
