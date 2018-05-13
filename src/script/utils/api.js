import config from '../../config'

/*
const filterPost = data =>
{
    const newData = Object.assign({}, data)
    if (newData.tags)
        newData.tags = newData.tags.split(',')
        
    if (newData.types)
        newData.types = newData.types.split(',')
    
    if (newData.content_file)
        newData.content_file = JSON.parse(newData.content_file)
    
    return newData
}
*/

class Api
{
    constructor()
    {
        this.boards = null
        this.posts = null
    }

    _init()
    {
        const url = config.api.abs
        const request = new Request(url)
        const params = {
            method: 'GET',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default'
        }
        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success && data.data ? (data.data = data.data.map(filterPost), data) : data)
            .then(json => onLoad(json))
    }

    // /api/collections/get/posts

    getFileURL(uid)
    {
        return config.api.abs + '/files/' + uid
    }

    getGroups(onLoad)
    {
        const cleanData = data =>
        {
            data.selector_tags = data.selector_tags.split(',')
            return data
        }

        this.client.getItems('group')
        // this.client._get('tables/post/rows' + search, params)
            .then(res => { return { data: res.data.map(cleanData), meta: res.meta } })
            .then(res => onLoad(res))
            .catch(err => console.error(err))
    }

    getPosts(onLoad, tags = [])
    {
        tags = tags.map(tag => tag.toLowerCase())
        const tagsIn = tags.filter((tag) => tag.length > 0 && tag[0] !== '!')
        const tagsOut = tags.filter((tag) => tag.length > 0 && tag[0] === '!').map(tag => tag.substr(1))


        const url = config.api.abs + '/posts'
        const request = new Request(url)
        const params = {
            method: 'GET',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default'
        }
        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success && data.data ? (data.data = data.data.map(filterPost), data) : data)
            .then(json => onLoad(json))

        /*this.client.getItems(url, params)
        // this.client._get('tables/post/rows' + search, params)
            .then(res => { return { data: res.data.map(cleanData), meta: res.meta } })
            .then(res => { return { data: res.data.filter(filterTags), meta: res.meta } })
            .then(res => onLoad(res))
            .catch(err => console.error(err))*/
    }
}

const api = new Api()

export { Api }
export default api