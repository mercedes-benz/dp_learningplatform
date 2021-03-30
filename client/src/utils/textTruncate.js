export default (str, splitByWords=true, limit, after) => {
  if (str) {
    let content
    if (splitByWords) {
      content = str.split(' ').slice(0, limit)
      content = content.join(' ') + (after ? after : '')
    } else {
      content = str.slice(0, limit)
      content = content + (after ? after : '')
    }
    return content
  }
}