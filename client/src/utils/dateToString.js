export default (date_str, lang) => {
  if(date_str) {
    const date = new Date(date_str.replace(' ', 'T'))
    const day = padDate(date.getDate()),
          month = padDate(date.getMonth()+1),
          year = date.getFullYear()
    switch(lang) {
      case 'de':
      case 'fr':
      case 'es':
      case 'pt':
      case 'ru':
      case 'tr':
        return `${day}.${month}.${year}`
      case 'hi':
      case 'bn':
      case 'pa':
      case 'mr':
      case 'te':
        return `${day}-${month}-${year}`
      case 'ko':
      case 'ja':
      case 'zh':
        return `${year}-${month}-${day}`
      case 'en':
        return `${month}/${day}/${year}`
      default:
        return `${day}.${month}.${year}`
    }
    
  } else {
    return date_str
  }
}

const padDate = (i) => {
  return ("00" + i).slice(-2)
}
