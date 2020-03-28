const TYPES = {
  '#': 'tag', // #video game
  '@': 'author', // @Damien
  '$': 'type', // $video
  '%': 'data' // %score<3
  // word
}

export const parseItem = item => {
  const no = item[0] === '!'
  const firstChar = no ? item[1] : item[0]
  const type = Object.keys(TYPES).indexOf(firstChar) > -1 ? TYPES[firstChar] : 'word'
  const startChar = (type !== 'word' ? 1 : 0) + (no ? 1 : 0)
  const word = item.substr(startChar)

  return {
    word,
    type,
    no
  }
}

export const itemsToFilter = list => {
  const data = {
    tags: [],
    noTags: [],
    types: [],
    noTypes: [],
    authors: [],
    noAuthors: [],
    words: [],
    noWords: [],
    data: [],
    noData: []
  }

  list.forEach(item => {
    const { word, no, type } = parseItem(item)
    const label = no ? ('no' + type[0].toUpperCase() + type.slice(1) + 's') : (type + 's')
    data[label].push(word)
  })

  return data
}
