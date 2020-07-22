// https://html.developreference.com/article/17026457/koa.js+streaming+response+from+remote+url
module.exports = function (url, stream) {

  return new Promise((resolve, reject) => {
    if (url.indexOf('https') > -1) {
      const https = require('https')
      https.get(url, response => {
        resolve(response)
      }).on('error', (err) => {
        reject(err)
      })
    } else if (url.indexOf('http') > -1) {
      const http = require('http')
      http.get(url, response => {
        resolve(response)
      }).on('error', (err) => {
        reject(err)
      })
    } else {
      reject(new Error('URL not standard'))
    }
  })
}
