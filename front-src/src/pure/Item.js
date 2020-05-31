// import api from '@/pure/api'

import { VISIBILITY } from "../../../server/app/constants/permissions";

// const getToday = () => new Date(Date.now()).toJSON().split('.')[0]

const parseImagePayload = payload => {
  return {
    // id: payload.id,
    name: payload.name,
    width: payload.width,
    height: payload.height,
    src: payload.src,
    type: payload.type,
    colors: payload.colors,
    // srcSet: payload.data.thumbnails
    //   .filter(thumb => thumb.width > 300 || thumb.height > 300)
    //   .map(thumb => "/api" + thumb.relative_url + " " + thumb.width + "w")
    //   .join(", "),
    alt: payload.description || payload.title
  };
};

const parseFilePayload = payload => {
  return {
    // id: payload.id,
    name: payload.name,
    width: payload.width,
    height: payload.height,
    src: payload.src,
    type: payload.type
  };
};

export default class Item {
  constructor() {
    this.fromPayload();
    this._disposeList = [];
  }

  dispose() {
    this._disposeList.forEach(callback => callback());
    this._disposeList = [];
    this.fromPayload();
  }

  fromPayload(json = {}) {
    this.id = json._id || null;
    this.visibility = json.visibility || VISIBILITY.PRIVATE;
    this.title = json.title || "";
    this.description = json.description || "";
    this.types = json.types || [];
    this.tags = json.tags || [];
    // this.colors = json.colors || [];
    // this.colorsRound = json.colors_round || [];
    this.content = json.content || "";
    this.input = json.input || "";
    this.createdAt = new Date(json.createdAt || Date.now());
    this.file = json.file ? parseFilePayload(json.file) : null;
    this.score = json.score || 0;
    this.image = json.image ? parseImagePayload(json.image) : null;
    this.author = null; // this.api.getUser()

    return this;
  }

  getBody() {
    const item = {
      _id: this.id,
      visibility: this.visibility,
      title: this.title,
      description: this.description,
      types: [...this.types],
      tags: [...this.tags],
      // colors: [...this.colors],
      // colors_round: [...this.colorsRound],
      input: this.input,
      content: this.content,
      file: this.file ? JSON.parse(JSON.stringify(this.file)) : null,
      image: this.image ? JSON.parse(JSON.stringify(this.image)) : null,
      score: this.score || 0,
      createdAt: this.createdAt
        .toISOString()
        .replace(/\.[0-9]{3}[A-Z]$/, "")
        .replace(/T/, " ")
    };

    Object.keys(item).forEach(key => {
      if (item[key] === null) {
        delete item[key];
      }
    });

    let image = null;
    let file = null;

    if (this.image && this.image.src instanceof File) {
      image = this.image.src;
      delete item.image.src;
    }

    if (this.file && this.file.src instanceof File) {
      file = this.file.src;
      delete item.file.src;
    }

    return { item, image, file };
  }

  fromObject(object = {}) {
    this.id = object.id;
    this.visibility = object.visibility;
    this.title = object.title;
    this.description = object.description;
    this.types = [...object.types];
    this.tags = [...object.tags];
    // this.colors = [...object.colors];
    // this.colorsRound = [...object.colorsRound];
    this.input = object.input;
    this.content = object.content;
    this.file = object.file;
    this.image = object.image;
    this.score = object.score;
    this.createdAt = object.createdAt ? new Date(object.createdAt) : null;
    this.author = object.author;

    return this;
  }

  getObject() {
    const image = Object.assign({}, this.image);
    const file = Object.assign({}, this.file);

    if (image && image.src instanceof File) {
      const src = URL.createObjectURL(image.src);
      this._disposeList.push(() => URL.revokeObjectURL(src));
      image.src = src;
    }

    if (file && file.src instanceof File) {
      const src = URL.createObjectURL(file.src);
      this._disposeList.push(() => URL.revokeObjectURL(src));
      file.src = src;
    }

    return {
      id: this.id,
      visibility: this.visibility,
      title: this.title,
      description: this.description,
      types: [...this.types],
      tags: [...this.tags],
      // colors: [...this.colors],
      // colorsRound: [...this.colorsRound],
      input: this.input,
      content: this.content,
      file,
      image,
      score: this.score,
      createdAt: this.createdAt
        .toISOString()
        .replace(/:[0-9]{2}\.[0-9]{3}[A-Z]$/, ""),
      author: this.author
    };
  }
}
