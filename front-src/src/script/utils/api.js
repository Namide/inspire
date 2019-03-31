import config from '../../config'

const getThumbURL = uid => config.api.abs + '/thumbs/' + uid
const getFileURL = uid => config.api.abs + '/files/' + uid

const cleanPosts = data =>
{
    data.data = data.data.map(cleanPost)
    return data
}

const cleanPost = data =>
{
    if (data.thumb && data.uid)
    {
        data.thumb.src = getThumbURL(data.uid)
    }

    if (data.content && data.content.path)
    {
        data.content.src = getFileURL(data.uid)
    }

    return data
}

class Api
{
    constructor()
    {
        this.boards = null
        this.posts = null

        this.user = null
        this.token = null
    }

    getHeaders()
    {
        const init = {
            Accept: 'application/json'
        }

        if (this.token)
            init['Content-Type'] = this.token

        return new Headers(init)
    }

    getPosts(onLoad, { tags = [], types = [], noTags = [], noTypes = [], limit = 100, offset = 0 } = {}, onError = msg => console.error(msg))
    {
        const args = (tags.length > 0 ? '/tags/' + encodeURIComponent(tags.join(',')) : '')
            + (noTags.length > 0 ? '/notags/' + encodeURIComponent(noTags.join(',')) : '')
            + (types.length > 0 ? '/types/' + encodeURIComponent(types.join(',')) : '')
            + (noTypes.length > 0 ? '/notypes/' + encodeURIComponent(noTypes.join(',')) : '')
            + '/limit/' + limit
            + '/offset/' + offset

        const url = config.api.abs + '/posts' + args
        const request = new Request(url)
        const params = {
            method: 'GET',
            headers: this.getHeaders(),
            mode: 'cors',
            cache: 'default'
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success && data.data ? (data.data = data.data.map(filterPost), data) : data)
            .then(Api.testSuccess)
            .then(cleanPosts)
            .then(json => onLoad(json))
            .catch(error => onError(error.message))
    }

    connect(mail, pass,
        onConnected = data => console.log(data.name, 'connected'),
        onError = msg => console.error(msg))
    {
        const form = Api.dataToFormData({mail, pass})
        const url = config.api.abs + '/auth/signin'
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        const saveSession = data =>
        {
            this.token = data.data.token
            this.user = {
                uid: data.data.uid,
                name: data.data.name,
                role: data.data.role,
                mail: data.data.mail
            }
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            .then(Api.testSuccess)
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(saveSession)
            .then(onConnected)
            .catch(onError)
    }

    addPost(onLoad, data, onError = msg => console.error(msg))
    {
        const form = Api.dataToFormData(data)
        const url = config.api.abs + '/posts/add'
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: this.getHeaders(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            .then(Api.testSuccess)
            .then(cleanPosts)
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    deletePost(onLoad, uid, onError = msg => console.error(msg))
    {
        const url = config.api.abs + '/posts/delete/' + uid
        const form = Api.dataToFormData({})
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: this.getHeaders(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            .then(data => data.json())
            .then(Api.testSuccess)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    updatePost(onLoad, uid, data, onError = msg => console.error(msg))
    {
        const newData = Object.assign({}, data)
        const url = config.api.abs + '/posts/edit/' + uid
        delete newData.uid
        const form = Api.dataToFormData(newData)

        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: this.getHeaders(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(Api.testSuccess)
            .then(cleanPosts)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    /*getGroups(onLoad, onError = msg => console.error(msg))
    {
        const cleanData = data =>
        {
            data.selector_tags = data.selector_tags.split(',')
            return data
        }

        this.client.getItems('group')
        // this.client._get('tables/post/rows' + search, params)
            .then(res => { return { data: res.data.map(cleanData), meta: res.meta } })
            .then(Api.testSuccess)
            .then(res => onLoad(res))
            .catch(err => console.error(err))
    }*/

    getDistantLink(onLoad, link, onError = msg => console.error(msg))
    {
        const form = Api.dataToFormData({link})
        const url = config.api.abs + '/distant'
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: this.getHeaders(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            .then(Api.testSuccess)
            // .then(data => data.success && data.data ? (data.data = data.data.map(filterPost), data) : data)
            .then(onLoad)
            .catch(onError)

        /*this.client.getItems(url, params)
        // this.client._get('tables/post/rows' + search, params)
            .then(res => { return { data: res.data.map(cleanData), meta: res.meta } })
            .then(res => { return { data: res.data.filter(filterTags), meta: res.meta } })
            .then(res => onLoad(res))
            .catch(err => console.error(err))*/
    }
}

Api.testSuccess = data =>
{
    if (!data.success)
        throw Error('API error: ' + data.message)
        
    return data
}

Api.dataToFormData = data =>
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

const api = new Api()

export { Api }
export default api