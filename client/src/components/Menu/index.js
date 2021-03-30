import React, {Component} from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {Link} from "redux-little-router"

class Menu extends Component {
  constructor() {
    super()
    this.renderMenu = this.renderMenu.bind(this)
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

  renderSubitems(child) {
    return (
      <li key={child.term_id}>
        <Link
          activeProps={{ className: "active" }}
          href={"/knowledge/articles/" + child.term_id}
        >
          <span>
            {child.name}
          </span>
          <i className="icon-arrow" />
        </Link>
      </li>
    )
  }

  renderMenu(key) {
    const { lang } = this.props
    const item = this.props.items[key]
    if (item.taxonomy === "learning_topic") {
      return (
        <li className={`${item.title || item.name}`} key={key}>
          <Link
            activeProps={{ className: "active" }}
            href={`/${lang}/learning/topic/` + item.term_id}
          >
            <span>{item.title || item.name}</span>
          </Link>
        </li>
      )
    } else {
      if (typeof item.children === "undefined" || (typeof item.url === "undefined" && item.children.length === 0)) {
        return null
      }
    }
    return (
      <li className={`${item.title || item.name}`} key={key}>
        {item.url ? (
          <Link
            onClick={this.props.onItemClick}
            activeProps={{className: "active"}}
            href={`/${lang}` + item.url}
          >
            <span>{item.title || item.name}</span>
          </Link>
        ) : (
          <Link
            activeProps={{className: "active"}}
            href={`/${lang}/knowledge/articles/` + item.children[0].term_id}
          >
            <span>{item.title || item.name}</span>
          </Link>
        )}
      </li>
    )
  }

  render() {
    const { extraclass, items} = this.props

    return (
      <nav className={`${extraclass}`}>
        <ul className="level_1">{Object.keys(items).map(this.renderMenu)}</ul>
      </nav>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

// export default Menu
export default connect(mapStateToProps)(Menu)
