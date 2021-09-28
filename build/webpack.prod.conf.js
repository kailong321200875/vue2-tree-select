/**
 * 该文件是生产环境的基础配置文件
 */

'use strict'

// webpack 自带模块
const path = require('path')

// 导入工具文件
const utils = require('./utils')

// 引入webpack
const webpack = require('webpack')

// 引入合并对象插件
const { merge } = require('webpack-merge')

// 引入配置文件
const config = require('../config')

// 引入基础配置文件
const baseWebpackConfig = require('./webpack.base.conf')

// js压缩插件
const TerserWebpackPlugin = require('terser-webpack-plugin')

// css 出来插件
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  // 模式
  mode: 'production',

  entry: {
    app: './src/index.ts'
  },
  performance: {
    hints: false
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'vue2-tree-select.js',
    library: 'vue2-tree-select',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false
    }
  },

  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      extract: true,
      usePostCSS: true
    })
  },

  externals: {
    vue: 'vue',
    'element-ui': 'Element'
  },

  // 是否使用source-map
  devtool: false,

  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          // 生产环境自动删除console
          compress: {
            drop_debugger: true,
            drop_console: true,
            pure_funcs: ['console.log']
          }
        },
        parallel: true,
        exclude: /[\\/]node_modules[\\/]/
      }),
      new CssMinimizerPlugin()
    ]
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),

    new MiniCssExtractPlugin({
      filename: 'css/index.css',
      chunkFilename: '[id].css'
    })
  ]
})

module.exports = webpackConfig
