import React, {Component} from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {Link} from "redux-little-router"
import { translate } from "react-i18next"

import {Col} from "../../components/Grid"

import styles from "./styles.css"

class Breadcrumbs extends Component {
  constructor() {
    super()
    this.renderBreadcrumbs = this.renderBreadcrumbs.bind(this)
  }

  static propTypes = {
    items: PropTypes.array.isRequired
  }

  static defaultProps = {
    items: []
  }

  renderBreadcrumbs(key) {
    const item = this.props.items[key]

    return (
      <li key={key}>
        {item.href ? (
          <Link href={item.href}>
            <span>{item.title}</span>
          </Link>
        ) : (
          <span>{item.title}</span>
        )}
      </li>
    )
  }

  render() {
    const {items,t} = this.props

    return (
      <Col className={`${styles.Breadcrumbs} breadcrumbs`}>
        <nav className={this.props.theme}>
          <ul className="level_1">
            <li>{t("Sie sind hier:")}</li>
            {Object.keys(items).map(this.renderBreadcrumbs)}
          </ul>
        </nav>
      </Col>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

Breadcrumbs = connect(mapStateToProps)(Breadcrumbs)
export default translate()(Breadcrumbs)
// export default Breadcrumbs
