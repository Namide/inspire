import Post from '@/pure/Post'
import apiSave from '@/pure/apiSave'
import PostContentSave from '@/pure/PostContentSave'
import mimeTypes from '@/data/mime-types.json'
import extractColors from 'extract-colors'
import externalURL from '@/pure/externalURL.js'

const getMimeData = _mimeType => {
  const mimeData = { ext: '', mimeType: '', type: '' }
  Object.keys(mimeTypes)
    .forEach(type => {
      mimeTypes[type]
        .forEach(({ ext, mimeType }) => {
          if (_mimeType === mimeType) {
            mimeData.ext = ext
            mimeData.mimeType = mimeType
            mimeData.type = type
          }
        })
    })

  return mimeData
}

/**
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
          const mimeData = getMimeData(blob.type)
          const fileName = url.substring(url.lastIndexOf('/') + 1).split(/#|\?/)[0] || (mimeData ? mimeData.type + '.' + mimeData.ext : 'file')
          // return {
          //   file: new File([blob], fileName, { type: blob.type }),
          //   types: mimeData ? ['file', mimeData.type] : ['file']
          // }
          return {
            isFile: true,
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
    this.contentObject = content.getJson()
    if (this.contentObject.type === 'url') {
      return this.updateByLink(this.contentObject.raw)
    }

    return new Promise(resolve => resolve(this))
  }

  extractColors (src) {
    return extractColors(src)
      .then(colors => {
        const accuracy = 4 // 4 * 4 * 4 => 64 colors

        this.colors = colors.map(color => color.hex)

        // optimise test : http://glslsandbox.com/e#61168.1
        this.colorsRound = [...new Set(colors.map(({ red, green, blue }) => {
          return Math.round(red * (accuracy - 1) / 255) * accuracy * accuracy +
            Math.round(green * (accuracy - 1) / 255) * accuracy +
            Math.round(blue * (accuracy - 1) / 255)
        }))]
      })
      .then(() => this)
  }

  setImageByURL (url) {
    return fetchUrl(url)
      .then(fileInfos => {
        return this.setImage(fileInfos)
      })
  }

  setImage (fileInfos) {
    const src = URL.createObjectURL(fileInfos.blob)
    this.image = {
      src,
      blob: fileInfos.blob
    }

    const title = fileInfos.name
      .split('-').join(' ')
      .split('_').join(' ')
      .split('  ').join(' ')

    this.title = title.substring(0, title.lastIndexOf('.'))

    this._disposeList.push(() => URL.revokeObjectURL(src))
    return this.extractColors(src)
  }

  updateFileByFileInfos (fileInfos) {
    this.types = [...fileInfos.types]
    this.image = null
    this.file = null
    if (fileInfos.types.indexOf('image') > -1) {
      return this.setImage(fileInfos)
        .then(() => this)
    } else {
      return this.setFile(fileInfos)
        .then(() => this)
    }
  }

  updateByLink (url) {
    return fetchUrl(url)
      .then(fileInfos => {
        if (fileInfos.types.indexOf('link') > -1) {
          this.types = [...fileInfos.types]
          return this.setLink(url, fileInfos.text)
            .then(() => this)
        } else {
          return this.updateFileByFileInfos(fileInfos)
        }
      })
  }

  removeFile () {
    this.types = []
    this.image = null
    this.file = null
    this.colors = []
    this.colorsRound = []
    this.contentObject = {}

    return new Promise(resolve => resolve(this))
  }

  updateByFile (file) {
    this.removeFile()

    const mimeData = getMimeData(file.type)
    const fileInfos = {
      type: 'file',
      name: file.name,
      ext: mimeData ? mimeData.ext : file.name.split('.').pop(),
      types: mimeData ? [mimeData.type, 'file'] : ['file'],
      size: file.size,
      blob: file
    }

    return this.updateFileByFileInfos(fileInfos)
  }

  setFile ({ name, ext, types, size, blob }) {
    this.types = types
    this.file = {
      type: 'file',
      name,
      blob
    }

    return new Promise(resolve => resolve(this))
  }

  analyseHtml (link, doc) {
    const url = new URL(link)
    return externalURL(url, doc)
      .then(data => {
        Object.keys(data).forEach(label => {
          this[label] = data[label]
        })

        if (!!this.title || !!this.description || !!this.image) {
          throw new Error('need more data')
        }

        return data
      })
      .catch(() => {
        if (!this.title) {
          this.title = doc.title
        }

        if (!this.description) {
          const metaDescription = doc.querySelector('meta[name="description"]')
          if (metaDescription) {
            this.description = metaDescription.getAttribute('content')
          }
        }

        if (!this.image) {
          const image = doc.querySelector('meta[property="og:image"]')
          const images = doc.querySelectorAll('a[href]')
          if (image) {
            this.image = image.getAttribute('content')
          } else if (images.length > 0) {
            this.image = images[0].getAttribute('src')
          }
        }
      })
  }

  setLink (url, html) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    this.types = ['link']

    return this.analyseHtml(url, doc)
  }
}
