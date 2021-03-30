import {urls} from "../config"

export default async (path, method = "GET", init = {}) => {
  const response = await fetch(`${urls.auth}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    ...init
  })

  if(!response.ok) {
    const error = await response.json()
    throw new Error(`${error.code}`)
  }

  return response.json()
}
