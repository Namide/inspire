export default class Post {
  constructor () {
    this.fromJson({})
  }

  fromJson (json = {}) {
    this.status = json.status || 'draft'
    this.title = json.title || ''
    this.description = json.description || ''
    this.types = json.types || []
    this.tags = json.tags || []
    this.colors = json.colors || []
    this.colorsRound = json.colors_round || []
    this.content = json.content_data || {}
    this.date = new Date(json.created_on || Date.now())

    this.file = json.content_file || null
    this.thumb = json.thumb || null
  }

  getJson () {
    return {
      status: this.status,
      title: this.title,
      description: this.description,
      types: this.types,
      tags: this.tags,
      colors: this.colors,
      colors_round: this.colorsRound,
      content_data: this.content,
      content_file: this.file,
      thumb: this.thumb,
      created_on: this.date.toJSON()
      // created_by
    }
  }
}
