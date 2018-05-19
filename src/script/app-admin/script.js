import VueRouter from 'vue-router'
import PageHome from '../page-home'
import PageAdminPosts from '../page-admin-posts'
import PageBoards from '../page-boards'
import config from '../../config'

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: config.routes.admin.home, component: PageHome /* , alias: '/' */ },
        { path: config.routes.admin.posts, component: PageAdminPosts },
        { path: config.routes.admin.boards, component: PageBoards }
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
    }
}