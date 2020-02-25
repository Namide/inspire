import { Api } from './api'

class ApiSave extends Api {
  /**
   * @param {String} link
   * @returns {Promise}
   */
  getDistantLink (link) {
    // const form = Api.dataToFormData({ link })
    // const url = config.api.abs + '/distant'
    // const request = new Request(url)
    // const params = {
    //   method: 'POST',
    //   headers: this.getHeaders(),
    //   mode: 'cors',
    //   cache: 'default',
    //   body: form
    // }

    const url = new URL(this.apiURL + '/inspire/custom/gateway', window.location.origin)
    url.searchParams.append('link', link)

    return fetch(url.href /*, { mode: 'cors' } */) // request('get', '/custom/gateway')
  }

  /**
   * @param {File} file
   * @param {Function} onProgress
   */
  addFile (file, onProgress = () => 1) {
    const formData = new FormData()
    formData.append('file', file)
    console.log(formData)
    return this.directus
      .uploadFiles(formData, onProgress)
  }

  addPost (body) {
    console.log(body)
    this.addFile(body.image.blob, (data) => console.log(data))
      .then(data => console.log('added:', data))
    return { }

    // return this.directus.createItem('posts', body)
    //   .then(console.log)
    //   .catch(console.error)
  }

  deletePost (key) {
    return this.directus.deleteItem('posts', key)
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

  updatePost (uid, data) {
    // const newData = Object.assign({}, data)
    // const url = config.api.abs + '/posts/edit/' + uid
    // delete newData.uid
    // const form = Api.dataToFormData(newData)

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
}

const apiSave = new ApiSave()

export { ApiSave }
export default apiSave
