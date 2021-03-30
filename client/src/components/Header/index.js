import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"
import {push} from "redux-little-router"

import {Container, Row, Col} from "../Grid"
import {Link} from "redux-little-router"
import MainNav from "../MainNav"

import LangSwitch from "../LangSwitch"

import styles from "./styles.css"
// import logo from "../../assets/icons/simplicity-logo-black.svg"
import logo from "../../assets/icons/logo.svg"

class Header extends Component {
  state = {
    active: false,
    isfixed: false,
    searchValue: ""
  }

  constructor(props) {
    super(props)

    this._toggleMenu = this._toggleMenu.bind(this)
    this._hideMenu = this._hideMenu.bind(this)
    this.doSearch = this.doSearch.bind(this)
    this._handleKeyPress = this._handleKeyPress.bind(this)
    this._handleSearchIconEvent = this._handleSearchIconEvent.bind(this)
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    // this._switchLang = this._switchLang.bind(this)
    this.searchInput = null
  }

  // componentDidUpdate() {
  //   this.menuActiveStateTempfix()
  // }

  componentWillMount() {
    window.addEventListener("scroll", this._handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this._handleScroll)
  }

  menuActiveStateTempfix() {
    let headerNavLink = document.querySelector('.main-nav li:nth-child(3) a');

    if(headerNavLink) {
      headerNavLink.classList.remove('active');
      if(this.props.page === 'knowledgearticles' || this.props.page === 'knowledgesingle') {
        headerNavLink.classList.add('active');
      }
    }
  }

  _handleScroll() {
    let pageY = window.pageYOffset
    if (pageY > 200) {
      this.setState({
        isfixed: true
      })
    } else if (pageY < 150) {
      this.setState({
        isfixed: false
      })
    }
  }

  _toggleMenu() {
    if (!this.state.active) {
      if (this.props.page === "learningmodules") {
        document.querySelector('li.learning > a').click()
      }
    }
    this.setState(prevState => {
      return {
        ...prevState,
        active: !prevState.active
      }
    })
  }

  _hideMenu() {
    this.setState(prevState => {
      return {
        ...prevState,
        active: false
      }
    })
  }

  doSearch(e) {
    e.preventDefault()
    const { lang } = this.props
    const encodedSearchValue = encodeURI(this.state.searchValue)

    this.props.push(`/${lang}/search?q=${encodedSearchValue}`)

    this.searchInput.value = ""
    this.setState(prevState => {
      return {
        ...prevState,
        searchValue: ""
      }
    })
  }

  _handleKeyPress = event => {
    if (event.key === 'Enter') {
      this._hideMenu();
    }
  };

  _handleSearchIconEvent() {
    const { lang } = this.props
    this.setState(prevState => {
      return {
        ...prevState,
        active: false
      }
    })
    this.props.push(`/${lang}/search`)
  }

  handleSearchInputChange(e) {
    e.persist()
    this.setState(prevState => {
      return {
        ...prevState,
        searchValue: e.target.value
      }
    })
  }

  render() {
    const { avatar, main_menu, num_bookmarks, privacy_menu, lang, t} = this.props
    if (num_bookmarks === null) {
      return null
    }
    return (
      <header
        className={`${styles.Header} ${this.state.isfixed ? "is-fixed" : ""}`}
        data-scroll-header
      >
        <Container>
          <Row className="d-print-block">
            <Col
              className={`nav ${this.state.active ? "is-active" : ""}`}
              md={5}
            >
              <div className="search-mobile">
                <form onSubmit={this.doSearch}>
                  <input
                    className="input"
                    placeholder={t("Suchbegriff eingeben...")}
                    type="text"
                    onKeyPress={this._handleKeyPress}
                    ref={input => {
                      this.searchInput = input
                    }}
                    onChange={this.handleSearchInputChange}
                  />
                  <button className="submit icon-search" />
                </form>
              </div>
              <MainNav
                extraclass={this.props.page}
                items={main_menu}
                onItemClick={this._hideMenu}
                privacy_menu={privacy_menu}
              />
            </Col>
            <Col className="logo" md={3}>
              {this.props.page === 'home' ?
                (<img src={logo} alt="SIMPLICITY" />) :
                (<Link href={`/${lang}/`} style={{ backgroundImage: `url(${logo})` }}><img src={logo} alt="SIMPLICITY" /></Link>)}

            </Col>
            <Col className="search" md={3}>
              <form onSubmit={this.doSearch}>
                <input
                  className="input"
                  placeholder={t("Suchbegriff eingeben...")}
                  type="text"
                  ref={input => {
                    this.searchInput = input
                  }}
                  onChange={this.handleSearchInputChange}
                />
                <button className="submit icon-search-thin" />
              </form>
            </Col>
            <Col className="search--open">
              <button
                className="submit icon-search-thin"
                // onClick={this._handleSearchIconEvent}
                onClick={this._toggleMenu}
              ><span>Suche</span></button>
            </Col>
            <Col className="burger">
              <button
                onClick={this._toggleMenu}
                className={`${this.state.active ? "is-active" : ""}`}
              ><span>Menü</span></button>
            </Col>
            <Col className="avatar" md={1}>
              <img alt="avatar" src={avatar} />
              <div className="icon">
                <div className="drop">
                  <div className="inner">
                    <ul>
                      <li>
                        <Link href={`/${lang}/profile`}>
                          <i className="icon-user"></i>
                          <span>{t("Mein Profil")}</span></Link>
                      </li>
                      <li>
                        <Link href={`/${lang}/profile/learningprogress`}>
                          <i className="icon-progress"></i>
                          <span>{t("Mein Lernfortschritt")}</span></Link>
                      </li>
                      <li>
                        <Link href={`/${lang}/profile/wishlist`}>
                          <i className="icon-list"></i>
                          <span>{t("Meine Lesezeichen")}</span></Link>
                      </li>
                      <li>
                        <Link href={`/${lang}/profile/certificates`}>
                          <i className="icon-certificate"></i>
                          <span>{t("Meine Zertifikate")}</span></Link>
                      </li>
                    </ul>
                    <Link className="logout" href={`/${lang}/logout`}>
                      <span>{t("Logout")}</span>
                      <i className="icon-logout"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
            <LangSwitch />
            <Col className="print-me">
              <p>Simplicity - Lernen und Wissen neu definiert.</p>
            </Col>
          </Row>
        </Container>
      </header>
    )
  }
}

const mapStateToProps = state => {
  return {
    lang: state.app.lang
  }
}

const mapDispatchToProps = dispatch => {
  return {
    push: location => dispatch(push(location))
  }
}
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Header)

Header = connect(mapStateToProps, mapDispatchToProps)(Header)
export default translate()(Header)
