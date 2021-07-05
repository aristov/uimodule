const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.mode = 'none'
exports.context = path.join(__dirname, 'docs')
exports.entry = {
  index : './index.js'
}
exports.output = {
  path : path.join(__dirname, 'docs/build'),
  publicPath : '/',
  filename : '[name].bundle.js',
}
exports.module = {
  rules : [
    {
      test : /\.css$/,
      use : [
        MiniCssExtractPlugin.loader,
        {
          loader : 'css-loader',
          options : {
            importLoaders : 1,
          },
        },
        'postcss-loader',
      ],
    },
    {
      test : /\.(png|jpg|gif|ttf|woff|woff2|eot)$/,
      loader : 'url-loader',
      options : {
        limit : 20480,
      },
    },
    {
      test : /\.svg$/,
      loader : 'raw-loader',
    },
  ],
}
exports.externals = {
  'moment' : 'moment',
}
exports.plugins = [
  new MiniCssExtractPlugin({ filename : '[name].bundle.css' }),
]
