/**
 * @param {string} filePath
 * @param {{}} options
 * @param {function} callback
 */
module.exports = (filePath, options, callback) => {
  try {
    const constructor = require(filePath)
    const doc = new constructor(options)
    callback(null, doc.toString())
    doc.destroy()
    options.cache || delete require.cache[filePath]
  }
  catch(err) {
    callback(err)
    console.error(err)
  }
}
