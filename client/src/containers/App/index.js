import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {initializeCurrentLocation} from "redux-little-router"

import Router from "../Router"
import StartupActions, {StartupTypes} from "./startup.redux"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Cookiebar from "../../components/Cookiebar"
import env from "../../env"

import 'mediaelement/build/mediaelementplayer.min.css';
import "mediaelement"

import "./styles.css"

class App extends Component {
  static propTypes = {
    main_menu: PropTypes.object.isRequired,
    footer_menu: PropTypes.object.isRequired,
    topic_menu: PropTypes.array.isRequired,
    categories_menu: PropTypes.array.isRequired
  }

  static defaultProps = {
    main_menu: {},
    footer_menu: {},
    topic_menu: [],
    categories_menu: [],
    lang: '',
    num_bookmarks: null
  }

  componentDidMount() {
    // dispatch startup location
    const initialLocation = this.props.router
    if (initialLocation) {
      this.props.dispatch({
        ...initializeCurrentLocation(initialLocation),
        type: StartupTypes.STARTUP_ROUTER_LOCATION
      })
    }

    this.props.startup()

    this.insertTracking()
  }

  insertTracking() {
    if(process.env.NODE_ENV === "development" || !env.DOMAIN_MATOMO) return

    const _paq = window._paq || []

    _paq.push(["trackPageView"])
    _paq.push(["enableLinkTracking"])

    const trackerUrl = `//${env.DOMAIN_MATOMO}/matomo.php`
    _paq.push(['setTrackerUrl', trackerUrl])
    _paq.push(['setSiteId', '1'])

    window._paq = _paq

    let s = document.createElement("script")
    const pos = document.getElementsByTagName("script")[0]

    s.type = "text/javascript"
    s.async = true
    s.defer = true
    s.src = `//${env.DOMAIN_MATOMO}/matomo.js`

    pos.parentNode.insertBefore(s, pos)
  }

  render() {

    if(typeof this.props.login !== "undefined" && this.props.login.token !== null) {
      return (
        <div className="App">
          <Header 
            page={this.props.router.result.key} 
            pathname={this.props.router.pathname} 
            main_menu={this.props.main_menu} 
            avatar={this.props.login.avatar} 
            num_bookmarks={this.props.num_bookmarks} 
            privacy_menu={this.props.footer_menu}
          />
          <Router />
          <Footer
            footer_menu={this.props.footer_menu}
          />
          <Cookiebar />
        </div>
      )
    } else {
      return (
        <div className="App">
          <Router />
          <Cookiebar />
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    router: state.router,
    main_menu: state.app.main_menu,
    footer_menu: state.app.footer_menu,
    topic_menu: state.app.topic_menu,
    categories_menu: state.app.categories_menu,
    login: state.login,
    lang: state.app.lang,
    num_bookmarks: state.app.num_bookmarks
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
    startup: () => dispatch(StartupActions.startup())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
