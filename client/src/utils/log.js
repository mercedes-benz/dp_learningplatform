const dev = (msg) => {
  process.env.NODE_ENV === "development" && console.log(msg)
}

const dir = (msg) => {
  process.env.NODE_ENV === "development" && console.dir(msg)
}

const warn = (msg) => {
  process.env.NODE_ENV === "development" && console.warn(msg)
}

export default {dev, dir, warn}
