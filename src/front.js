import './style/basic.sass'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './script/app-front/'
import config from './config'

const eventHub = new Vue()

Vue.mixin({
    data()
    {
        return {
            path: Object.assign({}, config.routes.front),
            eventHub
        }
    }
})

Vue.use(VueRouter)

new Vue({
    el: '#app',
    render: h => h(App)
})