import api from "@/pure/api";
// import { extractColorsFromImage } from "extract-colors";
import externalURL from "@/pure/externalURL.js";
import { extractType, getMimeData } from "@/pure/contentHelpers.js";
import marked from "marked";
// https://css-tricks.com/choosing-right-markdown-parser/#article-header-id-0
import { TYPES } from "../../../web/app/constants/items";

/**
 * @param {String} url
 * @returns {Promise<Object>}
 */
const fetchUrl = (url) => {
  return api.getDistantLink(url).then((response) => {
    if (response.ok) {
      return response;
    } else {
      throw new Error("Link not found");
    }
  });
};

const responseToFile = (response, url = response.url) => {
  return response.blob().then((blob) => {
    const mimeData = getMimeData(blob.type);
    const fileName =
      url.substring(url.lastIndexOf("/") + 1).split(/#|\?/)[0] ||
      (mimeData ? mimeData.type + "." + mimeData.ext : mimeData.type);

    return new File([blob], fileName, {
      type: blob.type,
      lastModified: blob.lastModified,
    });
  });
};

const setItemImageByURL = (item, url) => {
  return fetchUrl(url)
    .then((response) => responseToFile(response, url))
    .then((file) => setItemImage(item, file));
};

const updateItemByLink = (item, url) => {
  return fetchUrl(url).then((response) => {
    const contentType = response.headers.get("content-type");

    // HTML
    if (contentType.indexOf("text/html") > -1) {
      return response.text().then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        return analyseItemHtml(item, url, doc);
      });

      // FILE
    } else {
      return response.blob().then((blob) => {
        const mimeData = getMimeData(blob.type);
        const fileName =
          url.substring(url.lastIndexOf("/") + 1).split(/#|\?/)[0] ||
          (mimeData ? mimeData.type + "." + mimeData.ext : TYPES.FILE);

        return updateItemByFile(
          item,
          new File([blob], fileName, {
            type: blob.type,
            lastModified: blob.lastModified,
          })
        );
      });
    }
  });
};

const setItemInput = (item, input) => {
  const type = extractType(input);
  if (type === TYPES.URL || type === TYPES.EMBED) {
    item.input = input.trim();
  } else {
    item.input = input;
  }

  return item;
};

const updateItemByInput = (item, input) => {
  setItemInput(item, input);

  const type = extractType(item.input);
  item.types = [type];
  if (type === TYPES.URL) {
    item.content = "";
    return updateItemByLink(item, item.input);
  } else if (type === TYPES.EMBED) {
    item.content = item.input;
  } else {
    item.content = marked(item.input);
  }

  return Promise.resolve(item);
};

const setItemImage = (item, file) => {
  if (!item.title) {
    const title = file.name
      .split("-")
      .join(" ")
      .split("_")
      .join(" ")
      .split("  ")
      .join(" ")
      .substring(0, file.name.lastIndexOf("."));

    item.title = title;
  }

  item.image = { src: file };

  return Promise.resolve(item.image);
};

const setVideo = (item, file) => {
  if (!item.title) {
    const title = file.name
      .split("-")
      .join(" ")
      .split("_")
      .join(" ")
      .split("  ")
      .join(" ")
      .substring(0, file.name.lastIndexOf("."));

    item.title = title;
  }
  item.file = { src: file };

  return Promise.resolve(file);
};

const removeItemFile = (item) => {
  item.image = null;
  item.file = null;

  return Promise.resolve(item);
};

const updateItemByFile = (item, file) => {
  removeItemFile(item);

  const mimeData = getMimeData(file.type);
  const types = mimeData ? [mimeData.type, TYPES.FILE] : [TYPES.FILE];
  item.types = types;

  const data = {
    type: file.type,
    size: file.size,
    name: file.name,
  };

  // Image
  if (types.indexOf(TYPES.IMAGE) > -1) {
    return setItemImage(item, file)
      .then(() => {
        item.image = Object.assign({}, item.image, data);
      })
      .then(() => item);

    // Video
  } else if (types.indexOf(TYPES.VIDEO) > -1) {
    return setVideo(item, file)
      .then(() => {
        item.file = Object.assign({}, item.file, data);
      })
      .then(() => item);

    // File
  } else {
    return setItemFile(item, file)
      .then(() => {
        item.file = Object.assign({}, item.file, data);
      })
      .then(() => item);
  }
};

const setItemFile = (item, file) => {
  item.file = { src: file };
  return Promise.resolve(item);
};

const analyseItemHtml = (item, link, doc) => {
  const url = new URL(link);

  return (
    externalURL(url, doc)
      // Know URL
      .then((object) => {
        Object.keys(object).forEach((label) => {
          item[label] = object[label];
        });

        if (object.image && typeof object.image === typeof "") {
          return setItemImageByURL(item, object.image);
        }

        return object;
      })

      // Unknow URL
      .catch(() => {
        if (!item.title) {
          item.title = doc.title;
        }

        if (!item.description) {
          const metaDescription = doc.querySelector('meta[name="description"]');
          if (metaDescription) {
            item.description = metaDescription.getAttribute("content");
          }
        }

        if (!item.image) {
          const image = doc.querySelector('meta[property="og:image"]');
          const images = doc.querySelectorAll("a[href]");
          if (image) {
            item.image = image.getAttribute("content");
          } else if (images.length > 0) {
            item.image = images[0].getAttribute("src");
          }
        }
      })
  );
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

export default {
  setItemInput,
  itemToBody,
  updateItemByInput,
  removeItemFile,
  updateItemByFile,
};
