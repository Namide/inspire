import apiSave from '@/pure/apiSave'

const LIST = [
  {
    regexList: [/youtube\.com\/watch(.*)\?v=[a-z0-1]+/i],
    process: (url) => {
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
              contentObject: {
                type: 'embed',
                url: url.href,
                width: json.width,
                height: json.height,
                image: json.thumbnail_url,
                author: json.author_name,
                raw: `<iframe width="${json.width}" height="${json.height}" src="https://www.youtube-nocookie.com/embed/${video}?color=white&amp;controls=1&amp;iv_load_policy=3&amp;modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`
              }
            })
          })
          .catch(error => {
            console.error('youtube error: ' + error.message)
            resolve({
              types: ['embed', 'video'],
              contentObject: {
                type: 'embed',
                url: url.href,
                width: 640,
                height: 360,
                raw: `<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/${video}?color=white&amp;controls=1&amp;iv_load_policy=3&amp;modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`
              }
            })
          })
      })
    }
  },
  {
    regexList: [/vimeo\.com\/(\d+)/ig],
    process: (url) => {
      return new Promise(resolve => {
        const video = url.pathname.split('/')[1]
        const dataURL = new URL('https://vimeo.com/api/v2/video/' + video + '.json')
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
              description: json.description,
              types: ['embed', 'video'],
              contentObject: {
                type: 'embed',
                url: url.url,
                width: json.width,
                height: json.height,
                image: json.thumbnail_large,
                author: json.user_name,
                raw: `<iframe src="https://player.vimeo.com/video/${video}" width="${json.width}" height="${json.height}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
              }
            })
          })
          .catch(error => {
            console.error('vimeo error: ' + error.message)
            resolve({
              types: ['embed', 'video'],
              contentObject: {
                type: 'embed',
                url: url.href,
                width: 640,
                height: 360,
                raw: `<iframe src="https://player.vimeo.com/video/${video}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
              }
            })
          })
      })
    }
  },
  {
    regexList: [/dailymotion\.com\/video\/[a-z0-1]+/i],
    process: (url) => {
      return new Promise(resolve => {
        const video = url.pathname.split('/')[2]
        const dataURL = new URL('https://www.dailymotion.com/services/oembed?url=' + encodeURIComponent(url.href))
        apiSave.getDistantLink(dataURL.href)
          .then(response => {
            if (response.ok) {
              console.log(dataURL.href)
              console.log(response)
              return response.json()
            } else {
              throw new Error('Link not found')
            }
          })
          .then(json => {
            resolve({
              title: json.title,
              description: json.description,
              types: ['embed', 'video'],
              contentObject: {
                type: 'embed',
                url: url.url,
                width: json.width,
                height: json.height,
                image: json.thumbnail_url,
                author: json.author_name,
                raw: `<iframe frameborder="0" width="${json.width}" height="${json.height}" src="https://www.dailymotion.com/embed/video/${video}" allowfullscreen allow="autoplay"></iframe>`
              }
            })
          })
          .catch(error => {
            console.error('dailymotion error: ' + error.message)
            resolve({
              types: ['embed', 'video'],
              contentObject: {
                type: 'embed',
                url: url.href,
                width: 640,
                height: 360,
                raw: `<iframe frameborder="0" width="640" height="360" src="https://www.dailymotion.com/embed/video/${video}" allowfullscreen allow="autoplay"></iframe>
                `
              }
            })
          })
      })
    }
  },
  {
    regexList: [/sketchfab\.com\/3d-models\/\w+/i],
    process: (url) => {
      return new Promise(resolve => {
        const id = url.pathname.split('/')[2].split('-').pop()
        const dataURL = new URL('https://sketchfab.com/oembed')
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
              description: json.description,
              types: ['embed', '3d'],
              contentObject: {
                type: 'embed',
                url: url.url,
                width: json.width,
                height: json.height,
                image: json.thumbnail_url,
                author: json.author_name,
                raw: `<iframe width="${json.width}" height="${json.height}" src="https://sketchfab.com/models/${id}/embed?camera=0" frameborder="0" allow="autoplay; fullscreen; vr" allowfullscreen></iframe>`
              }
            })
          })
          .catch(error => {
            console.error('sketchfab error: ' + error.message)
            resolve({
              types: ['embed', '3d'],
              contentObject: {
                type: 'embed',
                width: 640,
                height: 480,
                url: url.href,
                raw: `<iframe src="https://sketchfab.com/models/${id}/embed?camera=0" width="640" height="480" frameborder="0" allow="autoplay; fullscreen; vr" allowfullscreen></iframe>`
              }
            })
          })
      })
    }
  }
]

/**
 * @param {URL}       url
 * @param {DOMParser} doc
 */
const process = (url, doc) => {
  console.log(url)
  const data = LIST.find(({ regexList }) => regexList.find(regex => regex.test(url.href)))

  return new Promise((resolve, reject) => {
    if (data) {
      resolve(data.process(url, doc))
    } else {
      reject(new Error('Not in the hosts list'))
    }
  })
}

export default process
