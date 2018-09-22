import apiGet from '../utils/apiGet'

export default {

    state:
    {
        // postFilter: post => true,
        posts: []
    },

    actions:
    {
        /**
         * 
         * @param {Object} context 
         * @param {Object} { tags, noTags, types, noTypes }
         */
        getPosts({commit}, filter)
        {
            const onPosts = ({data, meta}) => commit('updatePosts', data)
            apiGet.getPosts(onPosts, { tags, noTags, types, noTypes })
        }
    },

    mutations:
    {
        clearPosts(state)
        {
            state.posts = []
        },

        updatePosts(state, posts)
        {
            state.posts.splice(0, state.posts.length, ...posts)
        }
    }
}
