// import RemoteInstance from 'directus-sdk-javascript/remote'
import config from '../../config'

class Api {
  constructor () {
    this.boards = null
    this.posts = null

    // this.client = new RemoteInstance({
    //   url: config.api.url.root
    //   // accessToken: 'api-key-12345'
    //   /* headers: {
    //             'Access-Control-Allow-Origin': '*'
    //         } */
    // })
  }

  // /api/collections/get/posts

  getThumb (path, onLoad) {
    const info = {
      images: [config.api.url.assets + path],
      // src: config.api.url.root + path,
      w: 50,
      h: 50
      /* options: {
                quality: 80,
                mode: 'crop'
            } */
    }

    const init = {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'no-cors', // same-origin
      cache: 'default',
      body: JSON.stringify(info)
    }

    const url =
      config.api.url.root + 'mediamanager/thumbnails?token=' + config.api.token
    const request = new Request(url)

    fetch(request, init)
      // .then(collection => console.log(collection))
      .then(collection => collection.json())
      .then(json => onLoad(json))

    // if (false) {
    //   const info = {
    //     images: [path],
    //     w: 50,
    //     h: 50,
    //     options: {
    //       quality: 80,
    //       mode: "crop"
    //     }
    //   };

    //   const data = new FormData();
    //   data.append("json", JSON.stringify(info));

    //   const init = {
    //     headers: {
    //       Accept: "application/json, text/plain, */*",
    //       "Content-Type": "application/json"
    //     },
    //     method: "POST",
    //     mode: "no-cors", // same-origin
    //     cache: "default",
    //     body: data
    //   };

    //   // /api/collections/collection/posts?token=d66908b28464bf3a9f97118c8debe
    //   // /api/collections/get
    //   // /api/collections/get/posts?token=d66908b28464bf3a9f97118c8debe
    //   // /api/collections/get/{collectionname}?token={yourtoken}

    //   const url =
    //     config.api.url.root +
    //     "mediamanager/thumbnails?token=" +
    //     config.api.token;
    //   const request = new Request(url);

    //   fetch(request, init)
    //     // .then(collection => console.log(collection))
    //     .then(collection => collection.json())
    //     .then(json => onLoad(json));
    // }
  }

  getImage (path) {
    return (
      config.api.url.root +
      'cockpit/assets?token=' +
      config.api.token +
      '&src=' +
      encodeURIComponent(path) +
      '&w=200&h=200&o=true'
    )
    // https://getcockpit.com/documentation/api/cockpit
  }

  getGroups (onLoad) {
    const cleanData = data => {
      data.selector_tags = data.selector_tags.split(',')
      return data
    }

    this.client
      .getItems('group')
      // this.client._get('tables/post/rows' + search, params)
      .then(res => {
        return { data: res.data.map(cleanData), meta: res.meta }
      })
      .then(res => onLoad(res))
      .catch(err => console.error(err))
  }

  getPosts (onLoad, tags = []) {
    // https://api.getdirectus.com/1.1/#API_Endpoints

    /* const data = {
            'limit': 1
        } */

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
      filters: {
        tags: {}
      }

      // https://api.getdirectus.com/1.1/#Get_Parameters
      /* filters: {
                tags: {
                    in: '',
                    nin: ,
                    contains(),
                    ncontains()
                }
            } */
    }

    tags = tags.map(tag => tag.toLowerCase())
    const tagsIn = tags.filter(tag => tag.length > 0 && tag[0] !== '!')
    const tagsOut = tags
      .filter(tag => tag.length > 0 && tag[0] === '!')
      .map(tag => tag.substr(1))

    if (tagsIn.length > 0) {
      params.filters.tags.contains = tagsIn[0]
    }

    // params.filters.tags.contains = '3D,mesh'
    /* if (tagsIn.length > 0)
            params.filters.tags.contains = tagsIn

        if (tagsOut.length > 0)
            params.filters.tags.ncontains = tagsOut */

    // const search = '/?filters[tags][in]=3D,javascript' // '/?filters[tags][contains]=3D&filters[tags][contains]=javascript' // &filters[tags][logical]=and&filters[tags][in]=3D'

    const cleanData = data => {
      data.tags = data.tags.split(',')

      if (data.thumb) {
        data.thumb.data.colors = data.thumb.data.colors
          .split(',')
          .map(color => '#' + color)
      }

      if (data.content_file && data.content_file.data.colors) {
        data.content_file.data.colors = data.content_file.data.colors
          .split(',')
          .map(color => '#' + color)
      }

      return data
    }

    const filterTags = data => {
      const currentTags = data.tags.map(tag => tag.toLowerCase())
      for (const tag of tagsIn) {
        if (currentTags.indexOf(tag) < 0) {
          return false
        }
      }

      for (const tag of tagsOut) {
        if (currentTags.indexOf(tag) > -1) {
          return false
        }
      }

      /* for (const tag of data.tags)
            {
                const tagLow = tag.toLowerCase()
                if (tagsIn.length > 0 && tagsIn.indexOf(tagLow) < 0)
                    return false
                else if (tagsOut.indexOf(tagLow) > -1)
                    return false
            } */

      return true
    }

    // console.log(tagsIn, tagsOut)

    this.client
      .getItems('post', params)
      // this.client._get('tables/post/rows' + search, params)
      .then(res => {
        return { data: res.data.map(cleanData), meta: res.meta }
      })
      .then(res => {
        return { data: res.data.filter(filterTags), meta: res.meta }
      })
      .then(res => onLoad(res))
      .catch(err => console.error(err))

    /* fetch(request)
            .then(collection => collection.json())
            .then(json => onLoad(this.posts = json)) */
  }
}

const api = new Api()

export default api
