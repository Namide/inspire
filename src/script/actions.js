import { h, app } from 'hyperapp'
import { location } from "@hyperapp/router"
import api from './utils/api'

const actions = {

    location: location.actions,

    loadPosts: ({ tags = [], noTags = [], types = [], noTypes = []} = {}) => (state, actions) => {
        console.log('actions.posts.load', actions)
        api.getPosts(data =>
        {
            if (data.success) {
                console.log('OK', data.data)
                actions.setPosts(data.data)
            }
        }, { tags, noTags, types, noTypes })
    },

    setPosts: list => state => ({ posts: list })
}

export default actions