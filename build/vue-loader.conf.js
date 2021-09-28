/**
 * vue-loader配置文件
 */

'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.argv[2] === 'pro'
const sourceMapEnabled = isProduction ? false : config.dev.cssSourceMap

module.exports = {
  // 处理.vue文件中的样式
  loaders: Object.assign(
    utils.cssLoaders({
      sourceMap: sourceMapEnabled,
      // 是否提取样式到单独的文件
      extract: isProduction
    })
  ),
  // 是否打开source-map
  cssSourceMap: sourceMapEnabled,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: ['xlink:href', 'href'],
    use: ['xlink:href', 'href']
  }
}
