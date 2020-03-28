// import api from '@/pure/api'

// const getToday = () => new Date(Date.now()).toJSON().split('.')[0]

const parseImagePayload = payload => {
  return {
    id: payload.id,
    name: payload.filename_download,
    width: payload.width,
    height: payload.height,
    src: '/api' + payload.data.url,
    srcSet: payload.data.thumbnails
      .filter(thumb => thumb.width > 300 || thumb.height > 300)
      .map(thumb => '/api' + thumb.relative_url + ' ' + thumb.width + 'w')
      .join(', '),
    alt: payload.description || payload.title
  }
}

export default class Item {
  constructor () {
    this.fromPayload()
    this._disposeList = []
  }

  dispose () {
    this._disposeList.forEach(callback => callback())
    this._disposeList = []
    this.fromPayload()
  }

  fromPayload (json = {}) {
    this.id = json.id || ''
    this.status = json.status || 'draft'
    this.title = json.title || ''
    this.description = json.description || ''
    this.types = json.types || []
    this.tags = json.tags || []
    this.colors = json.colors || []
    this.colorsRound = json.colors_round || []
    this.content = json.content || ''
    this.input = json.input || ''
    this.date = new Date(json.date || Date.now())
    this.file = json.file || null
    this.score = json.score || 0
    this.image = json.image ? parseImagePayload(json.image) : null
    this.author = null // this.api.getUser()
  }

  getPayload () {
    const payload = {
      id: this.id,
      status: this.status,
      title: this.title,
      description: this.description,
      types: [...this.types],
      tags: [...this.tags],
      colors: [...this.colors],
      colors_round: [...this.colorsRound],
      input: this.input,
      content: this.content,
      file: this.file,
      image: this.image,
      score: this.score || 0,
      date: this.date
        .toISOString()
        .replace(/\.[0-9]{3}[A-Z]$/, '')
        .replace(/T/, ' '),
      created_by: this.author
    }

    Object.keys(payload).forEach(key => {
      if (
        payload[key] === null ||
        (Array.isArray(payload[key]) && payload[key].length < 1)
      ) {
        delete payload[key]
      }
    })

    return payload
  }

  fromObject (object = {}) {
    this.id = object.id
    this.status = object.status
    this.title = object.title
    this.description = object.description
    this.types = [...object.types]
    this.tags = [...object.tags]
    this.colors = [...object.colors]
    this.colorsRound = [...object.colorsRound]
    this.input = object.input
    this.content = object.content
    this.file = object.file
    this.image = object.image
    this.score = object.score
    this.date = object.date ? new Date(object.date) : null
    this.author = object.author
  }

  getObject () {
    return {
      id: this.id,
      status: this.status,
      title: this.title,
      description: this.description,
      types: [...this.types],
      tags: [...this.tags],
      colors: [...this.colors],
      colorsRound: [...this.colorsRound],
      input: this.input,
      content: this.content,
      file: this.file,
      image: this.image,
      score: this.score,
      date: this.date.toISOString().replace(/:[0-9]{2}\.[0-9]{3}[A-Z]$/, ''),
      author: this.author
    }
  }
}
