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

  addFiles (file, image, onProgress = ({ loaded, total }) => loaded / total) {
    let l1 = 0
    let t1 = file.size
    let l2 = 0
    let t2 = image.size

    const dispatchProgress = () => onProgress({ loaded: l1 + l2, total: t1 + t2 })

    return Promise.all([
      this.addFile(file, ({ loaded, total }) => {
        l1 = loaded
        t1 = total
        dispatchProgress()
      }),
      this.addFile(image, ({ loaded, total }) => {
        l2 = loaded
        t2 = total
        dispatchProgress()
      })
    ])
  }

  deleteFile (id) {
    // this.directus.
  }

  addPost (payload, onProgress = ({ loaded, total }) => loaded / total) {
    if (payload.file && payload.image) {
      return this.addFiles(payload.file, payload.image, onProgress)
        .then(([file, image]) => {
          return this.directus.createItem(
            'posts',
            Object.assign({}, payload, {
              file: file.data.data.id,
              image: image.data.data.id
            })
          )
        })
    } else if (payload.file) {
      return this.addFile(payload.file, onProgress)
        .then(file => {
          return this.directus.createItem(
            'posts',
            Object.assign({}, payload, { file: file.data.data.id })
          )
        })
    } else if (payload.image) {
      return this.addFile(payload.image, onProgress)
        .then(image => {
          return this.directus.createItem(
            'posts',
            Object.assign({}, payload, { image: image.data.data.id })
          )
        })
    } else {
      return this.directus.createItem('posts', payload)
    }
  }

  deletePost (payload) {
    const list = [this.directus.deleteItem('posts', payload.id)]
    if (payload.file) {
      list.push(this.directus.api.delete('files/' + payload.file.id))
    }
    if (payload.image) {
      list.push(this.directus.api.delete('files/' + payload.image.id))
    }

    return Promise.all(list)
  }

  updatePost (newPayload, oldPayload) {
    console.log(this.directus)
    console.log(oldPayload)
    console.log(newPayload)
    this.directus.deleteItem('files', newPayload.image.id)

    // deleteItem(collection, primaryKey)
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
