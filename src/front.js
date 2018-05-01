import './style/basic.sass'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './script/app-front/'

Vue.use(VueRouter)
Vue.mixin({
    methods: {
        getURL(path) { return config.front.root + (path[0] !== '/' ? '/' : '') + path }
    }
})

new Vue({
  el: '#app',
  render: h => h(App)
})