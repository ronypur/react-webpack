/**
 * Created by Rony on 7/6/2017.
 */
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const parts = require('./webpack.parts');

module.exports = (env) => {
  const entryDir = path.join(__dirname, 'src');
  const buildDir = path.join(__dirname, 'dist');
  const isProd = env === 'production';

  return {
    entry: path.join(entryDir, 'index.tsx'),
    output: {
      path: buildDir,
      publicPath: '/',
      filename: 'bundle.js'
    },
    resolve: {
      // Add '.ts', '.tsx', '.js', '.json' as resolvable extension
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: { rules: isProd ? parts.prodRules() : parts.devRules() },
    devtool: isProd ? 'cheap-module-source-map' : 'cheap-eval-source-map',
    plugins: isProd ? parts.prodPlugins() : parts.devPlugins(),
    devServer: {
      contentBase: isProd ? path.join(__dirname, 'dist') : path.join(__dirname, 'src'),
      historyApiFallback: true,
      stats: 'errors-only',
      host: 'localhost',
      port: isProd ? 3000 : 8080,
      hot: !isProd,
      inline: !isProd,
      compress: isProd,
      overlay: {
        errors: true,
        warning: true,
      },
    }
  }
};