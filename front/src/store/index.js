import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/pure/api'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    // postFilter: post => true,
    posts: []
  },

  actions: {
    /**
     *
     * @param {Object} context
     * @param {Object} { tags, noTags, types, noTypes }
     */
    getPosts ({ commit }, { tags = [], noTags = [], types = [], noTypes = [] } = {}) {
      api.getPosts(data => {
        // console.log('OK', data.success)
        if (data.success) { commit('updatePosts', data.data) }
      }, { tags, noTags, types, noTypes })
    },

    deletePost ({ commit }, { uid }) {
      api.deletePost(data => {
        if (data.success) { commit('deletePost', data.data.uid) }
      }, uid)
    },

    addPost ({ commit }, { post }) {
      // console.log('post', post)
      api.addPost(data => {
        if (data.success) { commit('addPost', data.data) }
      }, post)
    },

    updatePost ({ commit }, { uid, data }) {
      api.updatePost(data => {
        if (data.success) { commit('updatePost', data.data) }
      }, uid, data)
    },

    getDistantLink (url) {
      return api.getDistantLink(url)
    }
  },

  mutations: {
    clearPosts (state) {
      state.posts = []
    },

    updatePosts (state, posts) {
      state.posts.splice(0, state.posts.length, ...posts)
    },

    updatePost (state, post) {
      const i = state.posts.findIndex(({ uid }) => post.uid)
      if (i > -1) {
        state.posts.splice(i, 1)
        Vue.nextTick(() => state.posts.splice(i, 0, post))
      }
    },

    deletePost (state, uid) {
      const i = state.posts.findIndex(post => post.uid === uid)
      if (i > -1) {
        state.posts.splice(i, 1)
      }
    },

    addPost (state, post) {
      state.posts.splice(0, 0, post)
    }
  }
})
