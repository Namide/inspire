import { TYPES } from "../../../../web/app/constants/items";

export default [
  {
    regexList: [/dailymotion\.com\/video\/[a-z0-1]+/i],
    process: (url, { api }) => {
      return new Promise((resolve) => {
        const video = url.pathname.split("/")[2];
        const dataURL = new URL(
          "https://www.dailymotion.com/services/oembed?url=" +
            encodeURIComponent(url.href)
        );
        api
          .getDistantLink(dataURL.href)
          .then((response) => {
            if (response.ok) {
              // console.log(dataURL.href)
              // console.log(response)
              return response.json();
            } else {
              throw new Error("Link not found");
            }
          })
          .then((json) => {
            resolve({
              title: json.title,
              description: json.description,
              types: [TYPES.EMBED, TYPES.VIDEO],
              tags: [TYPES.VIDEO, json.author_name],
              image: json.thumbnail_url,
              content: `<iframe frameborder="0" width="${json.width}" height="${json.height}" src="https://www.dailymotion.com/embed/video/${video}" allowfullscreen allow="autoplay"></iframe>`,
            });
          })
          .catch((error) => {
            console.error("dailymotion error: " + error.message);
            resolve({
              types: [TYPES.EMBED, TYPES.VIDEO],
              tags: [TYPES.VIDEO],
              content: `<iframe frameborder="0" width="640" height="360" src="https://www.dailymotion.com/embed/video/${video}" allowfullscreen allow="autoplay"></iframe>`,
            });
          });
      });
    },
  },
];
