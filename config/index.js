'use strict'
const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://192.168.171.56:13570',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },

    // Various Dev Server settings
    host: 'localhost',
    port: 7001,
    autoOpenBrowser: false,
    poll: false,

    cssSourceMap: true
  },

  build: {
    // Paths
    assetsRoot: path.resolve(__dirname, `../dist`),
    assetsSubDirectory: '',
    assetsPublicPath: './',

    productionGzipExtensions: ['js', 'css']
  }
}
