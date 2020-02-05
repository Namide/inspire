import Post from '@/data/Post'
import apiSave from '@/pure/apiSave'
import PostContentSave from '@/data/PostContentSave'
import mimeTypes from '@/data/mime-types.json'

/**
 *
 * URL.revokeObjectURL(blob)
 * URL.createObjectURL(blob)
 *
 * @param {String} url
 * @returns {Promise<Object>}
 */
const fetchUrl = url => {
  return apiSave.getDistantLink(url)
    .then(response => {
      if (response.ok) {
        return response
      } else {
        throw new Error('Link not found')
      }
    })
    .then(response => {
      const contentType = response.headers.get('content-type')
      if (contentType.indexOf('text/html') > -1) {
        return response.text()
          .then(text => {
            return {
              types: ['link'],
              url,
              text
            }
          })
      }

      return response.blob()
        .then(blob => {
          let mimeData = null
          Object.keys(mimeTypes)
            .forEach(type => {
              mimeTypes[type]
                .forEach(({ ext, mimeType }) => {
                  if (mimeType === blob.type) {
                    mimeData = { ext, mimeType, type }
                  }
                })
            })

          const fileName = url.substring(url.lastIndexOf('/') + 1).split(/#|\?/)[0] || (mimeData ? mimeData.type + '.' + mimeData.ext : 'file')
          // return {
          //   file: new File([blob], fileName, { type: blob.type }),
          //   types: mimeData ? ['file', mimeData.type] : ['file']
          // }
          return {
            name: fileName,
            ext: mimeData ? mimeData.ext : fileName.split('.').pop(),
            types: mimeData ? [mimeData.type, 'file'] : ['file'],
            size: blob.size,
            blob
          }
        })
    })

  // https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
  //   if (!contentType) {
  //     throw new Error('Need content type')
  //   } else {
  //     console.log(mimeData, contentType)

  //     if (mimeData && mimeData.format === 'image') {
  //       return response.blob()
  //         .then(blob => ({
  //           ext: mimeData.ext,
  //           types: ['file', mimeData.format],
  //           blob
  //         }))
  //     } else {
  //       return response.blob()
  //         .then(blob => ({
  //           ext: url.split('.').pop().split(/#|\?/)[0],
  //           types: ['file'],
  //           blob
  //         }))
  //     }
  //   }
}

export default class PostSave extends Post {
  /**
   * @param {String} value
   * @returns {Promise}
   */
  setContentRaw (value) {
    const content = new PostContentSave()
    content.fromRaw(value)
    this.content = content.getJson()
    console.log(content)
    if (content.isURL()) {
      return this.updateByLink(this.content.url)
    }

    return new Promise(resolve => resolve(this))
  }

  updateByLink (url) {
    return fetchUrl(url)
      .then(fileInfos => {
        if (fileInfos.types.indexOf('link') > -1) {
          this.setLink(url, fileInfos.text)
          return this
        } else {
          this.setFile(fileInfos)
          return this
        }
      })
  }

  setFile ({ name, ext, types, size, blob }) {
    this.types = types
    this.file = {
      name,
      blob
    }
  }

  setLink (url, html) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    this.title = doc.title
    const metaDescription = doc.querySelector('meta[name="description"]')
    if (metaDescription) {
      this.description = metaDescription.getAttribute('content')
    }

    const image = doc.querySelector('meta[property="og:image"]')
    const images = doc.querySelectorAll('a[href]')
    if (image) {
      this.thumb = image.getAttribute('content')
    } else if (images.length > 0) {
      this.thumb = images[0].getAttribute('src')
    }

    this.types = ['link']
  }
}
