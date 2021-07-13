const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.mode = 'none'
exports.context = path.join(__dirname, 'docs')
exports.entry = {
  index : './index.js',
}
exports.output = {
  path : path.join(__dirname, 'docs/build'),
  publicPath : '',
  filename : '[name].bundle.js',
  assetModuleFilename : 'fonts/[base]',
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
      test : /\.(eot|svg|ttf|woff|woff2)$/,
      type : 'asset/resource',
    },
  ],
}
exports.externals = {
  'moment' : 'moment',
  'window' : 'window',
}
exports.plugins = [
  new MiniCssExtractPlugin({ filename : '[name].bundle.css' }),
]
