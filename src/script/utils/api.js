import RemoteInstance from 'directus-sdk-javascript/remote'
import config from '../../config'

class Api
{
    constructor()
    {
        this.boards = null
        this.posts = null

        this.client = new RemoteInstance({
            url: config.api.url.root,
            // accessToken: 'api-key-12345'
            /*headers: {
                'Access-Control-Allow-Origin': '*'
            }*/
        })
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
        // https://api.getdirectus.com/1.1/#API_Endpoints

        /*const data = {
            'limit': 1
        }*/
        
        // /api/collections/collection/posts?token=d66908b28464bf3a9f97118c8debe
        // /api/collections/get
        // /api/collections/get/posts?token=d66908b28464bf3a9f97118c8debe
        // /api/collections/get/{collectionname}?token={yourtoken}

        // const url = config.api.url.root + 'tables/post/rows'
        // const request = new Request(url)

        // https://api.getdirectus.com/1.1/#Global_Parameters
        const params = {
            depth: 1,
            limit: 10000,
            // offset: 1

            // https://api.getdirectus.com/1.1/#Get_Parameters
            /* filters: {
                tags: {
                    in: '',
                    nin: ,
                    contains(),
                    ncontains()
                }
            }*/
            
        }

        this.client.getItems('post', params)
            .then(res => onLoad(res))
            .catch(err => console.error(err))

        /*fetch(request)
            .then(collection => collection.json())
            .then(json => onLoad(this.posts = json))*/

    }
}

const api = new Api()

export default api