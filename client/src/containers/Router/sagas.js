import {select, call} from "redux-saga/effects"
import {push} from "redux-little-router"

import {routes} from "../../config"
import { i18n } from "../../utils"

let flattenedRoutes = {}

const flattenRoutes = (routes, parentRoute = "") => {
  Object.entries(routes).forEach(([route, item]) => {
    if (typeof item !== "object") {
      if (typeof flattenedRoutes[parentRoute + route] === "undefined") {

        const newRoute = {},
          routeIdentifier = (parentRoute === "/" && process.env.PUBLIC_URL !== "" ? process.env.PUBLIC_URL : process.env.PUBLIC_URL + parentRoute)

        newRoute[routeIdentifier] = routes

        flattenedRoutes = { ...flattenedRoutes, ...newRoute }
      }
    }
    else flattenRoutes(item, parentRoute + route)
  })
}

export default function* router(dispatch, action) {
  const {payload} = action
  const {route} = payload
  const state = yield select()

  // change language based on route param
  if (typeof state.router.params.lang !== "undefined") {
    i18n.changeLanguage(state.router.params.lang)
  }

  flattenRoutes(routes)

  for (let routePath in flattenedRoutes) {
    if (routePath !== route) {
      continue
    }

    let routeParams = flattenedRoutes[routePath]

    // check if route is private
    // if so, redirect to login
    if(routeParams.private && state.login.token === null) {
      dispatch(push(`/de/login?referer=${encodeURI(state.router.pathname)}`))

    // otherwise call route saga
    } else {
      if (typeof routeParams.sagas !== "undefined") {
        // scroll window to top on router change
        window.scrollTo(0, 0)

        yield call(routeParams.sagas, dispatch, action)
      }
    }
  }
}
