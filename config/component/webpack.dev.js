const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const originPath = process.cwd();
const demoPath = `${originPath}/demo`;
const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  externals: [],
  devServer: {
    port: 54321,
    contentBase: `${demoPath}`,
    historyApiFallback: true,
    proxy: [
      {
        // target: 'http://gateway.371cdh.autoui.4pd.io',
        target: 'http://172.27.128.150:40121/',
        changeOrigin: true,
        // context: ['/'],
        context: ['/hinton', '/ultron', '/keystone', '/license-manager', '/config-center', '/telamon'],
        onProxyReq: (proxyReq) => {
          proxyReq.setHeader('Cookie', 'User-Token=1542211f-f4f8-4011-a89d-99704a7addd5');
        },
      }
    ],
  },
};

module.exports = merge([ baseConfig, devConfig ]);
