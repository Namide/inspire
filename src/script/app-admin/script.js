import VueRouter from 'vue-router'
import PageHome from '../page-home'
import PageAdminPosts from '../page-admin-posts'
import PageBoards from '../page-boards'

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/admin', component: PageHome },
        { path: '/admin/post', component: PageAdminPosts },
        { path: '/admin/board', component: PageBoards }
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