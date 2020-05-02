
module.exports = function (url) {
  return new Promise((resolve, reject) => {
    if (url.indexOf('https') > -1) {
      const https = require('https')
      https.get(url, resp => {
        let data = ''
        resp.on('data', (chunk) => data += chunk)
        resp.on('end', () => resolve(data))
      }).on('error', (err) => {
        reject(err)
      })
    } else if (url.indexOf('http') > -1) {
      const http = require('http')
      http.get(url, resp => {
        let data = ''
        resp.on('data', (chunk) => data += chunk)
        resp.on('end', () => resolve(data))
      }).on('error', (err) => {
        reject(err)
      })
    } else {
      reject(new Error('URL not standard'))
    }
  })
}
