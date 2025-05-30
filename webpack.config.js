const path = require('path')
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlBundlerPlugin({
        entry: {
            index: 'src/index.html', 
        }
    })
  ]
}