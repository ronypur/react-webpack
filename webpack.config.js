/**
 * Created by Rony on 7/6/2017.
 */
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {
  const entryDir = path.join(__dirname, 'src');
  const buildDir = path.join(__dirname, 'dist');
  const isProd = env === 'production';

  const plugins = [];
  const rules = [
    /**
     * All files with '.ts' or '.tsx' extension will be handled
     * by 'awesome-typescript-loader'
     */
    {
      test: /\.tsx?$/,
      loader: "awesome-typescript-loader"
    },

    /**
     * All output '.js' files will have any sourcemaps re-processed
     * by 'source-map-loader'
     */
    {
      enforce: "pre",
      test: /\.js$/,
      loader: "source-map-loader"
    }
  ];

  if (isProd) {
    plugins.push(
        new webpack.DefinePlugin({
          PRODUCTION: JSON.stringify(isProd)
        })
    );
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          beautify: false,
          mangle: {
            screw_ie8: true,
            keep_fnames: true
          },
          compress: {
            screw_ie8: true
          },
          comments: false
        })
    );
    plugins.push(
        new htmlWebpackPlugin({
          template: 'src/index.html',
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
          inject: true
        })
    );
  } else {
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(
        new htmlWebpackPlugin({
          inject: true,
          template: 'src/index.html'
        })
    );
  }

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
    module: {rules},
    devtool: isProd ? 'cheap-module-source-map' : 'cheap-eval-source-map',
    plugins: plugins,
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