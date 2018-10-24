import { location } from "@hyperapp/router"

const state = {
    location: location.state,
    // search: {

    // },
    filter: {
        tags: [],
        type: 'post'
    },

    posts: []
}

export default state