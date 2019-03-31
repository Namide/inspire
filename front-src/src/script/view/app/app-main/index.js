import './style.sass'
import { h, app } from 'hyperapp'
import { Link, Route, location } from '@hyperapp/router'
import config from '../../../../config'

import PageHome from '../../page/page-home'
import PagePosts from '../../page/page-posts'
import PageAdminPosts from '../../page/page-admin-posts'
import PageAdminHome from '../../page/page-admin-home'

/*
const Home = () => <h2>Home</h2>
const About = () => <h2>About</h2>
const Topic = ({ match }) => <h3>{match.params.topicId}</h3>
const TopicsView = ({ match }) => (
    <div key="topics">
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/components`}>Components</Link>
            </li>
            <li>
                <Link to={`${match.url}/single-state-tree`}>Single State Tree</Link>
            </li>
            <li>
                <Link to={`${match.url}/routing`}>Routing</Link>
            </li>
        </ul>

        {match.isExact && <h3>Please select a topic.</h3>}
        <Route parent path={`${match.path}/:topicId`} render={Topic} />
    </div>
)
*/

export default (state, actions) => (

    <main>

        <h1 class="main-title">
            Inspire
        </h1>

        <nav class="main-nav">
            <Link to={config.routes.front.home} class="link">Home</Link>
            <Link to={config.routes.front.posts} class="link">Posts</Link>
            <Link to={config.routes.front.adminPosts} class="link">Admin</Link>
        </nav>

        <Route path={config.routes.front.home} render={PageHome} state={state} />
        <Route path={config.routes.front.posts} render={PagePosts} state={state} />
        <Route path={config.routes.front.adminPosts} render={PageAdminPosts} />

    </main>
)

/*import VueRouter from 'vue-router'
import PageHome from '../page-home'
import PagePosts from '../page-posts'
import PageAdminPosts from '../page-admin-posts'
import PageBoards from '../page-boards'
import config from '../../config'

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: config.routes.front.home, component: PageHome },
        { path: config.routes.front.posts, component: PagePosts },
        { path: config.routes.front.boards, component: PageBoards },
        { path: config.routes.front.adminHome, component: PageHome },
        { path: config.routes.front.adminPosts, component: PageAdminPosts },
        { path: config.routes.front.adminBoards, component: PageBoards }
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
}*/