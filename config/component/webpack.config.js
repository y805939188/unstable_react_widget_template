// const fs = require("fs");
const path = require("path");
// const webpack = require("webpack");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// const nodeExternals = require("webpack-node-externals");
// const WebpackMd5Hash = require("webpack-md5-hash");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// const resolve = dir => path.join(__dirname, ".", dir);
const isProd = process.env.NODE_ENV === "production";
const { version, name, description } = require("../../package.json");
const distDir = path.join(process.cwd(), "dist");

const originPath = process.cwd();
const demoPath = `${originPath}/demo`;

module.exports = {
  // mode: "production",
  mode: "development",
  // entry: { [name]: path.join(originPath, 'src', 'index.tsx') },
  // entry: { [name]: path }
  // entry: isProd ? `${originPath}/src/index.tsx` : `${originPath}/demo/src/index.tsx`,
  // entry: `${originPath}/src/model-preview.tsx`,
  entry: `${originPath}/src/feature-importance-report.tsx`,
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
    // enforceExtension: false,
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  // 注意：本地预览的时候要注释，否则报 require undefined
  // https://stackoverflow.com/questions/45818937/webpack-uncaught-referenceerror-require-is-not-defined
  // externals: [nodeExternals()],
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(demoPath, 'index.html'),
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [distDir]
    }),
    // new MiniCssExtractPlugin({
    //   filename: "[name].css"
    // }),
    // new WebpackMd5Hash(),
    // new webpack.BannerPlugin(` \n ${name} v${version} \n ${description} ${fs.readFileSync(path.join(process.cwd(), "LICENSE"))}`)
  ],
  //压缩js
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: {
  //         name: "styles",
  //         test: /\.scss$/,
  //         chunks: "all",
  //         enforce: true
  //       }
  //     }
  //   },
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       cache: true,
  //       parallel: true,
  //       sourceMap: true
  //     }),
  //     new OptimizeCssAssetsPlugin({
  //       assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
  //       cssProcessor: require("cssnano"),
  //       cssProcessorOptions: {
  //         discardComments: { removeAll: true },
  //         safe: true,
  //         autoprefixer: false
  //       },
  //       canPrint: true
  //     })
  //   ]
  // },
  // node: {
  //   setImmediate: false,
  //   dgram: "empty",
  //   fs: "empty",
  //   net: "empty",
  //   tls: "empty",
  //   child_process: "empty"
  // }
};
