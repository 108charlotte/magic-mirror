const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './src/index.js',
    calendar: './src/google-calendar.js', 
    timeBlocking: './src/time-blocking.js'
  }, 
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['main', 'calendar', 'timeBlocking']
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' }, 
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
}