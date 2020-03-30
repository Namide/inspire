// import config from '../../config'

import DirectusSDK from '@directus/sdk-js'
import Signal from './Signal'
import Item from './Item'
import { itemsToFilter } from '@/pure/tagHelpers'

const API_DIR = '/api'
// const config = {}
const options = {
  url: API_DIR,
  project: 'inspire',
  // storage: window.localStorage,
  // persist: true,
  mode: 'cookie'
}

const directus = new DirectusSDK(options)

const parseItem = payload => {
  const item = new Item()
  item.fromPayload(payload)
  return item
}

const parseGroup = payload => {
  return payload
}

class Api {
  constructor () {
    this.apiURL = API_DIR
    this.directus = directus
    this.groups = null
    this.items = null

    // this.isLogged = false
    this.onLogin = new Signal()
  }

  getThumbURL (uid) {
    return '' // config.api.abs + '/thumbs/' + uid
  }

  getFileURL (uid) {
    return '' // config.api.abs + '/files/' + uid
  }

  getItem (id) {
    const options = {
      filter: {
        id: {
          eq: id
        }
      },
      fields: ['*', 'image.*', 'file.*']
    }

    return this.directus
      .getItems('items', options)
      .then(({ data }) => data.map(parseItem))
      .then(data => data[0])
      .catch(console.error)
  }

  getItems (items, {
    limit = 100,
    offset = 0
  } = {}) {
    const { tags, noTags, types, noTypes } = itemsToFilter(items)
    const options = {
      // depth: 1,
      limit,
      offset,
      filter: {
        tags: {},
        types: {}
      },
      fields: ['*', 'image.*', 'file.*']
      /* filter: {
        runtime: {
          eq: 200
          gt: 200
        }
      } */
    }

    if (tags.length > 0) {
      options.filter.tags.contains = tags.join(',')
    }
    if (noTags.length > 0) {
      options.filter.tags.ncontains = noTags.join(',')
    }
    if (types.length > 0) {
      options.filter.types.contains = types.join(',')
    }
    if (noTypes.length > 0) {
      options.filter.types.ncontains = noTypes // noTypes.join(',')
    }

    return this.directus
      .getItems('items', options)
      .then(({ data }) => data.map(parseItem))
      .catch(console.error)
  }

  getGroups (items, {
    limit = 100,
    offset = 0
  } = {}) {
    const options = {
      // depth: 1,
      limit,
      offset,
      fields: ['*', 'image.*']
      /* filter: {
        runtime: {
          eq: 200
          gt: 200
        }
      } */
    }

    return this.directus
      .getItems('groups', options)
      .then(({ data }) => data.map(parseGroup))
      // .catch(console.error)
  }

  isLoggedIn () {
    return this.directus.isLoggedIn()
      .then(data => {
        if (data === true) {
          this.getMe()
            .then(data => this.onLogin.dispatch(data))
        } else {
          this.onLogin.dispatch(false)
        }
      })
  }

  getMe () {
    return this.directus
      .getMe({
        fields: [
          'id',
          'avatar',
          'email',
          'first_name',
          'last_name',
          'locale',
          // 'role',
          'avatar.*'
        ]
      })
      .then(({ data }) => {
        let avatar = null
        if (data.avatar) {
          const img = data.avatar.data.thumbnails.find(
            ({ dimension }) => dimension === '300x300'
          )
          if (img) {
            const src = API_DIR + img.relative_url.substring(1)
            avatar = {
              src,
              width: img.width,
              height: img.height
            }
          }
        }

        return {
          avatar,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          locale: data.locale
        }
      })
  }

  logout () {
    return this.directus
      .logout()
      .then(data => {
        // this.isLogged = false
        this.onLogin.dispatch(false)
        // sessionStorage.removeItem('inspire_token')
        return data
      })
      .catch(error => {
        console.log(error)
      })
  }

  login (email, password) {
    return this.directus
      .login({
        email,
        password
      })
      .then(data => {
        // sessionStorage.setItem('inspire_token', data.token)
        // this.isLogged = data
        if (data === true) {
          this.getMe()
            .then(this.onLogin.dispatch)
        } else {
          this.onLogin.dispatch(false)
        }
      })
      .catch(error => {
        // this.isLogged = false
        this.onLogin.dispatch(false)
        throw error
      })
  }
}

const api = new Api()

export { Api }
export default api
