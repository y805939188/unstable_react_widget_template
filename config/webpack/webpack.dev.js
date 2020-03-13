const merge = require('webpack-merge');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const baseConfig = require('./webpack.config');
const distDir = path.join(process.cwd(), 'dist');
const originPath = process.cwd();
const demoPath = `${originPath}/demo`;
const publicPath = '/board/';

const devConfig = {
  mode: 'development',
  entry: `${demoPath}/src/app/app.tsx`,
  output: {
    path: distDir,
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: `${demoPath}/src`,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/preset-env", {
                "modules": false,
                "targets": {
                  "browsers": [ "ie >= 11", "last 2 versions" ]
                }
              }],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { corejs: 3 }],
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-class-properties',
            ],
          }
        },
      },
    ]
  },
  devServer: {
    // open: true,
    port: 3190,
    contentBase: `${demoPath}`,
    historyApiFallback: true,
    publicPath,
    proxy: [{
      // target: 'http://gateway.371cdh.autoui.4pd.io',
      // target: 'http://gateway.380cdh.autoui.4pd.io/',
      target: 'http://172.27.128.150:40121/',
      changeOrigin: true,
      context: ['/'],
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Cookie', 'User-Token=a2fa1c51-774b-488b-8e85-080b447b88a2');
      },
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(demoPath, 'index.html'),
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:3190/board/#/new-widget' }),
  ],
  resolve: {
    // extensions: ['.ts', '.tsx', '.jsx', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      common: path.resolve(__dirname, 'src', 'common'),
      app: path.resolve(__dirname, 'src', 'app'),
      component: path.resolve(__dirname, 'src', 'component'),
      resource: path.resolve(__dirname, 'src', 'resource'),
    },
  },
};

module.exports = merge([ baseConfig, devConfig ]);
