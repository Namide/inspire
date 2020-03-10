export const itemsToFilter = list => {
  const tags = []
  const types = []
  const noTags = []
  const noTypes = []
  list.forEach(item => {
    const s = item[0] + item[1]
    const f = item[0]

    if (s === '!@' || s === '@!') {
      noTypes.push(item.substr(2))
    } else if (f === '@') {
      types.push(item.substr(1))
    } else if (f === '!') {
      noTags.push(item.substr(1))
    } else {
      tags.push(item)
    }
  })

  return { tags, types, noTags, noTypes }
}

export const extractTags = list => {
  return list.filter(item => item[0] !== '@' && item[0] !== '!')
}

export const extractNoTags = list => {
  return list.filter(item => item[0] === '!' && item[1] !== '@')
}

export const extractTypes = list => {
  return list.filter(item => item[0] === '@' && item[1] !== '!')
}

export const extractNoTypes = list => {
  return list.filter(
    item => item.substring(0, 2) === '!@' || item.substring(0, 2) === '@!'
  )
}
