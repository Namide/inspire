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

    return fetch(link) // request('get', '/custom/gateway')
  }
}

const apiSave = new ApiSave()

export { ApiSave }
export default apiSave
