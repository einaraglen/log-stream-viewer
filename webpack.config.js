const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const webpack = require('webpack');
const deps = require("./package.json").dependencies;
const dotenv = require('dotenv');

dotenv.config();

module.exports = (_, argv) => ({
  output: {
    // publicPath: argv.mode = "/",
    publicPath: argv.mode === "development" ? 'http://localhost:3005/' : "https://signal-component.netlify.app/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3005,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.CACHE_API_URL': JSON.stringify(process.env.CACHE_API_URL),
    }),
    new ModuleFederationPlugin({
      name: "Components",
      filename: "remoteEntry.js",
      exposes: {
        "./Components": "./src/Components",
      },
      remotes: {
        seabrief: 'seabrief@https://www.seabrief.com/_next/static/chunks/remoteEntry.js'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
});