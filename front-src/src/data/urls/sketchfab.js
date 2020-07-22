import { TYPES } from "../../../app/constants/items"; // Mount with Docker from server

export default [
  {
    regexList: [/sketchfab\.com\/3d-models\/\w+/i],
    process: (url, { apiSave }) => {
      return new Promise(resolve => {
        const id = url.pathname
          .split("/")[2]
          .split("-")
          .pop();
        const dataURL = new URL("https://sketchfab.com/oembed");
        dataURL.searchParams.set("url", url.href);

        apiSave
          .getDistantLink(dataURL.href)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Link not found");
            }
          })
          .then(json => {
            resolve({
              title: json.title,
              description: json.description,
              types: [TYPES.EMBED, TYPES.THREE_D],
              tags: [TYPES.THREE_D, json.author_name],
              image: json.thumbnail_url,
              content: `<iframe width="${json.width}" height="${json.height}" src="https://sketchfab.com/models/${id}/embed?camera=0" frameborder="0" allow="autoplay; fullscreen; vr" allowfullscreen></iframe>`
            });
          })
          .catch(error => {
            console.error("sketchfab error: " + error.message);
            resolve({
              types: [TYPES.EMBED, TYPES.THREE_D],
              tags: [TYPES.THREE_D],
              content: `<iframe src="https://sketchfab.com/models/${id}/embed?camera=0" width="640" height="480" frameborder="0" allow="autoplay; fullscreen; vr" allowfullscreen></iframe>`
            });
          });
      });
    }
  }
];
