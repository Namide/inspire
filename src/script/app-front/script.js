import VueRouter from 'vue-router'
import PageHome from '../page-home'
import PagePosts from '../page-posts'
import PageBoards from '../page-boards'
import config from '../../config'

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: config.routes.front.home, component: PageHome },
        { path: config.routes.front.posts, component: PagePosts },
        { path: config.routes.front.boards, component: PageBoards }
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