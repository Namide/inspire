import Vue from 'vue'
import VueRouter from 'vue-router'
import PageHome from '../views/Home'
import PagePosts from '../views/Posts'
import PageBoards from '../views/Boards'

// Dynamic load
const PageAdminPosts = () =>
  import(/* webpackChunkName: "admin" */ '../views/AdminPosts')

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: PageHome,
    meta: {
      auth: false
    }
  },
  {
    name: 'posts',
    path: '/post',
    component: PagePosts,
    meta: {
      auth: false
    }
  },
  {
    name: 'boards',
    path: '/board',
    component: PageBoards,
    meta: {
      auth: false
    }
  },
  {
    name: 'adminHome',
    path: '/admin',
    component: PageHome,
    meta: {
      auth: true
    }
  },
  {
    name: 'adminPosts',
    path: '/admin/post',
    component: PageAdminPosts,
    meta: {
      auth: true
    }
  },
  {
    name: 'adminBoards',
    path: '/admin/board',
    component: PageBoards,
    meta: {
      auth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
