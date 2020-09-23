module.exports = function() {
  return {
    module: { // погрузщики преобразований
      rules: [
        {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)$/,
        use: [ {
            loader: 'file-loader?name=./assets/fonts/[name].[ext]'
          }]
        }, {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: { name: '[name].[ext]' }
        }
      ]
    }
  }
};
