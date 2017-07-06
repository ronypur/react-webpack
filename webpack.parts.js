/**
 * Created by Rony on 7/6/2017.
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Plugins
 * @type {Array}
 */
const commonPlugins = [];

exports.devPlugins = () => {
  return [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html'
    }),
  ].concat(commonPlugins);
};

exports.prodPlugins = () => {
  return [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true)
    }),
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
    }),
    new HtmlWebpackPlugin({
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
    }),
  ].concat(commonPlugins);
};

/**
 * Module rules
 * @type {[*]}
 */
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

exports.devRules = () => {
  return [/** Add rules here */].concat(rules);
};

exports.prodRules = () => {
  return [/** Add rules here */].concat(rules);
}