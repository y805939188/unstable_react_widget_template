const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');

const originPath = process.cwd();
const demoPath = `${originPath}/demo`;
module.exports = {
  mode: 'development',
  entry: `${demoPath}/src/index.tsx`,
  output: {
    filename: 'app.js',
    path: `${demoPath}/dist`,
  },
  devtool: 'source-map',
  externals: [],
  devServer: {
    port: 19411,
    contentBase: `${demoPath}/src`,
    historyApiFallback: true,
    proxy: [
      {
        // target: 'http://gateway.371cdh.autoui.4pd.io',
        target: 'http://172.27.128.150:40121/',
        changeOrigin: true,
        // context: ['/'],
        context: ['/hinton', '/ultron', '/keystone', '/license-manager', '/config-center', '/telamon'],
        onProxyReq: (proxyReq) => {
          proxyReq.setHeader('Cookie', 'User-Token=07eff3f1-71b3-45d9-b499-16c346765132');
        },
      }
    ],
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
              '@babel/preset-react'
            ],
            plugins: [path.join(originPath, 'node_modules', '@babel/plugin-syntax-dynamic-import')],
          }
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options : { modules: true }
          },
        ],
      },
      {
        test: /\.less/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options : { modules: true }
          },
          {
            loader: 'less-loader',
          }
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: { limit: 10000 }
      },
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    alias: {
      'external-lib': path.join(demoPath, 'external-lib'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(demoPath, 'index.html')
    }),
    new CheckerPlugin(),
    // new VueLoaderPlugin(),
  ],
};
