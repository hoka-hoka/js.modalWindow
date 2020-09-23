module.exports = function() {
  return {
    module: { // погрузщики преобразований
      rules: [
        {
          test: /\.(ts|js)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ],
    }
  }
};