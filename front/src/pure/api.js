// import config from '../../config'

import DirectusSDK from '@directus/sdk-js'
import Signal from './Signal'

const API_DIR = '/api/'
// const config = {}

const options = {
  url: API_DIR,
  project: 'inspire',
  storage: window.localStorage
}

const directus = new DirectusSDK(options)

class Api {
  constructor () {
    this.apiURL = API_DIR
    this.directus = directus
    this.boards = null
    this.posts = null

    console.log('->')
    console.log(this.directus)

    this.isLogged = false
    this.onLogin = new Signal()
  }

  /* getHeaders () {
    const init = {
      Accept: 'application/json'
    }

    if (this.token) { init['Content-Type'] = this.token }

    return new Headers(init)
  } */

  getThumbURL (uid) {
    return '' // config.api.abs + '/thumbs/' + uid
  }

  getFileURL (uid) {
    return '' // config.api.abs + '/files/' + uid
  }

  getPosts ({ tags = [], types = [], noTags = [], noTypes = [], limit = 100, offset = 0 } = {}) {
    return this.directus.getItems('posts', {})
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

  isLoggedIn () {
    return this.directus.isLoggedIn()
  }

  getMe () {
    return this.directus.getMe(/* { fields: [
      'id',
      'avatar',
      'email',
      'first_name',
      'last_name',
      'locale',
      'role'
    ]
    } */)
  }

  logout () {
    return this.directus.logout()
      .then(data => {
        this.isLogged = false
        this.onLogin.dispatch(false)
        return data
      })
  }

  login (email, password) {
    // this.directus.isLoggedIn()
    //   .then(console.log)
    //   .catch(console.log)
    //   return new Promise(resolve => resolve())
    // }

    return this.directus.login({
      email,
      password
    })
      .then(data => {
        this.isLogged = data
        this.onLogin.dispatch(data)
      })
      .catch(error => {
        this.isLogged = false
        this.onLogin.dispatch(false)
        throw error
      })

    // return directus.login({
    //   email,
    //   password
    // })
    //   .then(console.log)
    //   .catch(console.error)
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
}

// Api.testSuccess = data => {
//   if (!data.success) { throw Error('API error: ' + data.message) }

//   return data
// }

// Api.dataToFormData = data => {
//   const form = new FormData()
//   for (const key of Object.keys(data)) {
//     const val = data[key]
//     if (typeof val === typeof 'a' || typeof val === typeof 2) { form.append(key, val) } else if (Array.isArray(val)) { form.append(key, val.join(',')) } else if (val instanceof File) { form.append(key, val, val.name) } else { form.append(key, JSON.stringify(val)) }
//   }

//   return form
// }

const api = new Api()

export { Api }
export default api
