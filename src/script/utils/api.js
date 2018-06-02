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

const testSuccess = data =>
{
    if (!data.success)
        throw Error('API error: ' + data.message)
        
    return data
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

    connect(mail, pass,
        onConnected = data => console.log(data.name, 'connected'),
        onError = msg => console.error(msg))
    {
        const form = dataToFormData({mail, pass})
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
            .then(testSuccess)
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(saveSession)
            .then(onConnected)
            .catch(onError)
    }

    addPost(onLoad, data, onError = msg => console.error(msg))
    {
        const form = dataToFormData(data)
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
            .then(testSuccess)
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    deletePost(onLoad, uid, onError = msg => console.error(msg))
    {
        const url = config.api.abs + '/posts/delete/' + uid
        const request = new Request(url)
        const params = {
            method: 'GET',
            headers: this.getHeaders(),
            //mode: 'cors',
            //cache: 'default',
            // body: form
        }

        fetch(request, params)
            .then(data => data.json())
            .then(testSuccess)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    updatePost(onLoad, uid, data, onError = msg => console.error(msg))
    {
        const newData = Object.assign({}, data)
        const url = config.api.abs + '/posts/edit/' + uid
        delete newData.uid
        const form = dataToFormData(newData)

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
            .then(testSuccess)
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
            .then(testSuccess)
            .then(res => onLoad(res))
            .catch(err => console.error(err))
    }*/

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
            .then(testSuccess)
            .then(json => onLoad(json))
            .catch(error => onError(error.message))

        /*this.client.getItems(url, params)
        // this.client._get('tables/post/rows' + search, params)
            .then(res => { return { data: res.data.map(cleanData), meta: res.meta } })
            .then(res => { return { data: res.data.filter(filterTags), meta: res.meta } })
            .then(res => onLoad(res))
            .catch(err => console.error(err))*/
    }

    getDistantLink(onLoad, link, onError = msg => console.error(msg))
    {
        const form = dataToFormData({link})
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
            .then(testSuccess)
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