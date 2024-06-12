const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: true,
          },
        },
      },
      {
        test: /\.wasm$/,
        loader: "base64-loader",
        type: "javascript/auto",
      },

      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      { test: /\.txt$/, use: "raw-loader" },
    ],
  },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      Buffer: false,
      process: false,
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
      serveIndex: true,
    },
    historyApiFallback: true,
    compress: true,
    port: 3000,
  },
};
