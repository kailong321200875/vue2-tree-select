import 'core-js/stable'

import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import '@/element-ui' // 按需引入element
new Vue({
  el: '#app',
  render: (h) => h(App)
})
