import apiSet from '../utils/apiSet'
import store from './storeGet'

export default {

    state: store.state,

    actions: Object.assign({

        deletePost({commit}, {uid})
        {
            apiSet.deletePost(data =>
            {
                if (data.success)
                    commit('deletePost', data.data.uid)
            }, uid)
        },

        addPost({commit}, {post})
        {
            console.log('post', post)
            apiSet.addPost(data =>
            {
                if (data.success)
                    commit('addPost', data.data)
    
            }, post)
        },

        updatePost({commit}, {uid, data})
        {
            apiSet.updatePost(data =>
            {
                if (data.success)
                    commit('updatePost', data.data)
            
            }, uid, data)
        }
    }, store.actions),

    mutations: Object.assign({

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

    }, store.mutations)
}
