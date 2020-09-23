module.exports = function() {
  return {
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: true // с расстановкой отступов и строк, иначе будет всё в одну строку
              }
            }
          ]
        }
      ]
    }
  }
}