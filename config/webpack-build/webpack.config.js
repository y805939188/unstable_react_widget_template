const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
const { version, name, description } = require("../../package.json");
// const distDir = path.join(process.cwd(), "dist");
const distDir = path.join(process.cwd(), "dev-build");

const originPath = process.cwd();
const demoPath = `${originPath}/demo`;

module.exports = {
  mode: "production",
  // mode: "development",
  // entry: { [name]: path.join(originPath, 'src', 'index.tsx') },
  // entry: { [name]: path }
  // entry: isProd ? `${originPath}/src/index.tsx` : `${originPath}/demo/src/index.tsx`,
  // entry: `${originPath}/src/model-preview.tsx`,
  // entry: `${originPath}/src/model-structure-report.tsx`,
  entry: `${originPath}/src/feature-importance-report.tsx`,
  // entry: `${originPath}/src/model-preview.tsx`,
  output: {
    path: distDir,
    filename: "app.js",
    // 采用通用模块定义
    libraryTarget: "umd",
    library: name
  },
  devtool: "source-map",
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
        include: [path.join(originPath, 'src'), path.join(demoPath, 'src')],
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
        //antd样式处理
        test: /\.css$/,
        include: /node_modules/,
        use: [
          { loader: "style-loader",},
          {
            loader: "css-loader",
            options:{
              importLoaders:1,
            }
          }
        ]
      },
      {
        test: /\.less/,
        include: [path.join(originPath, 'src'), path.join(demoPath, 'src'), /node_modules/],
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
            options: {
              javascriptEnabled: true,
            }
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
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(demoPath, 'index.html'),
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [distDir]
    }),
  ],
};
