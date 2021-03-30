import React, {Component} from "react"
import PropTypes from "prop-types"
import {Link} from "redux-little-router"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import Button from "../../components/Button"
import Menu from "../Menu"

import ico_academy from "../../assets/icons/ico-academy.svg"
import ico_library from "../../assets/icons/ico-library.svg"

import "./styles.css"

class MainNav extends Component {
  constructor() {
    super()
    this.renderMenu = this.renderMenu.bind(this)
    this.slideUp = this.slideUp.bind(this)
    // this.updatePredicate = this.updatePredicate.bind(this)

    this.mainMenuBg = React.createRef();
    this.mainMenu = React.createRef();

    this.state = {
      // isMobile: false,
      activeDropdown: '',
      activeLink: ''
    }
  }

  static propTypes = {
    extraclass: PropTypes.string,
    items: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  }

  static defaultProps = {
    extraclass: "",
    items: [],
    onItemClick: () => {}
  }

  slideIn(e) {
    if (window.screen.width < 1199) {
      e.preventDefault();
      let activeLink = this.state.activeLink;
      e.target.classList.add("slide-in");
      activeLink = e.target;
      this.setState(prevState => {
        return {
          ...prevState,
          activeLink: activeLink
        }
      })
    }
  }
  slideOut(e) {
    if (window.screen.width < 1199) {
      e.preventDefault();
      const activeLink = this.state.activeLink;
      activeLink.classList.remove("slide-in");
      this.setState(prevState => {
        return {
          ...prevState,
          activeLink: ''
        }
      })
    }
  }

  slideUp(e) {
    if (window.screen.width >= 1200) {
      const menuBg = this.mainMenuBg.current;
      const activeDropdown = this.state.activeDropdown;
      const activeLink = this.state.activeLink;
      if (activeDropdown !== '') {
        activeLink.classList.remove("link-active")
        activeDropdown.style.height = "0px"
        activeDropdown.classList.remove('is-open')
        menuBg.style.height = "0px"
        menuBg.addEventListener('transitionend', () => {
          menuBg.classList.remove('is-open')
        }, { once: true })
        this.setState(prevState => {
          return {
            ...prevState,
            activeDropdown: '',
            activeLink: ''
          }
        })
      }
    }
  }
  slideDown(e) {
    if (window.screen.width >= 1200) {
      const menuBg = this.mainMenuBg.current;
      let activeDropdown = this.state.activeDropdown;
      let activeLink = this.state.activeLink;
      let dropdown = e.target.nextElementSibling;
      if (e.target.classList.contains("link-active")) {
        return false;
      }
      if (activeDropdown !== '') {
        activeDropdown.classList.remove("is-open");
        activeDropdown.style.height = "0px"
        activeDropdown.addEventListener('transitionend', () => {
          activeDropdown.classList.remove('active')
        }, { once: true })
      }
      if (activeLink !== '') {
        activeLink.classList.remove("link-active");
      }

      e.target.classList.add("link-active")

      dropdown.classList.add('is-open')
      dropdown.style.height = "auto"
      var height = dropdown.clientHeight + "px"
      dropdown.style.height = "0px"
      setTimeout(() => {
        dropdown.style.height = height
      }, 0)

      menuBg.classList.add('is-open')
      menuBg.style.height = "auto"
      menuBg.style.height = "0px"
      setTimeout(() => {
        menuBg.style.height = height
      }, 0)

      activeLink = e.target;
      this.setState(prevState => {
        return {
          ...prevState,
          activeDropdown: dropdown,
          activeLink: activeLink
        }
      })
    }
  }

  renderSubitems(propsevent, colapseevent, isMobile, lang, child) {
    const {t} = this.props
    let url, type;

    if (child.taxonomy === "learning_topic") {
      type = "learning"
      url = `/${lang}/learning/topic/` + child.term_id
    } else if (child.taxonomy === "knowledge_category") {
      type = "knowledge"
      url = `/${lang}/knowledge/articles/` + child.term_id
    } else {
      type = "custom"
      url = `/${lang}` + child.url
    }

    const learningProgress = ((child.read_articles > child.number_articles ? child.number_articles : child.read_articles) * 100) / child.number_articles

    return (
      <li key={child.term_id || child.id}>
        {child.taxonomy === "learning_topic" ?
          (
            <Link
              onClick={isMobile ? propsevent : colapseevent}
              activeProps={{ className: "active" }}
              href={url}
            >
              <span className="title" dangerouslySetInnerHTML={{ __html: child.name || child.title }} />
              <span className="info">
                <span>
                  <i className="icon icon-modules" />
                  <b>{child.number_modules}</b> {child.number_modules === 1 ? t("Modul") : t("Module")}
                </span>
              </span>
              <span className="status">
                <span style={{ width: `${learningProgress}%` }} className={["inner", learningProgress === 100 ? "done" : "in-progress"].join(" ")}>
                  <span className="percent">
                    {Math.floor(learningProgress)}%
                  </span>
                </span>
              </span>
              <i className="icon icon-arrow-right" />
            </Link>
          ):
          (
            <Link
              onClick={isMobile ? propsevent : colapseevent}
              activeProps={{ className: "active" }}
              href={url}
            >
              <span dangerouslySetInnerHTML={{ __html: child.name || child.title }} />
              <span className="info">
                {type === "knowledge" &&
                  <span>
                    <i className="icon icon-articles" />
                    <b>{child.number_articles}</b> {t("Artikel")}
                  </span>
                }
              </span>
              <i className="icon icon-arrow-right" />
            </Link>
          )
        }
      </li>
    )
  }

