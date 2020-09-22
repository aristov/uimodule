const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssoPlugin = require('csso-webpack-plugin').default

exports.context = path.join(__dirname, 'src')
exports.entry = {
  index : './index.js'
}
exports.output = {
  path : path.join(__dirname, 'docs/build'),
  publicPath : '/',
  filename : '[name].bundle.js',
}
exports.mode = 'none'
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
/*exports.module.rules.push({
  test : /\.js$/,
  use : {
    loader : 'babel-loader',
    options : {
      presets : [
        [
          '@babel/preset-env',
          {
            modules : false,
          },
        ],
      ],
    },
  },
})*/
/*exports.optimization = {
  minimize : true,
  minimizer : [
    new TerserPlugin({
      terserOptions : {
        keep_fnames : true,
      },
    }),
  ],
}*/
exports.plugins = [
  new MiniCssExtractPlugin({
    filename : '[name].bundle.css',
  }),
  // new CssoPlugin,
]
