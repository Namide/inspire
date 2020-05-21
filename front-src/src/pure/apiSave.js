import { Api } from "./api";

class ApiSave extends Api {
  /**
   * @param {String} link
   * @returns {Promise}
   */
  getDistantLink(link) {
    // const form = Api.dataToFormData({ link })
    // const url = config.api.abs + '/distant'
    // const request = new Request(url)
    // const params = {
    //   method: 'POST',
    //   headers: this.getHeaders(),
    //   mode: 'cors',
    //   cache: 'default',
    //   body: form
    // }

    const options = {
      method: "get",
      headers: this._createHeaders()
    };

    const url = encodeURIComponent(link);

    return fetch("/api/distant/" + url, options);

    // const url = new URL(
    //   this.apiURL + "/inspire/custom/gateway",
    //   window.location.origin
    // );
    // url.searchParams.append("link", link);
    // /api/distant/
    // return fetch(url.href /*, { mode: 'cors' } */); // request('get', '/custom/gateway')
  }

  /**
   * @param {File} file
   * @param {Function} onProgress
   */
  // addFile(file, onProgress = () => 1) {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   // console.log(formData)
  //   return this.directus.uploadFiles(formData, onProgress);
  // }

  // addFiles(file, image, onProgress = ({ loaded, total }) => loaded / total) {
  //   let l1 = 0;
  //   let t1 = file.size;
  //   let l2 = 0;
  //   let t2 = image.size;

  //   const dispatchProgress = () =>
  //     onProgress({ loaded: l1 + l2, total: t1 + t2 });

  //   return Promise.all([
  //     this.addFile(file, ({ loaded, total }) => {
  //       l1 = loaded;
  //       t1 = total;
  //       dispatchProgress();
  //     }),
  //     this.addFile(image, ({ loaded, total }) => {
  //       l2 = loaded;
  //       t2 = total;
  //       dispatchProgress();
  //     })
  //   ]);
  // }

  addItem(payload, image = null, file = null) {
    const body = new FormData();
    body.append("data", JSON.stringify(payload));

    if (image) {
      body.append("image", image);
    }

    if (file) {
      body.append("file", file);
    }

    const options = {
      method: "post",
      headers: this._createHeaders(),
      body
    };

    return fetch("/api/items", options)
      .then(response => response.json())
      .then(payload => this.parsePayload(payload))
      .then(({ item }) => Api.parseItem(item));

    // delete payload.id;
    // if (payload.file && payload.image) {
    //   return this.addFiles(payload.file, payload.image, onProgress).then(
    //     ([file, image]) => {
    //       return this.directus.createItem(
    //         "items",
    //         Object.assign({}, payload, {
    //           file: file.data.data.id,
    //           image: image.data.data.id
    //         })
    //       );
    //     }
    //   );
    // } else if (payload.file) {
    //   return this.addFile(payload.file, onProgress).then(file => {
    //     return this.directus.createItem(
    //       "items",
    //       Object.assign({}, payload, { file: file.data.data.id })
    //     );
    //   });
    // } else if (payload.image) {
    //   return this.addFile(payload.image, onProgress).then(image => {
    //     return this.directus.createItem(
    //       "items",
    //       Object.assign({}, payload, { image: image.data.data.id })
    //     );
    //   });
    // } else {
    //   return this.directus.createItem("items", payload);
    // }
  }

  // deleteFile(id) {
  //   return this.directus.api.delete("files/" + id);
  // }

  deleteItem(payload) {
    const list = [this.directus.deleteItem("items", payload.id)];
    if (payload.file) {
      list.push(this.deleteFile(payload.file.id));
    }

    if (payload.image) {
      list.push(this.deleteFile(payload.image.id));
    }

    return Promise.all(list);
  }

  updateItem(payload, oldPayload, onProgress) {
    const addImage = payload.image instanceof File;
    const addFile = payload.file instanceof File;
    const removeImage = oldPayload.image && (!payload.image || addImage);
    const removeFile = oldPayload.file && (!payload.file || addFile);

    const list = [];

    if (addImage && addFile) {
      list.push(this.addFiles(payload.file, payload.image, onProgress));
    } else if (addImage) {
      list.push(this.addFile(payload.image, onProgress));
    } else if (addFile) {
      list.push(this.addFile(payload.file, onProgress));
    }

    if (removeImage) {
      list.push(this.deleteFile(oldPayload.image.id));
    }

    if (removeFile) {
      list.push(this.deleteFile(oldPayload.file.id));
    }

    return Promise.all(list).then(data => {
      let file = removeFile
        ? null
        : (oldPayload.file && oldPayload.file.id) || null;
      let image = removeImage
        ? null
        : (oldPayload.image && oldPayload.image.id) || null;

      if (addImage && addFile) {
        const [[newFile, newImage]] = data;
        file = newFile.data.data.id;
        image = newImage.data.data.id;
      } else if (addImage) {
        const [newImage] = data;
        image = newImage.data.data.id;
      } else if (addFile) {
        const [newFile] = data;
        file = newFile.data.data.id;
      }

      return this.directus.updateItem(
        "items",
        oldPayload.id,
        Object.assign({}, payload, { file, image })
      );
    });
  }
}

const apiSave = new ApiSave();

export { ApiSave };
export default apiSave;
