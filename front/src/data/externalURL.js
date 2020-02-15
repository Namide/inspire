const LIST = [
  {
    hosts: ['www.youtube.com', 'youtube.com'],
    process: (url) => {
      const video = url.searchParams.get('v')
      return {
        types: ['embed', 'video'],
        contentObject: {
          embed: `<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/${video}?color=white&amp;controls=1&amp;iv_load_policy=3&amp;modestbranding=1&amp;rel=0&amp;showinfo=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`
        }
      }
    }
  },
  {
    hosts: ['vimeo.com'],
    process: (url) => {
      const video = url.pathname.split('/')[1]
      return {
        types: ['embed', 'video'],
        contentObject: {
          embed: `<iframe src="https://player.vimeo.com/video/${video}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
        }
      }
    }
  },
  {
    hosts: ['www.dailymotion.com', 'dailymotion.com'],
    process: (url) => {
      const video = url.pathname.split('/')[2]
      return {
        types: ['embed', 'video'],
        contentObject: {
          embed: `<iframe frameborder="0" width="640" height="360" src="https://www.dailymotion.com/embed/video/${video}" allowfullscreen allow="autoplay"></iframe>
          `
        }
      }
    }
  }
]

/**
 * @param {URL}       url
 * @param {DOMParser} doc
 */
const process = (url, doc) => {
  const data = LIST.find(({ hosts }) => hosts.find(host => host === url.host))
  return data.process(url, doc)
}

export default process
