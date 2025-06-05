const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    main: './src/index.js',
    calendar: './src/google-calendar.js', 
    timeBlocking: './src/time-blocking.js', 
    hackClub: './src/hack-club-events.js'
  }, 
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? '/magic-mirror/' : '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunks: ['main', 'calendar', 'timeBlocking', 'hackClub'],
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