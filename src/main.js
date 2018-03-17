import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './script/app-main/'

Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h(App)
})