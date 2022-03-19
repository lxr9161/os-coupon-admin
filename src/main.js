import Vue from 'vue'
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/public.css'
import router from './router'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import DateFilter from '@/filter/Date'

import Cookies from 'js-cookie'

Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = '/api'
Vue.axios.interceptors.response.use(response => {
  if (response.data.status === 'fail') {
    Message({ message: response.data.info, type: 'error' })
    return response
  }
  return response
}, error => {
  if (error.response.status === 401) {
    Message({ message: '请先登录', type: 'error' })
    Cookies.remove('auth_token')
    router.push({ name: 'login' })
  } else {
    Message({ message: error, type: 'error' })
  }
  return Promise.reject(error)
})
// 添加请求拦截器
Vue.axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.url !== '/admin/login') {
    let token = Cookies.get('auth_token')
    if (token) {
      config.headers['Authorization'] = 'bearer ' + token
    }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

Vue.config.productionTip = false
Vue.filter('date', DateFilter)

// 登录状态判断
router.beforeEach((to, from, next) => {
  let token = Cookies.get('auth_token')
  if (to.name !== 'login' && !token) {
    next({ name: 'login' })
  } else {
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
