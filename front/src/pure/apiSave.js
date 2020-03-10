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

    const url = new URL(
      this.apiURL + '/inspire/custom/gateway',
      window.location.origin
    )
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
    // console.log(formData)
    return this.directus.uploadFiles(formData, onProgress)
  }

  addPost (payload, onProgress = ({ loaded, total }) => loaded / total) {
    // console.log(payload)

    if (payload.file) {
      let l1 = 0
      let t1 = 1
      let l2 = 0
      let t2 = 1

      const dispatchProgress = () =>
        onProgress({ loaded: l1 + l2, total: t1 + t2 })

      if (payload.image) {
        return Promise.all([
          this.addFile(payload.file, ({ loaded, total }) => {
            l1 = loaded
            t1 = total
            dispatchProgress()
          }),
          this.addFile(payload.image, ({ loaded, total }) => {
            l2 = loaded
            t2 = total
            dispatchProgress()
          })
        ]).then(([file, image]) => {
          // console.log(file, image)
          return this.directus.createItem(
            'posts',
            Object.assign({}, payload, {
              file: file.data.data.id,
              image: image.data.data.id
            })
          )
        })
      } else {
        return this.addFile(payload.file, onProgress).then(file => {
          // console.log(file)
          return this.directus.createItem(
            'posts',
            Object.assign({}, payload, { file: file.data.data.id })
          )
        })
      }
    } else if (payload.image) {
      return this.addFile(payload.image, onProgress).then(image => {
        // console.log(image)
        return this.directus.createItem(
          'posts',
          Object.assign({}, payload, { image: image.data.data.id })
        )
      })
    } else {
      return this.directus.createItem('posts', payload)
    }

    // return this.directus.createItem('posts', body)
    //   .then(console.log)
    //   .catch(console.error)
  }

  deletePost (key) {
    return this.directus
      .deleteItem('posts', key)
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

  setPost (uid, data) {
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
