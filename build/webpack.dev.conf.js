const webpack = require('webpack');
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devdWebpackConfig = merge(baseWebpackConfig, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: baseWebpackConfig.externals.paths.dist,
  		port: 8081,
  		overlay: { // вывод ошибок на экране браузера
      		warnings: false,
      		errors: true  
  		}
  	},
	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: '[file].map'
		})
		
	]
})

module.exports = new Promise((resolve, reject) => {
	resolve(devdWebpackConfig)
});


  
 