/**
 * 该文件是开发和生产共同使用提出来的基础配置文件，主要实现配制入口，配置输出环境，配置模块resolve和插件等
 */

'use strict'
// webpack自带模块
const path = require('path')

// 导入工具函数
const utils = require('./utils')

// 导入配置文件
const config = require('../config')

// 导入vue-loader配置
const vueLoaderConfig = require('./vue-loader.conf')

// 引入vue-loader插件
const { VueLoaderPlugin } = require('vue-loader')

// 获取绝对路径
function resolve(dir) {
  // 拼接出绝对路径
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),

  target: ['web', 'es5'],

  // webpack入口文件
  // entry: {
  //   app:
  //     process.argv[2] === 'serve'
  //       ? ['whatwg-fetch', 'core-js/features/promise', './src/main.ts']
  //       : ['./src/main.ts']
  // },

  // // webpack输出路径和命名规则
  // output: {
  //   // webpack输出的目标文件夹路径（例如：/dist）
  //   path: config.build.assetsRoot,
  //   // webpack输出bundle文件命名格式
  //   filename: '[name].js',
  //   // webpack编译输出的发布路径
  //   publicPath:
  //     process.argv[2] === 'serve'
  //       ? config.dev.assetsPublicPath
  //       : config.build.assetsPublicPath,

  //   environment: {
  //     // The environment supports arrow functions ('() => { ... }').
  //     arrowFunction: false
  //   }
  // },

  // 模块resolve的规则
  resolve: {
    // fallback: {
    //   process: 'process/browser',
    //   path: require.resolve('path-browserify')
    // },
    //自动的扩展后缀，比如一个js文件，则引用时书写可不要写.js
    extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.css', '.less'],
    // 别名，方便引用模块，例如有了别名之后，
    // import Vue from 'vue/dist/vue.common.js'可以写成 import Vue from 'vue'
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      _u: resolve('src/utils')
    }
  },

  // 不同类型模块的处理规则
  module: {
    rules: [
      // 对所有.vue文件使用vue-loader进行编译
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
        include: [resolve('src')]
      },

      // 对src和test文件夹下的.js文件使用babel-loader将es6+的代码转成es5
      {
        test: /\.(t|j)s$/,
        // loader: 'happypack/loader?id=babel',
        use: ['babel-loader?cacheDirectory'],
        include: [resolve('src')]
      },

      {
        test: /\.tsx?$/,
        // loader: 'happypack/loader?id=babel',
        use: ['babel-loader?cacheDirectory'],
        include: [resolve('src')]
      },

      // 对字体资源文件进行处理，webpack5已经废弃了url-loader，改为type
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: utils.assetsPath('fonts/[name].[contenthash:7].[ext]')
        }
      }
    ]
  },

  node: {
    global: false
  },

  plugins: [new VueLoaderPlugin()]
}
