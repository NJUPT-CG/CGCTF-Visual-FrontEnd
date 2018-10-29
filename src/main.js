// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// import echarts from 'echarts'
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

// axios.defaults.withCredentials = true
Vue.prototype.$ajax = axios
Vue.prototype.$chart = echarts

Vue.config.productionTip = false
// Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
