import './style/basic.sass'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './script/app-admin/'
import config from './config'

Vue.mixin({
    data()
    {
        return {
            path: Object.assign({}, config.routes.admin)
        }
    }
})
Vue.use(VueRouter)

new Vue({
    el: '#app',
    render: h => h(App)
})