  renderMenu(key) {
    const { t, lang } = this.props
    const item = this.props.items[key]
    const propsevent = this.props.onItemClick
    const colapseevent = this.slideUp
    const isMobile = window.innerWidth < 1199

    if (typeof item.children === "undefined" || (typeof item.url === "undefined" && item.children.length === 0)) {
      return null
    }

    if (item.children.length > 0) {
      return (
        <li className={`${item.sub} ${item.children.length > 0 ? ("submenu") : ("")}`} key={key}>
          {item.url ?
            (
              <Link
                onClick={(e) => isMobile ? this.slideIn(e) : this.slideUp(e) }
                onMouseEnter={(e) => this.slideDown(e)}
                activeProps={{ className: "active" }}
                href={item.title === "Akademie" || item.title === "Academy" ?
                (`/${lang}` + item.url) :
                (`/${lang}/knowledge/articles`)
                }
              >
                {item.title === "Akademie" || item.title === "Academy" ? (
                  <img src={ico_academy} alt={item.title || item.name} />
                ) : (
                    <img src={ico_library} alt={item.title || item.name} />
                  )
                }
                <span>{item.title || item.name}</span>
                <i className="icon icon-arrow-right" />
              </Link>
            ) : (
              <Link
                activeProps={{ className: "active" }}
                href={`/${lang}/knowledge/articles/` + item.children[0].term_id}
              >
                <span>{item.title || item.name}</span>
                <i className="icon icon-arrow-right" />
              </Link>
            )
          }
          {isMobile ?
            (
              <div className="description-mobile">
                <p>{item.preview_description}</p>
              </div>
            ) :
            (null)
          }
          {item.children.length > 0 ? (
            <div className="dropdown">
              <div>
                <div className="dd-left">
                  <h2 className="icon title" onClick={(e) => this.slideOut(e)}>
                    {item.title === "Akademie" || item.title === "Academy" ? (
                        <img src={ico_academy} alt={item.title || item.name} />
                      ) : (
                        <img src={ico_library} alt={item.title || item.name} />
                      )
                    }
                    <span className={item.title === "Akademie" || item.title === "Academy" ? ("purple") : ("cyan")}>{item.title || item.name}</span>
                    <Link
                      onClick={propsevent}
                      activeProps={{ className: "active" }}
                      href={`/${lang}` + item.url}
                    >
                      <i className="icon icon-arrow-left" />
                      <span>
                        {t("Zurück")}
                      </span>
                    </Link>
                  </h2>
                  <p className="description">{item.preview_description}</p>
                  {item.title === "Akademie" || item.title === "Academy" ? (
                    <Button
                      theme="purple"
                      to={`/${lang}` + item.url}
                    >
                      {t("Zur Kursübersicht")}
                    </Button>
                  ) : (
                    <Button
                      theme="cyan"
                      to={`/${lang}/knowledge/articles`}
                    >
                      {t("Zur Kategorieübersicht")}
                    </Button>
                    )
                  }
                </div>
                <div className="dd-right">
                  {item.title === "Akademie" || item.title === "Academy" ? (
                    <h4 className="purple">{t("Verfügbare Kurse")}</h4>
                  ) : (
                      <h4 className="cyan">{t("Kategorien")}</h4>
                    )
                  }
                  <ul className={`level_2 ${item.title === "Akademie" || item.title === "Academy" ? ("purple") : ("cyan")}`}>
                    <li className="mobile-first">
                    </li>
                    {item.children.map(this.renderSubitems.bind(this, propsevent, colapseevent, isMobile, lang))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </li>
      )
    } else {
      return (
        <li className={`${item.title || item.name}`} key={key}>
          {item.url ? (
            <Link
              onClick={this.props.onItemClick}
              onMouseEnter={(e) => this.slideUp(e)}
              activeProps={{ className: "active" }}
              href={`/${lang}` + item.url}
            >
              <span>{item.title || item.name}</span>
            </Link>
          ) : (
            <Link
              activeProps={{ className: "active" }}
              href={`/${lang}/knowledge/articles/` + item.children[0].term_id}
            >
              <span>{item.title || item.name}</span>
            </Link>
          )}
        </li>
      )
    }
  }

  render() {
    const { extraclass, items, privacy_menu} = this.props
    const isMobile = window.innerWidth < 1199
    return (
      <nav className={`${extraclass}`}>
        <ul ref={this.mainMenu} className="level_1" onMouseLeave={(e) => this.slideUp(e)}>
          {Object.keys(items).map(this.renderMenu)}
        </ul>
        {isMobile ?
          (<Menu items={privacy_menu} />) : (
            <div
              className="main-menu-bg"
              ref={this.mainMenuBg}
              onMouseLeave={(e) => this.slideUp(e)}
            ></div>
          )}
      </nav>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

// export default MainNav
MainNav = connect(mapStateToProps)(MainNav)
export default translate()(MainNav)
