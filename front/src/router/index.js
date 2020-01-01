import Vue from 'vue'
import VueRouter from 'vue-router'
import PageHome from '../views/Home'
import PagePosts from '../views/Posts'
import PageBoards from '../views/Boards'

// Dynamic load
const PageAdminPosts = () => import(/* webpackChunkName: "admin" */ '../views/AdminPosts')

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: PageHome
  },
  {
    name: 'posts',
    path: '/post',
    component: PagePosts
  },
  {
    name: 'boards',
    path: '/board',
    component: PageBoards
  },
  {
    name: 'adminHome',
    path: '/admin',
    component: PageHome
  },
  {
    name: 'adminPosts',
    path: '/admin/post',
    component: PageAdminPosts
  },
  {
    name: 'adminBoards',
    path: '/admin/board',
    component: PageBoards
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
