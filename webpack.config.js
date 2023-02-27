const path = require('path')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.mode = 'none'
exports.context = path.join(__dirname, 'docs')
exports.entry = {
  index : './index.js',
}
exports.output = {
  path : path.join(__dirname, 'docs/public/build'),
  publicPath : '/build/',
  filename : '[name].bundle.js',
  assetModuleFilename : 'fonts/[base]',
}
exports.module = {
  rules : [
    {
      test : /\.css$/,
      use : [
        // MiniCssExtractPlugin.loader,
        'style-loader',
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
      test : /\.(eot|ttf|woff|woff2)$/,
      type : 'asset/resource',
    },
    {
      test : /\.(png|jpg|gif|svg)$/,
      type : 'asset',
    },
  ],
}
exports.externals = {
  'moment' : 'moment',
  'window' : 'window',
}
exports.plugins = [
  // new MiniCssExtractPlugin({ filename : '[name].bundle.css' }),
]
exports.devServer = {
  static : {
    directory : path.join(__dirname, 'docs/public'),
  },
  hot : true,
}
