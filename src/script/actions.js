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

const deepAssign = (target, source) =>
{
    if (source === undefined)
    {
        return target
    }
    else if (target === undefined)
    {
        return JSON.parse(JSON.stringify(source))
    }
    else if (target === Object(target) && source === Object(source))
    {
        const keys = [...new Set([...Object.keys(target), ...Object.keys(source)])].forEach(key =>
        {
            target[key] = deepAssign(target[key], source[key])
        })

        return target
    }
    else
    {
        return target
    }
}

const actions = {

    custom: data => state =>
    {
        const out = { }
        Object.keys(data).forEach(key => {
            out[key] = deepAssign(data[key], state[key])
        })

        return out
    },

    location: location.actions,

    onEdit : ({uid, type = 'post', data = { stage: 0 }}) => state =>
    {
        const data = JSON.parse(JSON.stringify(state.posts.find(post => post.uid === uid) || { uid }))

        return {
            edit: {
                modal: {
                    state: 0,
                    type,
                    isFile: true
                },
                data // displayed data in modal = original data + modified data
            }
        }
    },

    onEditClose : () => state =>
    {
        return { edit: null }
    },

    loadPosts: (tags = []) => (state, actions) =>
    {
        api.getPosts(data =>
        {
            if (data.success)
            {
                console.log('OK', data.data)
                actions.setPosts(data.data)
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