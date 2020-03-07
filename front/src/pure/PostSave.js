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
}

export default class PostSave extends Post {
  /**
   * @param {String} raw
   * @returns {Promise}
   */
  setByRaw (raw) {
    // const content = new analyseRaw()
    // content.fromRaw(raw)
    // this.contentObject = content.getJson()
    const type = extractType(raw)
    if (type === 'url') {
      this.input = raw.trim()
      return this._updateByLink(this.input)
    } else if (type === 'embed') {
      this.types = [type]
      this.input = raw.trim()
      this.content = this.input
    } else {
      this.types = [type]
      this.input = raw
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
        this.colorsRound = [...new Set(colors.map(({ red, green, blue }) => {
          return Math.round(red * (accuracy - 1) / 255) * accuracy * accuracy +
            Math.round(green * (accuracy - 1) / 255) * accuracy +
            Math.round(blue * (accuracy - 1) / 255)
        }))]
      })
      .then(() => this)
  }

  _setImageByURL (url) {
    return fetchUrl(url)
      .then(fileInfos => {
        return this._setImage(fileInfos)
      })
  }

  _setImage (fileInfos) {
    const src = URL.createObjectURL(fileInfos.blob)
    this.image = {
      src,
      blob: new File([fileInfos.blob], fileInfos.name)
    }

    const title = fileInfos.name
      .split('-').join(' ')
      .split('_').join(' ')
      .split('  ').join(' ')

    this.title = title.substring(0, title.lastIndexOf('.'))

    this._disposeList.push(() => URL.revokeObjectURL(src))
    return this._extractColors(src)
  }

  _updateFileByFileInfos (fileInfos) {
    this.types = [...fileInfos.types]
    this.image = null
    this.file = null
    if (fileInfos.types.indexOf('image') > -1) {
      return this._setImage(fileInfos)
        .then(() => this)
    } else {
      return this._setFile(fileInfos)
        .then(() => this)
    }
  }

  _updateByLink (url) {
    return fetchUrl(url)
      .then(fileInfos => {
        if (fileInfos.types.indexOf('link') > -1) {
          this.types = [...fileInfos.types]
          return this._setDistant(url, fileInfos.text)
            .then(() => this)
        } else {
          return this._updateFileByFileInfos(fileInfos)
        }
      })
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
    const fileInfos = {
      type: 'file',
      name: file.name,
      ext: mimeData ? mimeData.ext : file.name.split('.').pop(),
      types: mimeData ? [mimeData.type, 'file'] : ['file'],
      size: file.size,
      blob: file
    }

    return this._updateFileByFileInfos(fileInfos)
  }

  _setFile ({ name, ext, types, size, blob }) {
    this.types = types
    this.file = {
      type: 'file',
      name,
      blob
    }

    return new Promise(resolve => resolve(this))
  }

  _analyseHtml (link, doc) {
    const url = new URL(link)
    return externalURL(url, doc)
      .then(data => {
        Object.keys(data).forEach(label => {
          this[label] = data[label]
        })
        console.log(data)
        if (typeof data.image === typeof '') {
          return this._setImageByURL(data.image)
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

  _setDistant (url, html) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    this.types = ['link']

    return this._analyseHtml(url, doc)
  }
}
