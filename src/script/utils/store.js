import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

    state: {
        // postFilter: post => true,
        posts: []
    },

    mutations: {

        updatePosts(state, posts)
        {
            state.posts.splice(0, state.posts.length, ...posts)
        },

        updatePost(state, post)
        {
            const i = state.posts.findIndex(({uid}) => post.uid)
            if (i > -1) {
                state.posts.splice(i, 1)
                Vue.nextTick(() => state.posts.splice(i, 0, post))
            }
        },

        deletePost(state, uid)
        {
            const i = state.posts.findIndex(post => post.uid === uid)
            if (i > -1) {
                state.posts.splice(i, 1)
            }
        },

        addPost(state, post)
        {
            state.posts.splice(0, 0, post)
        }
    }
})

export default store