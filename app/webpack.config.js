const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: './src/index.html',
	filename: 'index.html',
	inject: 'body'
});
module.exports = {
	entry: './src/index.js',
	module: {
	  rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
	      test: /\.(scss|css)$/,
	      use: [{
	        loader: "style-loader", // creates style nodes from JS strings
	      }, {
	        loader: "css-loader", // translates CSS into CommonJS
					options: {
						includePaths: ['./src/css']
					}
	      }, {
	        loader: "sass-loader", // compiles Sass to CSS
					options: {
	          includePaths: ['./src/styles']
	        }
	      }]
	  }]
	},
	output: {
		filename: 'transformed.js',
		path: __dirname + '/build'
	},
	plugins: [
		HTMLWebpackPluginConfig
	],
	devtool: 'cheap-module-eval-source-map',
};
