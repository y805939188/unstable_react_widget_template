const path = require("path");
const originPath = process.cwd();
const demoPath = `${originPath}/demo`;

module.exports = {
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [path.join(originPath, 'src'), path.join(demoPath, 'src')],
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options : { modules: true }
          },
        ],
      },
      { 
        test: /\.css$/,
        include: /node_modules/,
        use: [
          { loader: 'style-loader',},
          {
            loader: 'css-loader',
            options:{ importLoaders: 1 }
          }
        ]
      },
      {
        test: /\.less/,
        include: [path.join(originPath, 'src'), path.join(demoPath, 'src'), /node_modules/],
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options : { modules: true }
          },
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true }
          }
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: { limit: 10000 }
      },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  plugins: [],
};
