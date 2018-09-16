import config from '../../config'

class ApiGet
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

    getThumbURL(uid)
    {
        return config.api.abs + '/thumbs/' + uid
    }

    getFileURL(uid)
    {
        return config.api.abs + '/files/' + uid
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
            .then(ApiGet.testSuccess)
            .then(json => onLoad(json))
            .catch(error => onError(error.message))
    }
}

ApiGet.testSuccess = data =>
{
    if (!data.success)
        throw Error('API error: ' + data.message)
        
    return data
}

const apiGet = new ApiGet()

export { ApiGet }
export default apiGet