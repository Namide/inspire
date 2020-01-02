// import config from '../../config'

import DirectusSDK from '@directus/sdk-js'

const options = {
  url: '/api',
  project: 'inspire',
  storage: window.localStorage
}
const directus = new DirectusSDK(options)

const config = {}

class Api {
  constructor () {
    this.boards = null
    this.posts = null

    this.user = null
    this.token = null
  }

  getHeaders () {
    const init = {
      Accept: 'application/json'
    }

    if (this.token) { init['Content-Type'] = this.token }

    return new Headers(init)
  }

  getThumbURL (uid) {
    return '' // config.api.abs + '/thumbs/' + uid
  }

  getFileURL (uid) {
    return '' // config.api.abs + '/files/' + uid
  }

  getPosts ({ tags = [], types = [], noTags = [], noTypes = [], limit = 100, offset = 0 } = {}) {
    return directus.getItems('posts', {})
      .then(console.log)
      .catch(console.error)

    // client.getItems('posts')
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err))
    // const args = (tags.length > 0 ? '/tags/' + encodeURIComponent(tags.join(',')) : '') +
    //         (noTags.length > 0 ? '/notags/' + encodeURIComponent(noTags.join(',')) : '') +
    //         (types.length > 0 ? '/types/' + encodeURIComponent(types.join(',')) : '') +
    //         (noTypes.length > 0 ? '/notypes/' + encodeURIComponent(noTypes.join(',')) : '') +
    //         '/limit/' + limit +
    //         '/offset/' + offset

    // const url = config.api.abs + '/posts' + args
    // const request = new Request(url)
    // const params = {
    //   method: 'GET',
    //   headers: this.getHeaders(),
    //   mode: 'cors',
    //   cache: 'default'
    // }

    // fetch(request, params)
    //   .then(data => data.json())
    //   .then(Api.testSuccess)
    //   .then(json => onLoad(json))
    //   .catch(error => onError(error.message))
  }

  connect (email, password) {
    return directus.login({
      email,
      password
    })
      .then(console.log)
      .catch(console.error)
    /*
    const form = Api.dataToFormData({ mail, pass })
    const url = config.api.abs + '/auth/signin'
    const request = new Request(url)
    const params = {
      method: 'POST',
      headers: new Headers(),
      mode: 'cors',
      cache: 'default',
      body: form
    }

    const saveSession = data => {
      this.token = data.data.token
      this.user = {
        uid: data.data.uid,
        name: data.data.name,
        role: data.data.role,
        mail: data.data.mail
      }
    }

    fetch(request, params)
      .then(data => data.json())
      .then(Api.testSuccess)
      .then(saveSession)
      .then(onConnected)
      .catch(onError) */
  }

  addPost (body) {
    return directus.createItem('posts', body)
      .then(console.log)
      .catch(console.error)
    // const form = Api.dataToFormData(data)
    // const url = config.api.abs + '/posts/add'
    // const request = new Request(url)
    // const params = {
    //   method: 'POST',
    //   headers: this.getHeaders(),
    //   mode: 'cors',
    //   cache: 'default',
    //   body: form
    // }

    // fetch(request, params)
    //   .then(data => data.json())
    //   .then(Api.testSuccess)
    //   .then(onLoad)
    //   .catch(err => console.error(err))
  }

  deletePost (key) {
    return directus.deleteItem('posts', key)
      .then(console.log)
      .catch(console.error)

    // const url = config.api.abs + '/posts/delete/' + uid
    // const form = Api.dataToFormData({})
    // const request = new Request(url)
    // const params = {
    //   method: 'POST',
    //   headers: this.getHeaders(),
    //   mode: 'cors',
    //   cache: 'default',
    //   body: form
    // }

    // fetch(request, params)
    //   .then(data => data.json())
    //   .then(Api.testSuccess)
    //   .then(onLoad)
    //   .catch(err => console.error(err))
  }

  updatePost (onLoad, uid, data, onError = msg => console.error(msg)) {
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
      .then(data => data.json())
      .then(Api.testSuccess)
      .then(onLoad)
      .catch(err => console.error(err))
  }

  getDistantLink (onLoad, link, onError = msg => console.error(msg)) {
    const form = Api.dataToFormData({ link })
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
      .then(data => data.json())
      .then(Api.testSuccess)
      .then(onLoad)
      .catch(onError)
  }
}

Api.testSuccess = data => {
  if (!data.success) { throw Error('API error: ' + data.message) }

  return data
}

Api.dataToFormData = data => {
  const form = new FormData()
  for (const key of Object.keys(data)) {
    const val = data[key]
    if (typeof val === typeof 'a' || typeof val === typeof 2) { form.append(key, val) } else if (Array.isArray(val)) { form.append(key, val.join(',')) } else if (val instanceof File) { form.append(key, val, val.name) } else { form.append(key, JSON.stringify(val)) }
  }

  return form
}

const api = new Api()

export { Api }
export default api
