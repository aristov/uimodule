module.exports = {
  plugins : [
    require('autoprefixer'),
    require('postcss-preset-env'),
    require('postcss-svg'),
    /*require('postcss-svgo')({
      plugins : [
        { removeViewBox : false },
      ],
    }),*/
    /*require('postcss-pxtorem')({
        rootValue: 16,
        unitPrecision: 10,
        propList : ['*'],
        selectorBlackList: ['html']
    })*/
  ],
}
