import { h, app } from 'hyperapp'
import { location } from "@hyperapp/router"
import api from './utils/api'

const filterTags = list =>
{
    const tags = []
    const types = []
    const noTags = []
    const noTypes = []

    list.forEach(item => 
    {
        const s = item[0] + item[1]
        const f = item[0]

        if (s === '!@' || s === '@!')
            noTypes.push(item.substr(2))
        else if (f === '@')
            types.push(item.substr(1))
        else if (f === '!')
            noTags.push(item.substr(1))
        else
            tags.push(item)
    })

    return { tags, noTags, types, noTypes }
}

const actions = {

    location: location.actions,

    loadPosts: (tags = []) => (state, actions) => {
        console.log('actions.loadPosts(', tags, ')')
        api.getPosts(data =>
        {
            if (data.success)
            {
                console.log('OK', data.data)
                const postsData = data.data.map(data => Object.assign({
                    _isIn: false
                }, data))

                actions.setPosts(postsData)
            }
        }, filterTags(tags))
    },

    addTags: tags => (state, actions) =>
    {
        const list = state.filter.tags.concat(tags.map(tag => tag.trim()).filter(tag => state.filter.tags.indexOf(tag) < 0 && tag !== ''))
        actions.loadPosts(list)
        
        return {
            filter: {
                tags: list,
                type: state.filter.type
            }
        }
    },

    removeTag: tag => (state, actions) =>
    {
        const list = state.filter.tags.filter(currentTag => currentTag !== tag)
        actions.loadPosts(list)

        return {
            filter: {
                tags: list,
                type: state.filter.type
            }
        }
    },

    setPosts: list => state => ({ posts: list })
}

export default actions