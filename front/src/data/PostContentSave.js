const extractUrlData = url => {
  if (url === null || url === undefined) {
    return null
  }

  const a = document.createElement('a')
  a.href = url.trim()

  return {
    type: 'url',
    url: a.href,
    authority: a.host,
    path: a.pathname,
    search: a.search,
    anchor: a.hash,
    raw: a.href
  }
}

const extractJson = raw => {
  // https://mathiasbynens.be/demo/url-regex
  if (raw && raw.trim().match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/is) !== null) {
    const urlData = extractUrlData(raw)

    return {
      type: 'url',
      raw: raw.trim(),
      ...urlData
    }
  } else if (raw && raw.trim().match(/<iframe(.+)<\/iframe>/g) !== null) {
    const regExS = /<iframe[^>]+src=["']?(.+?)["'\s>]/gi
    const regExW = /<iframe[^>]+width=["']?(\d+%?)/gi
    const regExH = /<iframe[^>]+height=["']?(\d+%?)/gi

    const exS = regExS.exec(raw)
    const exW = regExW.exec(raw)
    const exH = regExH.exec(raw)

    const src = exS && exS.length > 1 ? exS[1] : null
    const width = exW && exW.length > 1 ? exW[1] || 640 : 640
    const height = exH && exH.length > 1 ? exH[1] || 360 : 360

    const urlData = extractUrlData(src)

    return {
      ...urlData,
      type: 'embed',
      raw: raw.trim(),
      width,
      height
    }
  } else {
    return {
      type: 'text',
      raw: raw
    }
  }
}

class PostContentSave {
  constructor (json = {}) {
    this.json = json
  }

  /**
   * @returns {Boolean}
   */
  isURL () {
    return this.getType() === 'url'
  }

  /**
   * @returns {Boolean}
   */
  isEmbed () {
    return this.getType() === 'embed'
  }

  /**
   * @returns {Boolean}
   */
  isText () {
    return this.getType() === 'text'
  }

  /**
   * @param {String} raw
   */
  fromRaw (raw) {
    this.json = extractJson(raw)
  }

  /**
   * @param {Object} json
   */
  fromJson (json) {
    this.json = json
  }

  /**
   * @returns {Object}
   */
  getJson () {
    return this.json
  }

  /**
   * @returns {String}
   */
  getRaw () {
    return this.json.raw
  }

  /**
   * @returns {String}
   */
  getType () {
    return this.json.type
  }
}

export default PostContentSave

export const contentRawToJson = raw => new PostContentSave().fromRaw(raw).getJson()
