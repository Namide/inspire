import mimeTypes from '@/data/mime-types.json'

export const extractType = raw => {
  // https://mathiasbynens.be/demo/url-regex
  if (raw && raw.trim().match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/is) !== null) {
    // const urlData = extractUrlData(raw)

    return {
      type: 'url',
      raw: raw.trim()
      // ...urlData
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

    // const urlData = extractUrlData(src)

    return {
      // ...urlData,
      type: 'embed',
      raw: raw.trim(),
      src,
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

export const getMimeData = mimeType => {
  const mimeData = { ext: '', mimeType: '', type: '' }
  Object.keys(mimeTypes)
    .forEach(type => {
      mimeTypes[type]
        .forEach(data => {
          if (mimeType === data.mimeType) {
            mimeData.ext = data.ext
            mimeData.mimeType = data.mimeType
            mimeData.type = type
          }
        })
    })

  return mimeData
}
