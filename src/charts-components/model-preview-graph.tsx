import React, { PureComponent } from 'react';
// import { TrainProcess, TrainProcessMSE, TrainProcessAcc, TrainProcessH2O } from 'elf-visualization';
// import { TrainProcess, TrainProcessMSE, TrainProcessAcc } from 'elf-visualization';
// @ts-ignore
import { TrainProcess, TrainProcessMSE, TrainProcessAcc } from './dist/index';
console.log(88888, TrainProcess)
interface IProps {
  data: any;
}

const SENARIO = {
  BINARY_CLASSIFICATION: 'BINARY_CLASSIFICATION',
  MULTICLASS_CLASSIFICATION: 'MULTICLASS_CLASSIFICATION',
  REGRESSION: 'REGRESSION',
  COMPUTER_VISION: 'COMPUTER_VISION',
  OCR: 'OCR',
  OBJECT_DETECTION: 'OBJECT_DETECTION',
};

const ALGORITHM = {
  LR: 'lr',
  'softmax-gbdt': 'softmax-gbdt',
  GBDT: 'gbdt',
  'GBDT-FPGA': 'gbdt-fpga',
  svm: 'svm',
  'HE-TreeNet': 'HE-TreeNet',
  'linear-fractal': 'linear-fractal',
  dsn: 'dsn',
  'nb-binary': 'nb-binary',
  fm: 'fm',
  'softmax-lr': 'softmax-lr',
  gbrt: 'gbrt',
  'linear-fractal-regression': 'linear-fractal-regression',
  'linear-regression': 'linear-regression',
};

export default class ModelPreviewGraph extends PureComponent<IProps, {}> {
  render() {
    /** ugly的判断 */
    const { data } = this.props;
    if (data) {
      const algorithmName = data.algorithmName;
      if (data.classify === SENARIO.BINARY_CLASSIFICATION) {
        // random_forest没有放在ALGORITHM原因是筛选等条件暂时不提供这个
        if (algorithmName === 'random_forest') {
          // return (<div style={{ marginTop: '30px' }}><TrainProcessH2O data={data} /></div>);
          return <span>暂时不支持</span>
        }
        if (algorithmName === ALGORITHM['nb-binary']) {
          return (
            <div className="middle-center" style={{ height: '300px', fontSize: '14px' }}>
              该模型暂不支持预览模型效果信息
            </div>
          );
        }
        return (<TrainProcess data={data} />);
        // return (<span>111111</span>);
      }
      if (
        (data.classify === SENARIO.MULTICLASS_CLASSIFICATION && algorithmName === 'softmax-lr') ||
        (data.classify === SENARIO.REGRESSION)
      ) {
        // return (<TrainProcessMSE data={data} />);
        return (<span>222222</span>);
      }
      if (
        data.classify === SENARIO.MULTICLASS_CLASSIFICATION ||
        data.classify === SENARIO.OCR ||
        data.classify === SENARIO.OBJECT_DETECTION
      ) {
        // return (<TrainProcessAcc data={data} />);
        return (<span>333333</span>);
      }
      return (
        <div className="middle-center" style={{ height: '300px', fontSize: '14px' }}>
          该模型暂不支持预览模型效果信息
        </div>
      );
    }
    return null;
  }
}
