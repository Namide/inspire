import VueRouter from 'vue-router'
import PageHome from '../page-home'

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: PageHome },
    ]
})

export default {

    router,

    components:
    {
    },

    data()
    {
        return {
        }
    },

    watch:
    {
        '$route'(to, from)
        {
            // react to route changes...
        }
    },

    created()
    {

    }
}