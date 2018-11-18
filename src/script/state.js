import { location } from "@hyperapp/router"

const state = {

    edit: null,

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