const path = require('path');
module.exports = function() {
  return {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        }
      ]
    }
  }
}