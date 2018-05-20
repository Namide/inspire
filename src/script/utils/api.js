import config from '../../config'

const dataToFormData = data =>
{
    const form = new FormData()
    for (const key of Object.keys(data))
    {
        const val = data[key]
        if (typeof val === typeof 'a' || typeof val === typeof 2)
            form.append(key, val)
        else if (Array.isArray(val))
            form.append(key, val.join(','))
        else if (val instanceof File)
            form.append(key, val, val.name)
        else
            form.append(key, JSON.stringify(val))
    }

    return form
}

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

    addPost(onLoad, data)
    {
        const form = dataToFormData(data)
        const url = config.api.abs + '/posts'
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: new Headers(/*{
                'Content-Type': 'multipart/form-data'
            }*/),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    deletePost(onLoad, uid)
    {
        const url = config.api.abs + '/posts/delete/' + uid
        const request = new Request(url)
        const params = {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json',
                // 'Access-Control-Allow-Methods': 'DELETE'
                // 'content-type': 'application/json'
            }),
            //mode: 'cors',
            //cache: 'default',
            // body: form
        }

        fetch(request, params)
            .then(data => data.json())
            .then(onLoad)
            .catch(err => console.error(err))
    }

    updatePost(onLoad, uid, data)
    {
        const newData = Object.assign({}, data)
        const url = config.api.abs + '/posts/' + uid
        delete newData.uid
        const form = dataToFormData(newData)

        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    getThumbURL(uid)
    {
        return config.api.abs + '/thumbs/' + uid
    }

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

    getDistantLink(onLoad, link)
    {
        const form = dataToFormData({link})
        const url = config.api.abs + '/distant-link'
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default',
            body: form
        }
        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success && data.data ? (data.data = data.data.map(filterPost), data) : data)
            .then(onLoad)

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