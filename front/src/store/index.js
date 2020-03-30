import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },

  getters: {
    isLogged: state => {
      return state.user !== null
    },
    userNick: state => {
      return state.user ? state.user.nick : null
    },
    userImage: state => {
      return state.user && state.user.image ? state.user.image : null
    }
  },

  actions: {

  },

  mutations: {
    user (state, user) {
      state.user = user
    }
  }
})
