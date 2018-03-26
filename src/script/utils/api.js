import config from '../../config'

class Api
{
    constructor()
    {
        this.boards = null
        this.posts = null
    }

    // /api/collections/get/posts

    getThumb(path, onLoad)
    {
        const info = {
            images: [config.api.url.assets + path],
            // src: config.api.url.root + path,
            w: 50,
            h: 50,
            /*options: {
                quality: 80,
                mode: 'crop'
            }*/
        }

        const init = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            mode: 'no-cors', // same-origin
            cache: 'default',
            body: JSON.stringify(info)
        }

        const url = config.api.url.root + 'mediamanager/thumbnails?token=' + config.api.token
        const request = new Request(url)

        fetch(request, init)
            // .then(collection => console.log(collection))
            .then(collection => collection.json())
            .then(json => onLoad(json))


        return

        if (false)
        {
                
            const info = {
                images: [path],
                w: 50,
                h: 50,
                options: {
                    quality: 80,
                    mode: 'crop'
                }
            }

            const data = new FormData()
            data.append('json', JSON.stringify(info))

            const init = {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                mode: 'no-cors', // same-origin
                cache: 'default',
                body: data
            }
            
            // /api/collections/collection/posts?token=d66908b28464bf3a9f97118c8debe
            // /api/collections/get
            // /api/collections/get/posts?token=d66908b28464bf3a9f97118c8debe
            // /api/collections/get/{collectionname}?token={yourtoken}

            const url = config.api.url.root + 'mediamanager/thumbnails?token=' + config.api.token
            const request = new Request(url)

            fetch(request, init)
                // .then(collection => console.log(collection))
                .then(collection => collection.json())
                .then(json => onLoad(json))
            
        }
    }

    getImage(path)
    {
        return config.api.url.root + 'cockpit/assets?token='
            + config.api.token + '&src='
            + encodeURIComponent(path)
            + '&w=200&h=200&o=true'
            // https://getcockpit.com/documentation/api/cockpit
    }

    getBoards(onLoad)
    {
        if (this.boards)
        {
            console.log(this.boards)
            return onLoad(this.boards)
        }

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

        const url = config.api.url.root + 'collections/get/board?token=' + config.api.token
        const request = new Request(url)

        fetch(request/*, init*/)
            // .then(collection => console.log(collection))
            .then(collection => collection.json())
            .then(json => onLoad(this.boards = json))
    }

    getPosts(onLoad)
    {
        if (this.posts)
        {
            return onLoad(this.posts)
        }

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

        const url = config.api.url.root + 'collections/get/post?token=' + config.api.token
        const request = new Request(url)

        fetch(request/*, init*/)
            // .then(collection => console.log(collection))
            .then(collection => collection.json())
            .then(json => onLoad(this.posts = json))
    }
}

const api = new Api()

export default api