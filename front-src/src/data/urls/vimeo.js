export default [
  {
    regexList: [/vimeo\.com\/(\d+)/gi],
    process: (url, { apiSave }) => {
      return new Promise(resolve => {
        const video = url.pathname.split("/")[1];
        const dataURL = new URL(
          "https://vimeo.com/api/v2/video/" + video + ".json"
        );
        apiSave
          .getDistantLink(dataURL.href)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Link not found");
            }
          })
          .then(([json]) => {
            resolve({
              title: json.title,
              description: json.description.split("<br />").join(" "),
              tags: ["video", json.user_name],
              types: ["embed", "video"],
              image: json.thumbnail_large,
              content: `<iframe src="https://player.vimeo.com/video/${video}" width="${json.width}" height="${json.height}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
            });
          })
          .catch(error => {
            console.error("vimeo error: " + error.message);
            resolve({
              types: ["embed", "video"],
              tags: ["video"],
              content: `<iframe src="https://player.vimeo.com/video/${video}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
            });
          });
      });
    }
  }
];
