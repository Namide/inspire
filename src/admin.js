import './style/basic.sass'
import Vue from 'vue'
import Vuex from 'Vuex'
import VueRouter from 'vue-router'
import App from './script/app-admin/'
import config from './config'
import storeData from './script/utils/storeSet'

Vue.use(Vuex)

const eventHub = new Vue()

Vue.mixin({
    data()
    {
        return {
            path: Object.assign({}, config.routes.admin),
            eventHub
        }
    }
})

Vue.use(VueRouter)

new Vue({
    el: '#app',
    store: new Vuex.Store(storeData),
    render: h => h(App)
})