const path = require('path')

module.exports = {
  mode : 'none',
  context : __dirname,
  entry : '.',
  output : {
    path : path.join(__dirname, 'dist'),
    filename : 'htmlmodule.bundle.js',
    library : 'htmlmodule',
    libraryTarget : 'umd',
    globalObject : 'this',
  },
  externals : {
    window : 'window',
  },
}
