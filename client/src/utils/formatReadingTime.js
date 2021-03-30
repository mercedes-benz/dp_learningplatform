export default (minutes) => {
  const m = parseInt(minutes, 10)

  if(m >= 60) {
    return `${padNumber(Math.floor(m/60))}:${padNumber(m%60)} h`
  } else {
    return `${m} Min.`
  }
}

const padNumber = (n, pad_character = "0", characters = 2) => {
  return `${pad_character.repeat(characters)}${n}`.slice(characters * -1)
}
