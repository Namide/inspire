import './style/basic.sass'
// import App from './script/app-front/'
// import config from './config'
// import store from './script/utils/store'

/*
import './style/basic.sass'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './script/app-front/'
import config from './config'
import store from './script/utils/store'

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
    store: store,
    render: h => h(App)
})
*/

import state from './script/state'
import actions from './script/actions'
import view from './script/app/app-main/index.js'

import { h, app } from 'hyperapp'
import { Link, Route, location } from '@hyperapp/router'
 
const main = app(state, actions, view, document.body)

const unsubscribe = location.subscribe(main.location)