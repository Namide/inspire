import config from '../../config'
import apiGet from './apiGet'
import { ApiGet } from './apiGet'

class ApiSet
{
    constructor()
    {
        this.apiGet = apiGet
    }

    connect(mail, pass,
        onConnected = data => console.log(data.name, 'connected'),
        onError = msg => console.error(msg))
    {
        const form = ApiSet.dataToFormData({mail, pass})
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
            .then(ApiGet.testSuccess)
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(saveSession)
            .then(onConnected)
            .catch(onError)
    }

    addPost(onLoad, data, onError = msg => console.error(msg))
    {
        const form = ApiSet.dataToFormData(data)
        const url = config.api.abs + '/posts/add'
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: this.apiGet.getHeaders(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            .then(ApiGet.testSuccess)
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    deletePost(onLoad, uid, onError = msg => console.error(msg))
    {
        const url = config.api.abs + '/posts/delete/' + uid
        const form = ApiSet.dataToFormData({})
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: this.apiGet.getHeaders(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            .then(data => data.json())
            .then(ApiGet.testSuccess)
            .then(onLoad)
            .catch(err => console.error(err))
    }

    updatePost(onLoad, uid, data, onError = msg => console.error(msg))
    {
        const newData = Object.assign({}, data)
        const url = config.api.abs + '/posts/edit/' + uid
        delete newData.uid
        const form = ApiSet.dataToFormData(newData)

        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: this.apiGet.getHeaders(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(ApiGet.testSuccess)
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
            .then(ApiGet.testSuccess)
            .then(res => onLoad(res))
            .catch(err => console.error(err))
    }*/

    getDistantLink(onLoad, link, onError = msg => console.error(msg))
    {
        const form = ApiSet.dataToFormData({link})
        const url = config.api.abs + '/distant'
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: this.apiGet.getHeaders(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            .then(ApiGet.testSuccess)
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

ApiSet.dataToFormData = data =>
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

const apiSet = new ApiSet()

export { ApiSet }
export default apiSet