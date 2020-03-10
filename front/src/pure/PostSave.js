import Post from '@/pure/Post'
import apiSave from '@/pure/apiSave'
import extractColors from 'extract-colors'
import externalURL from '@/pure/externalURL.js'
import { extractType, getMimeData } from '@/pure/contentHelpers.js'
import marked from 'marked'
// https://css-tricks.com/choosing-right-markdown-parser/#article-header-id-0

/**
 * @param {String} url
 * @returns {Promise<Object>}
 */
const fetchUrl = url => {
  return apiSave.getDistantLink(url).then(response => {
    if (response.ok) {
      return response
    } else {
      throw new Error('Link not found')
    }
  })
}

const responseToFile = (response, url = response.url) => {
  return response.blob().then(blob => {
    const mimeData = getMimeData(blob.type)
    const fileName =
      url.substring(url.lastIndexOf('/') + 1).split(/#|\?/)[0] ||
      (mimeData ? mimeData.type + '.' + mimeData.ext : mimeData.type)

    return new File([blob], fileName)
  })
}

export default class PostSave extends Post {
  /**
   * @param {String} input
   * @returns {Promise}
   */
  setInput (input) {
    this.input = input
    const type = extractType(input)
    if (type === 'url') {
      this.input = input.trim()
      return this._updateByLink(this.input)
    } else if (type === 'embed') {
      this.types = [type]
      this.input = input.trim()
      this.content = this.input
    } else {
      this.types = [type]
      this.input = input
      this.content = marked(this.input)
    }

    return Promise.resolve(this)
  }

  _extractColors (src) {
    return extractColors(src)
      .then(colors => {
        const accuracy = 4 // 4 * 4 * 4 => 64 colors

        this.colors = colors.map(color => color.hex)

        // optimise test : http://glslsandbox.com/e#61168.1
        this.colorsRound = [
          ...new Set(
            colors.map(({ red, green, blue }) => {
              return (
                Math.round((red * (accuracy - 1)) / 255) * accuracy * accuracy +
                Math.round((green * (accuracy - 1)) / 255) * accuracy +
                Math.round((blue * (accuracy - 1)) / 255)
              )
            })
          )
        ]
      })
      .then(() => this)
  }

  _setImageByURL (url) {
    return fetchUrl(url)
      .then(response => responseToFile(response, url))
      .then(file => this._setImage(file))
  }

  _setImage (file) {
    if (!this.title) {
      const title = file.name
        .split('-')
        .join(' ')
        .split('_')
        .join(' ')
        .split('  ')
        .join(' ')
        .substring(0, file.name.lastIndexOf('.'))

      this.title = title
    }
    this.image = file

    const src = URL.createObjectURL(file)
    return this._extractColors(src).then(() => URL.revokeObjectURL(src))
  }

  // _updateFileByFileInfos (fileInfos) {
  //   this.types = [...fileInfos.types]
  //   this.image = null
  //   this.file = null
  //   if (fileInfos.types.indexOf('image') > -1) {
  //     return this._setImage(fileInfos)
  //       .then(() => this)
  //   } else {
  //     return this._setFile(fileInfos)
  //       .then(() => this)
  //   }
  // }

  _updateByLink (url) {
    return fetchUrl(url).then(response => {
      const contentType = response.headers.get('content-type')

      // HTML
      if (contentType.indexOf('text/html') > -1) {
        return response.text().then(text => {
          const parser = new DOMParser()
          const doc = parser.parseFromString(text, 'text/html')
          return this._analyseHtml(url, doc)
        })

        // FILE
      } else {
        return response.blob().then(blob => {
          const mimeData = getMimeData(blob.type)
          const fileName =
            url.substring(url.lastIndexOf('/') + 1).split(/#|\?/)[0] ||
            (mimeData ? mimeData.type + '.' + mimeData.ext : 'file')

          return this.updateByFile(new File([blob], fileName))
        })
      }
    })
    // .then(fileInfos => {
    //   if (fileInfos.types.indexOf('link') > -1) {
    //     this.types = [...fileInfos.types]
    //     return this._setDistant(url, fileInfos.text)
    //       .then(() => this)
    //   } else {
    //     return this._updateFileByFileInfos(fileInfos)
    //   }
    // })
  }

  removeFile () {
    this.types = []
    this.image = null
    this.file = null
    this.colors = []
    this.colorsRound = []
    this.content = null
    this.input = null

    return new Promise(resolve => resolve(this))
  }

  updateByFile (file) {
    this.removeFile()

    const mimeData = getMimeData(file.type)
    const types = mimeData ? [mimeData.type, 'file'] : ['file']

    this.types = types

    // Image
    if (types.indexOf('image') > -1) {
      return this._setImage(file).then(() => this)

      // File
    } else {
      return this._setFile(file).then(() => this)
    }
  }

  _setFile (file) {
    this.file = {
      name: file.name,
      blob: file
    }

    return Promise.resolve(this)
  }

  _analyseHtml (link, doc) {
    const url = new URL(link)

    return (
      externalURL(url, doc)
        // Know URL
        .then(object => {
          Object.keys(object).forEach(label => {
            this[label] = object[label]
          })

          if (object.image && typeof object.image === typeof '') {
            return this._setImageByURL(object.image)
          }

          return object
        })

        // Unknow URL
        .catch(() => {
          if (!this.title) {
            this.title = doc.title
          }

          if (!this.description) {
            const metaDescription = doc.querySelector(
              'meta[name="description"]'
            )
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
    )
  }

  // _setDistant (url, html) {
  //   const parser = new DOMParser()
  //   const doc = parser.parseFromString(html, 'text/html')

  //   // this.types = ['link']

  //   return this._analyseHtml(url, doc)
  // }
}
