const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const devserver = require('../webpack/devserver');

const devdWebpackConfig = merge([
  baseWebpackConfig,
  {
    mode: 'development',
    /*stats: {
      assets: false, // скрыть активы из статистики
      builtAt: false, // скрыть дату сборки
      cached: false, // информация о кэшировании
      cachedAssets: false,
      children: false, // информация о детях
      chunks: false,
      chunkGroups: false,
      chunkModules: false,
      colors: true, // в разные цвета
      modules: false // скрыть одули
    },*/
    devtool: 'inline-source-map',
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map'
      })
    ]
  },
  devserver()
])

module.exports = new Promise((resolve, reject) => {
	resolve(devdWebpackConfig)
});



