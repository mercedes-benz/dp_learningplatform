import {combineReducers} from "redux"
import {routerForBrowser} from "redux-little-router"
import {persistReducer} from "redux-persist"

import rootSaga from "./sagas"
import {routes} from "./config"
import configureStore from "./config/configureStore"
import {reducer as appReducer} from "./containers/App/redux"
import {reducer as commentsReducer} from "./containers/Comments/redux"
import { reducer as langSwitchReducer } from "./components/LangSwitch/redux"
import {persistConfig} from "./config"

const prepareRoutes = (routes) => {
  const finalRoutes = {}

  Object.entries(routes).forEach(([route, item]) => {
    const routeIdentifier = route === "/" && process.env.PUBLIC_URL !== "" ? process.env.PUBLIC_URL : process.env.PUBLIC_URL + route
    finalRoutes[routeIdentifier] = item
  })

  return finalRoutes
}

// routes need to be flattened as well, it only lists the first level
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

export default () => {
  /* ------------- Router ------------- */
  // const reduxRouter = routerForBrowser({routes})
  const reduxRouter = routerForBrowser({ routes: prepareRoutes(routes) })

  /* ------------- Assemble The Reducers ------------- */
  let reducers = {
    router: reduxRouter.reducer,
    app: appReducer,
    comments: commentsReducer,
    langswitch: langSwitchReducer

  }

  // add reducers by routes config
  flattenRoutes(routes)

  Object.keys(flattenedRoutes).forEach((routePath) => {
    if(typeof flattenedRoutes[routePath].reducer !== "undefined") {
      reducers[flattenedRoutes[routePath].key] = flattenedRoutes[routePath].reducer
    }
  })

  // for (let routePath in flattenedRoutes) {
  //   let routeParams = flattenedRoutes[routePath]

  //   if (typeof routeParams.reducer !== "undefined") {
  //     reducers[routeParams.key] = routeParams.reducer
  //   }
  // }

  let rootReducer = combineReducers(reducers)

  rootReducer = persistReducer(persistConfig, rootReducer)

  return configureStore(rootReducer, rootSaga, reduxRouter)
}
