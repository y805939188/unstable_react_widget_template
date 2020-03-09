import merge from 'lodash/merge';
import baseConf from './rollup.base.conf';

const prodConf = {
  output: {
    format: 'umd',
  }
};

export default merge(baseConf, prodConf);

