import Item from "@/pure/Item";
import apiSave from "@/pure/apiSave";
import { extractColorsFromImage } from "extract-colors";
import externalURL from "@/pure/externalURL.js";
import { extractType, getMimeData } from "@/pure/contentHelpers.js";
import marked from "marked";
// https://css-tricks.com/choosing-right-markdown-parser/#article-header-id-0
import { TYPES } from "../../../server/app/constants/items";

/**
 * @param {String} url
 * @returns {Promise<Object>}
 */
const fetchUrl = url => {
  return apiSave.getDistantLink(url).then(response => {
    if (response.ok) {
      return response;
    } else {
      throw new Error("Link not found");
    }
  });
};

const responseToFile = (response, url = response.url) => {
  return response.blob().then(blob => {
    const mimeData = getMimeData(blob.type);
    const fileName =
      url.substring(url.lastIndexOf("/") + 1).split(/#|\?/)[0] ||
      (mimeData ? mimeData.type + "." + mimeData.ext : mimeData.type);

    return new File([blob], fileName, {
      type: blob.type,
      lastModified: blob.lastModified
    });
  });
};

export default class ItemSave extends Item {
  /**
   * @param {String} input
   */
  setInput(input) {
    const type = extractType(input);
    if (type === TYPES.URL || type === TYPES.EMBED) {
      this.input = input.trim();
    } else {
      this.input = input;
    }

    return this;
  }

  /**
   * @param {String} input
   * @returns {Promise}
   */
  updateByInput(input) {
    this.setInput(input);

    const type = extractType(this.input);
    this.types = [type];
    if (type === TYPES.URL) {
      this.content = "";
      return this._updateByLink(this.input);
    } else if (type === TYPES.EMBED) {
      this.content = this.input;
    } else {
      this.content = marked(this.input);
    }

    return Promise.resolve(this);
  }

  _extractData(src) {
    const image = new Image();
    image.src = src;

    return extractColorsFromImage(image)
      .then(colors => {
        const accuracy = 4; // 4 * 4 * 4 => 64 colors

        this.image.colors = colors.map(color => ({
          area: Math.round(color.area * 100) / 100,
          hexa: color.hex
        }));

        // optimise test : http://glslsandbox.com/e#61168.1
        this.image.colorsRound = [
          ...new Set(
            colors.map(({ red, green, blue }) => {
              return (
                Math.round((red * (accuracy - 1)) / 255) * accuracy * accuracy +
                Math.round((green * (accuracy - 1)) / 255) * accuracy +
                Math.round((blue * (accuracy - 1)) / 255)
              );
            })
          )
        ];
      })
      .then(() => {
        this.image.width = image.width;
        this.image.height = image.height;
        this.image.type = image.mimeType;
      })
      .then(() => this);
  }

  _setImageByURL(url) {
    return fetchUrl(url)
      .then(response => responseToFile(response, url))
      .then(file => this._setImage(file));
  }

  _setImage(file) {
    if (!this.title) {
      const title = file.name
        .split("-")
        .join(" ")
        .split("_")
        .join(" ")
        .split("  ")
        .join(" ")
        .substring(0, file.name.lastIndexOf("."));

      this.title = title;
    }
    this.image = { src: file };

    const src = URL.createObjectURL(file);
    return this._extractData(src).then(() => URL.revokeObjectURL(src));
  }

  _setVideo(file) {
    if (!this.title) {
      const title = file.name
        .split("-")
        .join(" ")
        .split("_")
        .join(" ")
        .split("  ")
        .join(" ")
        .substring(0, file.name.lastIndexOf("."));

      this.title = title;
    }
    this.file = { src: file };

    return Promise.resolve(file);
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

  _updateByLink(url) {
    return fetchUrl(url).then(response => {
      const contentType = response.headers.get("content-type");

      // HTML
      if (contentType.indexOf("text/html") > -1) {
        return response.text().then(text => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          return this._analyseHtml(url, doc);
        });

        // FILE
      } else {
        return response.blob().then(blob => {
          const mimeData = getMimeData(blob.type);
          const fileName =
            url.substring(url.lastIndexOf("/") + 1).split(/#|\?/)[0] ||
            (mimeData ? mimeData.type + "." + mimeData.ext : TYPES.FILE);

          return this.updateByFile(
            new File([blob], fileName, {
              type: blob.type,
              lastModified: blob.lastModified
            })
          );
        });
      }
    });
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

  removeFile() {
    // this.types = []
    this.image = null;
    this.file = null;
    // this.colors = [];
    // this.colorsRound = [];
    // this.content = null
    // this.input = null

    return Promise.resolve(this);
  }

  updateByFile(file) {
    this.removeFile();

    const mimeData = getMimeData(file.type);
    const types = mimeData ? [mimeData.type, TYPES.FILE] : [TYPES.FILE];
    this.types = types;

    const getData = () => ({
      type: file.type,
      size: file.size,
      name: file.name
    });

    // Image
    if (types.indexOf(TYPES.IMAGE) > -1) {
      return this._setImage(file)
        .then(() => {
          this.image = Object.assign({}, this.image, getData());
        })
        .then(() => this);

      // Video
    } else if (types.indexOf(TYPES.VIDEO) > -1) {
      return this._setVideo(file)
        .then(() => {
          this.file = Object.assign({}, this.file, getData());
        })
        .then(() => this);

      // File
    } else {
      return this._setFile(file)
        .then(() => {
          this.file = Object.assign({}, this.file, getData());
        })
        .then(() => this);
    }
  }

  _setFile(file) {
    this.file = { src: file };

    return Promise.resolve(this);
  }

  _analyseHtml(link, doc) {
    const url = new URL(link);

    return (
      externalURL(url, doc)
        // Know URL
        .then(object => {
          Object.keys(object).forEach(label => {
            this[label] = object[label];
          });

          if (object.image && typeof object.image === typeof "") {
            return this._setImageByURL(object.image);
          }

          return object;
        })

        // Unknow URL
        .catch(() => {
          if (!this.title) {
            this.title = doc.title;
          }

          if (!this.description) {
            const metaDescription = doc.querySelector(
              'meta[name="description"]'
            );
            if (metaDescription) {
              this.description = metaDescription.getAttribute("content");
            }
          }

          if (!this.image) {
            const image = doc.querySelector('meta[property="og:image"]');
            const images = doc.querySelectorAll("a[href]");
            if (image) {
              this.image = image.getAttribute("content");
            } else if (images.length > 0) {
              this.image = images[0].getAttribute("src");
            }
          }
        })
    );
  }

  // _setDistant (url, html) {
  //   const parser = new DOMParser()
  //   const doc = parser.parseFromString(html, 'text/html')

  //   // this.types = ['link']

  //   return this._analyseHtml(url, doc)
  // }
}
