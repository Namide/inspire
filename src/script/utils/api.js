import config from '../../config'

class Api
{
    constructor()
    {
    }

    // /api/collections/get/posts

    getBoards(onLoad)
    {
        const init = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: 'GET',
            mode: 'no-cors', // same-origin
            cache: 'default'
        }
        
        // /api/collections/collection/posts?token=d66908b28464bf3a9f97118c8debe
        // /api/collections/get
        // /api/collections/get/posts?token=d66908b28464bf3a9f97118c8debe
        // /api/collections/get/{collectionname}?token={yourtoken}

        const url = config.api.url + 'collections/get/board?token=' + config.api.token
        const request = new Request(url)

        fetch(request/*, init*/)
            // .then(collection => console.log(collection))
            .then(collection => collection.json())
            .then(onLoad)
    }

    getPosts(onLoad)
    {
        const init = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: 'GET',
            mode: 'no-cors', // same-origin
            cache: 'default'
        }
        
        // /api/collections/collection/posts?token=d66908b28464bf3a9f97118c8debe
        // /api/collections/get
        // /api/collections/get/posts?token=d66908b28464bf3a9f97118c8debe
        // /api/collections/get/{collectionname}?token={yourtoken}

        const url = config.api.url + 'collections/get/post?token=' + config.api.token
        const request = new Request(url)

        fetch(request/*, init*/)
            // .then(collection => console.log(collection))
            .then(collection => collection.json())
            .then(onLoad)
    }
}

const api = new Api()

export default api