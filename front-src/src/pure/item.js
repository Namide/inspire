import { VISIBILITY } from "../../../web/app/constants/permissions";

const parseImagePayload = (payload) => {
  return {
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
    alt: payload.description || payload.title,
  };
};

const parseFilePayload = (payload) => {
  return {
    name: payload.name,
    width: payload.width,
    height: payload.height,
    src: payload.src,
    type: payload.type,
  };
};

const itemFromPayload = (payload) => {
  return {
    id: payload._id || null,
    visibility: payload.visibility || VISIBILITY.PRIVATE,
    title: payload.title || null,
    description: payload.description || null,
    types: payload.types || [],
    tags: payload.tags || [],
    content: payload.content || null,
    input: payload.input || null,
    createdAt: new Date(payload.createdAt || Date.now()),
    file: payload.file ? parseFilePayload(payload.file) : null,
    score: payload.score || 0,
    image: payload.image ? parseImagePayload(payload.image) : null,
    author: null,
  };
};

const itemToBody = (item) => {
  const data = {
    _id: item.id,
    visibility: item.visibility,
    title: item.title,
    description: item.description,
    types: [...item.types],
    tags: [...item.tags],
    input: item.input,
    content: item.content,
    score: item.score || 0,
    createdAt: item.createdAt
      .toISOString()
      .replace(/\.[0-9]{3}[A-Z]$/, "")
      .replace(/T/, " "),
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === null) {
      delete data[key];
    }
  });

  let image = null;
  let file = null;

  if (item.image && item.image.src instanceof File) {
    image = item.image.src;
  }

  if (item.file && item.file.src instanceof File) {
    file = item.file.src;
  }

  return { item: data, image, file };
};

const itemFromObject = (object) => {
  return {
    id: object.id,
    visibility: object.visibility,
    title: object.title,
    description: object.description,
    types: [...object.types],
    tags: [...object.tags],
    input: object.input,
    content: object.content,
    file: object.file,
    image: object.image,
    score: object.score,
    createdAt: object.createdAt ? new Date(object.createdAt) : null,
    author: object.author,
  };
};

const itemToObject = (item) => {
  const image = item.image ? Object.assign({}, item.image) : null;
  const file = item.file ? Object.assign({}, item.file) : null;

  return {
    id: item.id,
    visibility: item.visibility,
    title: item.title,
    description: item.description,
    types: [...item.types],
    tags: [...item.tags],
    input: item.input,
    content: item.content,
    file,
    image,
    score: item.score,
    createdAt: item.createdAt
      .toISOString()
      .replace(/:[0-9]{2}\.[0-9]{3}[A-Z]$/, ""),
    author: item.author,
  };
};

export default {
  itemFromPayload,
  itemToBody,
  itemFromObject,
  itemToObject,
};
