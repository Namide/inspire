import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/pure/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // itemFilter: item => true,
    items: []
  },

  actions: {
    /**
     *
     * @param {Object} context
     * @param {Object} { tags, noTags, types, noTypes }
     */
    getItems (
      { commit },
      { tags = [], noTags = [], types = [], noTypes = [] } = {}
    ) {
      api.getItems(
        data => {
          // console.log('OK', data.success)
          if (data.success) {
            commit('updateItems', data.data)
          }
        },
        { tags, noTags, types, noTypes }
      )
    },

    deleteItem ({ commit }, { uid }) {
      api.deleteItem(data => {
        if (data.success) {
          commit('deleteItem', data.data.uid)
        }
      }, uid)
    },

    addItem ({ commit }, { item }) {
      // console.log('item', item)
      api.addItem(data => {
        if (data.success) {
          commit('addItem', data.data)
        }
      }, item)
    },

    updateItem ({ commit }, { uid, data }) {
      api.updateItem(
        data => {
          if (data.success) {
            commit('updateItem', data.data)
          }
        },
        uid,
        data
      )
    },

    getDistantLink (url) {
      return api.getDistantLink(url)
    }
  },

  mutations: {
    clearItems (state) {
      state.items = []
    },

    updateItems (state, items) {
      state.items.splice(0, state.items.length, ...items)
    },

    updateItem (state, item) {
      const i = state.items.findIndex(({ uid }) => item.uid)
      if (i > -1) {
        state.items.splice(i, 1)
        Vue.nextTick(() => state.items.splice(i, 0, item))
      }
    },

    deleteItem (state, uid) {
      const i = state.items.findIndex(item => item.uid === uid)
      if (i > -1) {
        state.items.splice(i, 1)
      }
    },

    addItem (state, item) {
      state.items.splice(0, 0, item)
    }
  }
})
