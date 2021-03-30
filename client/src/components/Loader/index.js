import React, {Component} from "react"
import PropTypes from "prop-types"
import { translate } from "react-i18next"

import styles from "./styles.css"

import logo from "../../assets/icons/simplicity-logo-s.svg"
import logoRim from "../../assets/icons/simplicity-logo-circle.svg"
import loader from "../../assets/svg/spinner.svg"

class Loader extends Component {
  static propTypes = {
    active: PropTypes.bool
  }

  static defaultProps = {
    active: true
  }

  render() {
    const { t } = this.props
    const activeClass = this.props.active ? "active" : ""
    return (
      <div className={`${styles.Loader} ${activeClass}`}>
        <div className="rim">
          <img className="logo-rim" alt="logo-rim" src={logoRim} />
          <img className="logo" alt="logo" src={logo} />
          <img className="spinner" alt="logo" src={loader} />
          <h2 className="headline">{t("Einen Moment, der Inhalt wird geladen.")}</h2>
        </div>
      </div>
    )
  }
}

export default translate()(Loader)
// export default Loader
