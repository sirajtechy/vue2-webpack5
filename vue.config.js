
const webpack = require('webpack')
// const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = {

  lintOnSave: false,
  productionSourceMap: false,
  runtimeCompiler: false,
    publicPath:
      process.env.NODE_ENV === 'production'
        ? 'https://static.leadconnectorhq.com/' // prod
        : '/', // dev

  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.plugin('polyfills').use(NodePolyfillPlugin)
    const splitOptions = config.optimization.get('splitChunks')
    config.optimization.splitChunks(
      Object.assign({}, splitOptions, {
        maxAsyncRequests: 16,
        maxInitialRequests: 16,
        minChunks: 1,
        minSize: 10000,
        automaticNameDelimiter: '~',
        cacheGroups: {
          ...splitOptions.cacheGroups,
          common: {
            name: `chunk-common`,
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      })
    )

  },
  configureWebpack: {
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: '[name].min.js',
      chunkFilename: '[id].[contenthash].min.js',
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ["*", ".js", ".vue", ".json"],
    },
    // resolve: {
    //   fallback: {
    //     "fs": false
    //   }, extensions: ['.tsx', '.ts', '.js','.vue']
    // },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: file => (
            /node_modules/.test(file) &&
            !/\.vue\.js/.test(file)
          )
        },
        {
          test: /\.svg$/,
          use: ['babel-loader', 'vue-svg-loader'],
        }

      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery',
        Popper: 'popper.js',
        lodash: 'lodash',
      }),
 
    ]
  }
}
