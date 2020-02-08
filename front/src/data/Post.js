// import api from '@/pure/api'

// const getToday = () => new Date(Date.now()).toJSON().split('.')[0]

export default class Post {
  constructor () {
    this.fromPayload({})
  }

  fromPayload (json = {}) {
    this.status = json.status || 'draft'
    this.title = json.title || ''
    this.description = json.description || ''
    this.types = json.types || []
    this.tags = json.tags || []
    this.colors = json.colors || []
    this.colorsRound = json.colors_round || []
    this.contentObject = json.content_data || { raw: '' }
    this.date = new Date(json.created_on || Date.now())

    this.file = json.content_file || null
    this.thumb = json.thumb || null
    this.author = null // this.api.getUser()
  }

  getPayload () {
    return {
      status: this.status,
      title: this.title,
      description: this.description,
      types: this.types,
      tags: this.tags,
      colors: this.colors,
      colors_round: this.colorsRound,
      content_data: this.contentObject,
      content_file: this.file,
      thumb: this.thumb,
      created_on: this.date.toISOString().replace(/:[0-9]{2}\.[0-9]{3}[A-Z]$/, ''),
      created_by: this.author
    }
  }
  // yyyy-MM-ddThh:mm
  getObject () {
    return {
      status: this.status,
      title: this.title,
      description: this.description,
      types: this.types,
      tags: this.tags,
      colors: this.colors,
      colorsRound: this.colorsRound,
      contentObject: this.contentObject,
      contentFile: this.file,
      thumb: this.thumb,
      date: this.date.toISOString().replace(/:[0-9]{2}\.[0-9]{3}[A-Z]$/, ''),
      author: this.author
    }
  }
}
