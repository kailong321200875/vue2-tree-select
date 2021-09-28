/**
 * 该文件是开发环境的基础配置文件
 */

'use strict'
// 引入工具函数文件
const utils = require('./utils')

// 引入webpack
const webpack = require('webpack')

// 引入配置文件
const config = require('../config')

// 引入合并对象插件
const { merge } = require('webpack-merge')

// webpack 自带模块
const path = require('path')

// 引入基础配置文件
const baseWebpackConfig = require('./webpack.base.conf')

// 静态资源复制的插件
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 用于将webpack编译打包后的产品文件注入到html模板中
// 即自动在index.html里面加上<link>和<script>标签引用webpack打包后的文件
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 用于更友好地输出webpack的警告、错误等信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const ESLintPlugin = require('eslint-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  // 模式，必填项
  mode: 'development',

  // webpack入口文件
  entry: {
    app: ['whatwg-fetch', 'core-js/features/promise', './src/main.ts']
  },

  // webpack输出路径和命名规则
  output: {
    // webpack输出的目标文件夹路径（例如：/dist）
    path: config.build.assetsRoot,
    // webpack输出bundle文件命名格式
    filename: '[name].js',
    // webpack编译输出的发布路径
    publicPath: config.dev.assetsPublicPath,

    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: false
    }
  },

  // 样式文件的处理规则，对css/sass/scss等不同内容使用相应的styleLoaders
  // 由utils配置出各种类型的预处理语言所需要使用的loader，例如sass需要使用sass-loader
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },

  // 持久化缓存配置，第二次构建速度提升了将近十倍
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },

  devtool: 'eval-cheap-module-source-map',

  // 开发服务的配置
  devServer: {
    // 服务器host，默认为localhost，
    host: HOST || config.dev.host,

    //  服务器端口号，默认8080
    port: PORT || config.dev.port,

    // string | boolean
    // 启动后是否打开浏览器
    // 默认为false，如果设置为true， 启动时会自动打开浏览器
    // 当为字符串时，打开指定浏览器 'chrome'
    open: config.dev.autoOpenBrowser,

    //  是否启用gzip压缩,默认为false
    compress: true,

    // 是否启动热更新（HMR）默认为false
    // 热更新使用的是webpack中HotModuleReplacementPlugin
    hot: true,
    proxy: config.dev.proxyTable,

    // 服务器返回时加入的response的自定义header
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    static: {
      publicPath: config.dev.assetsPublicPath,
      watch: {
        poll: config.dev.poll
      }
    },

    // 设置WebSocket客户端的一些属性
    client: {
      overlay: false
    },

    historyApiFallback: {
      rewrites: [{ from: /.*/, to: path.posix.join('/', 'public/index.html') }]
    }
  },

  plugins: [
    // 环境变量插件
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html'
    }),

    // 把public的一些静态文件复制到指定位置，排除html文件
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/*.html']
          }
        }
      ]
    }),

    new ESLintPlugin({
      extensions: ['ts', 'js', 'vue']
      // fix: true
    })
    // new StylelintPlugin({
    //   cache: true,
    //   failOnError: false
    // })
  ],

  optimization: {
    moduleIds: 'named',
    chunkIds: 'named'
  }
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`App running here: http://${devWebpackConfig.devServer.host}:${port}`]
          },
          onErrors: true ? utils.createNotifierCallback() : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
