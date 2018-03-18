import VueRouter from 'vue-router'
import PageHome from '../page-home'
import PagePosts from '../page-posts'
import PageBoards from '../page-boards'

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: PageHome },
        { path: '/post', component: PagePosts },
        { path: '/board', component: PageBoards }
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