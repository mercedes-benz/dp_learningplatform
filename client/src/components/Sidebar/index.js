import React, {Component} from "react"
import PropTypes from "prop-types"
import {Link} from "redux-little-router"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import styles from "./styles.css"

class Sidebar extends Component {
  constructor() {
    super()

    this.state = {
      activeDropdown: '',
      activeLink: ''
    }

    this.renderSidebar = this.renderSidebar.bind(this)
    this.renderSubitems = this.renderSubitems.bind(this)
  }

  static propTypes = {
    classname: PropTypes.string,
    items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }

  static defaultProps = {
    classname: "",
    items: []
  }

  componentDidUpdate() {
    this.initMobileToggler()
  }

  slideToggle(e) {
    let activeDropdown = this.state.activeDropdown;
    let activeLink = this.state.activeLink;
    let dropdown = e.target.nextElementSibling;
    e.preventDefault();
    if (e.target.parentNode.classList.contains("is-active")) {
      e.target.parentNode.classList.remove("is-active");
      dropdown.classList.remove("is-open");
      dropdown.style.height = "0px"
      dropdown.addEventListener('transitionend', () => {
        dropdown.classList.remove('active')
      }, { once: true })
      this.setState(prevState => {
        return {
          ...prevState,
          activeDropdown: '',
          activeLink: ''
        }
      })
    } else {
      if (activeLink !== '') {
        activeLink.classList.remove("is-active");
      }
      if (activeDropdown !== '') {
        activeDropdown.classList.remove("is-open");
        activeDropdown.style.height = "0px"
        activeDropdown.addEventListener('transitionend', () => {
          activeDropdown.classList.remove('active')
        }, { once: true })

      }

      e.target.parentNode.classList.add("is-active")
      dropdown.classList.add('is-open')
      dropdown.style.height = dropdown.scrollHeight + 'px';

      activeLink = e.target.parentNode;
      this.setState(prevState => {
        return {
          ...prevState,
          activeDropdown: dropdown,
          activeLink: activeLink
        }
      })
    }
  }

  initMobileToggler() {
    let toggler = document.querySelector(".mobile-toggler")
    toggler.onclick = function(e) {
      e.stopPropagation()
      e.preventDefault()

      if (e.target && e.target.nodeName === "BUTTON") {
        if (e.target.classList.contains("active")) {
          e.target.classList.remove("active")
        } else {
          e.target.classList.add("active")
        }
      }
    }
  }

  renderSubitems(lang,child) {
    let url;
    if (child.taxonomy === "learning_topic") {
      url = `/${lang}/learning/topic/` + child.term_id
    } else if (child.taxonomy === "faq_category") {
      url = `/${lang}/faq/articles/` + child.term_id
    } else {
      url = `/${lang}/knowledge/articles/` + child.term_id
    }

    return (
      <li key={child.term_id}>
        <Link
          activeProps={{ className: "active" }}
          href={url}
        >
          <span dangerouslySetInnerHTML={{ __html: child.name }} />
          <span className="count">({child.count})</span>
          <i className="icon-arrow-right" />
        </Link>
      </li>
    )
  }

  renderSidebar(key) {
    const { lang, t } = this.props
    const item = this.props.items[key]
    if (typeof item.children === "undefined" || item.children.length === 0) {
      return null
    }

    let classname;
    let current;
    let articlesamount = 0;
    let url;

    item.children.forEach(function (item, i, arr) {
      articlesamount += item.count
    });

    if (this.props.currentPage === item.name || this.props.currentPage === item.children[0].taxonomy) {
      classname = "active"
      current = "is-current"
    }
    if (item.taxonomy === "learning_topic") {
      url = `/${lang}/learning/topic/` + item.term_id
    } else if (item.name === "FAQ") {
      url = `/${lang}/faq/articles/` + item.children[0].term_id
    } else {
      url = `/${lang}/knowledge/articles/` + item.term_id
    }
    return (
      <li key={key} className={current}>
        <Link onClick={(e) => this.slideToggle(e)} activeProps={{ className: "active" }} className={classname} href={url}>
          <span dangerouslySetInnerHTML={{ __html: item.name }} />
        </Link>
        {item.children.length > 0 ? (
          <ul className="level_2">
            {item.taxonomy === "knowledge_category" ?
              (
                <li className="all">
                  <Link activeProps={{ className: "active" }} href={url}>
                    <span>{t("Alle Beiträge")}</span>
                    <span className="count">({articlesamount})</span>
                  </Link>
                </li>
              ) : (null)
            }
            {item.children.map(this.renderSubitems.bind(null, lang))}
          </ul>
        ) : null}
      </li>
    )
  }

  render() {
    const {items, lang, t} = this.props
    return (
      <div className={`${styles.Sidebar} sidebar-nav theme-${this.props.theme}`}>
        <button className="mobile-toggler">
          {t("Wählen Sie Ihre Kategorie")}<i className="icon-arrow-down" />
        </button>
        <nav>
          <ul className="level_1">
            <li className="all">
              <Link activeProps={{ className: "active" }} href={`/${lang}/knowledge/articles`}>
                {t("Alle Beiträge")}
              </Link>
            </li>
            {Object.keys(items).map(this.renderSidebar)}
          </ul>
        </nav>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

// export default Sidebar
Sidebar = connect(mapStateToProps)(Sidebar)
export default translate()(Sidebar)
