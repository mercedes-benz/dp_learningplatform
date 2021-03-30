import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {UserProfileCreators as Creators} from "./redux"
import { LoginCreators } from "../Login/redux"
import { translate } from "react-i18next"
import {push} from "redux-little-router"

import {Container, Row, Col} from "../../components/Grid"
import Breadcrumbs from "../../components/Breadcrumbs"
import Loader from "../../components/Loader"
import Message from "../../components/Message"

import { ManageBookmarksCreators as MBCreators } from "../ManageBookmarks/redux"

import api from "../../services/ApiService"

import { log } from "../../utils"

import UserInformation from "./UserInformation"
import LearningProgress from "./LearningProgress"
import Wishlist from "./Wishlist"
import Certificates from "./Certificates"

import styles from "./styles.css"

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSection: ""
    }

    this.removeBookmark = this.removeBookmark.bind(this)
    this.removeAllBookmarks = this.removeAllBookmarks.bind(this)
  }

  static propTypes = {
    userdata: PropTypes.object.isRequired,
    userprogress: PropTypes.object.isRequired,
    userbookmarks: PropTypes.object.isRequired,
    usercertificates: PropTypes.object.isRequired,
    error: PropTypes.string,
    fetching: PropTypes.bool
  }

  static defaultProps = {
    userdata: {},
    userprogress: {},
    userbookmarks: {},
    usercertificates: {},
    num_bookmarks: null,
    fetching: false,
    error: null
  }

  componentDidMount() {
    const {action} = this.props

    this.setCurrentSection(action ? action : "userinformation")
  }

  componentDidUpdate(prevProps) {
    const {action} = this.props

    if(prevProps.action !== action) {
      this.setCurrentSection(action)
    }
  }

  setCurrentSection(section) {
    this.setState({
      currentSection: section
    })
  }

  toggleDropdown(e) {
    let dropdown = e.target.nextElementSibling;
    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active");
      dropdown.classList.remove("is-open");
      dropdown.style.height = "0px"
      dropdown.addEventListener('transitionend', () => {
        dropdown.classList.remove('active')
      }, { once: true })
    } else {
      e.target.classList.add("active")
      dropdown.classList.add('is-open')
      dropdown.style.height = "auto"
      var height = dropdown.clientHeight + 30 + "px"
      dropdown.style.height = "0px"
      setTimeout(() => {
        dropdown.style.height = height
      }, 200)
    }
  }

  removeBookmark(e,id,lang,container) {
    let currentTile = e.target.parentNode.parentNode.parentNode;
    currentTile.parentNode.removeChild(currentTile);
    this.props.removeBookmark(id, lang, container)
    this.props.decreaseBookmarksAmount()
  }

  async removeAllBookmarks(e, lang, elem) {
    try {
      const response = await api.removeAllBookmarks(lang)
      if (response.status === "success") {
        document.querySelector(elem).innerHTML = "";
      }
    } catch (e) {
      log.dir(e)
    }
    this.props.clearBookmarksAmount()
  }

  renderProfile(type) {
    if(this.props.userdata.user === undefined) {
      return null
    }
    const userProps = { ...this.props.userdata, replaceAvatar: this.props.replaceAvatar }
    const learningProps = { ...this.props.userprogress }
    const bookmarksProps = { ...this.props.userbookmarks, num_bookmarks: this.props.num_bookmarks, removeBookmark: this.removeBookmark, removeAllBookmarks: this.removeAllBookmarks }
    const certificatesProps = { ...this.props.usercertificates, username: this.props.userdata.user.display_name}
    switch (type) {
      case "userinformation": return <UserInformation {...userProps} />;
      case "learningprogress": return <LearningProgress {...learningProps} />;
      case "wishlist": return <Wishlist {...bookmarksProps} />;
      case "certificates": return <Certificates {...certificatesProps} />;
      default: return <UserInformation {...userProps} />;
    }
  }

  loadSection(section) {
    const {push, lang} = this.props

    push(`/${lang}/profile/${section}`)
  }

  render() {
    const { error, fetching, t, lang } = this.props

    if(error) {
      return (
        <Message error>
          <p>
            <strong>{t("Es ist ein Fehler aufgetreten.")}</strong><br />
            {error}
          </p>
        </Message>
      )
    }

    const breadcrump_items = [
      {
        title: `${t("Startseite")}`,
        href: `/${lang}/`
      },
      {
        title: `${t("Profil")}`,
        href: null
      }
    ]

    return (
      <div className={styles.Profile}>
        <Loader active={fetching} />
        <div className={styles.ProfileData}>
          <div className="wp-content color-black">
            <Container>
              <Row className="row-fluid">
                <Col xl={10}>
                  <div className="text_column">
                    <h1 className="headline">{t("Mein Profil")}</h1>
                    <p className="description no-margin">{t("Neben Informationen zu deinem Simplicity-Account findest du hier auch den aktuellen Stand deines Lernfortschritts sowie all deine gespeicherten Lesezeichen und Zertifikate.")}</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="container-breadcrumbs">
            <Container>
              <Row className="row-fluid">
                <Breadcrumbs items={breadcrump_items} theme="black" />
              </Row>
            </Container>
          </div>
          <div className="inside">
            <Container>
              <Row className="row-fluid">

                <div className={`${styles.ProfileSidebar} sidebar-nav col-lg-4 col-12 ${this.state.currentSection}`}>
                  <button className="mobile-toggler" onClick={(e) => this.toggleDropdown(e)}>
                    {t("Wählen Sie Ihre Profilseite aus")}
                    <i className="icon-arrow-down"></i>
                  </button>
                  <nav>
                    <ul className="level_1">
                      <li className="userinformation" onClick={() => this.loadSection("userinformation")}>
                        <i className="icon-user"></i><span>{t("Benutzerinformationen")}</span><i className="icon-arrow-right"></i>
                      </li>
                      <li className="learningprogress" onClick={() => this.loadSection("learningprogress")}>
                        <i className="icon-progress"></i><span>{t("Mein Lernfortschritt")}</span><i className="icon-arrow-right"></i>
                      </li>
                      <li className="wishlist" onClick={() => this.loadSection("wishlist")}>
                        <i className="icon-list"></i><span>{t("Meine Lesezeichen")}</span><i className="icon-arrow-right"></i>
                      </li>
                      <li className="certificates" onClick={() => this.loadSection("certificates")}>
                        <i className="icon-certificate"></i><span>{t("Meine Zertifikate")}</span><i className="icon-arrow-right"></i>
                      </li>
                    </ul>
                  </nav>
                </div>
                {this.renderProfile(this.state.currentSection)}
              </Row>
            </Container>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.userprofile,
    slug: state.router.params.slug,
    lang: state.app.lang,
    action: typeof state.router.params.action !== "undefined" ? state.router.params.action : null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUserData: () => dispatch(Creators.request()),
    decreaseBookmarksAmount: () => dispatch(Creators.decreaseBookmarksAmount()),
    clearBookmarksAmount: () => dispatch(Creators.clearBookmarksAmount()),
    replaceAvatar: (avatar) => dispatch(LoginCreators.replaceAvatar(avatar)),
    removeBookmark: (id, lang, container) => dispatch(MBCreators.removeBookmark(id, lang, container)),
    push: (route) => dispatch(push(route)),
  }
}

UserProfile = connect(mapStateToProps, mapDispatchToProps)(UserProfile)
export default translate()(UserProfile)

export {reducer} from "./redux"
export { default as sagas} from "./sagas"
