import './style/basic.sass'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './script/app-admin/'
import config from './config'

Vue.mixin({
    methods: {
        getURL(path) { return config.admin.root + (path[0] !== '/' ? '/' : '') + path }
    }
})
Vue.use(VueRouter)

new Vue({
    el: '#app',
    render: h => h(App)
})