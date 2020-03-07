export default [{
  regexList: [/youtube\.com\/watch(.*)\?v=[a-z0-1]+/i],
  process: (url, { apiSave }) => {
    return new Promise(resolve => {
      const video = url.searchParams.get('v')
      const dataURL = new URL('https://www.youtube.com/oembed')
      dataURL.searchParams.set('url', url.href)
      apiSave.getDistantLink(dataURL.href)
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Link not found')
          }
        })
        .then(json => {
          resolve({
            title: json.title,
            types: ['embed', 'video'],
            tags: ['video', json.author_name],
            image: json.thumbnail_url,
            content: `<iframe width="${json.width}" height="${json.height}" src="https://www.youtube-nocookie.com/embed/${video}?color=white&amp;controls=1&amp;iv_load_policy=3&amp;modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`
          })
        })
        .catch(error => {
          console.error('youtube error: ' + error.message)
          resolve({
            types: ['embed', 'video'],
            tags: ['video'],
            content: `<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/${video}?color=white&amp;controls=1&amp;iv_load_policy=3&amp;modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`
          })
        })
    })
  }
}]
