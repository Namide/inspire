import './style/basic.sass'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './script/app-front/'
import config from './config'
import storeData from './script/utils/storeGet'

Vue.use(Vuex)

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
    store: new Vuex.Store(storeData),
    render: h => h(App)
})