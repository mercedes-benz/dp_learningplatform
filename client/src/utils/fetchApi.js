import {urls} from "../config"
import {store} from "../"

export default async (path, method = "GET", init = {}) => {
  const state = store.getState()

  const headers = state.login.token !== null ?
  {
    "Authorization": `Bearer ${state.login.token}`,
    "Content-Type": "application/json; charset=utf-8",
  } : {
    "Content-Type": "application/json; charset=utf-8",
  }

  const response = await fetch(`${urls.api}${path}`, {
      method,
      headers,
      ...init
    })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`${error.code}: ${error.message}`)
  }

  return response.json()
}
