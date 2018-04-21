import './style/basic.sass'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './script/app-admin/'

Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h(App)
})