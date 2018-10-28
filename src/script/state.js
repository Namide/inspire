import { location } from "@hyperapp/router"

const state = {

    edit: {
        isOpen: false,
        type: 'post',
        uid: 0,
        data: {  }
    },

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