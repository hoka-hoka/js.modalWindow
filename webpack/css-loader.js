const paths = require('../build/webpack.paths.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // позволяет разделить js от css в dist
const baseWebpackConfig = require('../build/webpack.config');
module.exports = function() {
  return {
    module: { // погрузщики преобразований
      rules: [
        {
          test: /\.s?css$/,
          use: [
            { loader: 'style-loader' },
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: 'css-loader', options: { importLoaders : 1, url: false, sourceMap: true }
            }, {
              loader: 'postcss-loader',
              options: { }
            }, {
              loader: 'sass-loader', // компилирует scss в css
              options: { sourceMap: true }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin(
        {
          filename: `${paths.PATHS.assets}css/[name].css`,
        }
      )
    ]
  }
};