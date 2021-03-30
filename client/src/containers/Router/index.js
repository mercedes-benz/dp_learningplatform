import React, {Component} from "react"
import {connect} from "react-redux"
import {push} from "redux-little-router"

import {routes} from "../../config"

import "./styles.css"

class Router extends Component {
  flattenedRoutes = {}
  flattenRoutes(routes, parentRoute = "") {
    Object.entries(routes).forEach(([route, item]) => {
      if (typeof item !== "object") {
        if (typeof this.flattenedRoutes[parentRoute + route] === "undefined") {

          const newRoute = {},
            routeIdentifier = (parentRoute === "/" && process.env.PUBLIC_URL !== "" ? process.env.PUBLIC_URL : process.env.PUBLIC_URL + parentRoute)

          newRoute[routeIdentifier] = routes

          this.flattenedRoutes = { ...this.flattenedRoutes, ...newRoute }
        }
      }
      else this.flattenRoutes(item, parentRoute + route)
    })
  }

  // getRouteContainer() {
  //   return Object.entries(routes).map(([route, item]) => {
  //     if (!(item.container.prototype instanceof React.Component || item.container.prototype instanceof React.PureComponent)) {
  //       throw new Error(
  //         `Container for route "${route}" must be a React component or pure component`
  //       )
  //     }

  //     if(route === this.props.router.route) {
  //       // show route container if route is not private or token is available
  //       if(!item.private || (item.private && this.props.token !== null)) {
  //         return <item.container key={item.key} />
  //       }
  //     }

  //     return null
  //   })
  // }

  render() {
    this.flattenRoutes(routes)
    return Object.entries(this.flattenedRoutes).map(([route, item]) => {
      if (!(item.container.prototype instanceof React.Component || item.container.prototype instanceof React.PureComponent)) {
      // if (typeof item.container !== "undefined" && !(item.container.prototype instanceof React.Component)) {
        throw new Error(
          `Container for route "${route}" must be a React component or pure component`
        )
      }

      if (route === this.props.router.route) {
        // show route container if route is not private or token is available
        if (!item.private || (item.private && this.props.token !== null)) {
          return <item.container key={item.key} />
        }
      }

      return null
    })
  }
}

const mapStateToProps = state => {
  return {
    router: state.router,
    token: state.login.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    push: (location) => dispatch(push(location))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Router)
