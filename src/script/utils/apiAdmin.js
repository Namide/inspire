import config from '../../config'
import { Api } from './api'

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
        else
            form.append(key, JSON.stringify(val))
    }

    return form
}

class ApiAdmin extends Api
{
    constructor()
    {
        super()
    }

    addPost(onload, data)
    {
        const form = dataToFormData(data)
        const url = config.api.url.root + '/posts'
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
            .then(json => onLoad(json))
    }

    updatePost(onload, data)
    {
        const form = dataToFormData(data)
        const url = config.api.url.root + '/posts'
        const request = new Request(url)
        const params = {
            method: 'PUT',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(json => onLoad(json))
    }
}


const apiAdmin = new ApiAdmin()

export default apiAdmin