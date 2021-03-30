import React, {PureComponent} from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import Button from "../Button"

import { urls } from "../../config"
import env from "../../env";
import {version, branch} from "../../../package.json";

import styles from "./styles.css"

class LoginForm extends PureComponent {
  constructor(props) {
    super(props)

    this._username = null
    this._password = null

    this.triggerSubmit = this.triggerSubmit.bind(this)
    this.openOAuth = this.openOAuth.bind(this)
  }

  static propTypes = {
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    onSubmit: (_username, _password) => {},
  }

  triggerSubmit(e) {
    e.preventDefault()

    this.props.onSubmit(this._username.value, this._password.value)
  }

  openOAuth(e) {
    e.preventDefault()

    document.location = urls.oauth
  }

  slideToggle(e) {
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
      var height = dropdown.clientHeight + "px"
      dropdown.style.height = "0px"
      setTimeout(() => {
        dropdown.style.height = height
      }, 0)
    }
  }

  render() {
    const { t } = this.props
    return <div className={styles.LoginBlock}>
        <div className={styles.LoginOIDC}>
          <div className="inner">
            <h3>{t("Daimler-Login")}</h3>
            <p>
              {t(
                "Hier können Sie sich mit Ihrem bekannten Daimler User und Passwort anmelden."
              )}
            </p>
            <Button theme="purple" onClick={this.openOAuth}>
              {t("Jetzt einloggen")}
            </Button>
            {typeof env.URL_REGISTER !== "undefined" && env.URL_REGISTER && (
              <p className="no-account">
                {t("Sie haben noch keinen Zugang?")} <a href={env.URL_REGISTER}>
                  {t("Dann direkt hier beantragen.")}
                </a>
              </p>
            )}
          </div>
        </div>
        {typeof env.DEBUG_LOGIN !== "undefined" && env.DEBUG_LOGIN && <div className={styles.LoginForm}>
            <p onClick={e => this.slideToggle(e)} className="login-toggler">
              <span>{t("Login ohne Daimler-Account")}</span>
              <i className="icon-arrow-down" />
            </p>
            <div className="login-dropdown">
              <p>
                {t(
                  "Nutzen Sie für die Anmeldung bitte den Benutzernamen and das Passwort, welches Sie per E-Mail erhalten haben."
                )}
              </p>
              <form onSubmit={this.triggerSubmit}>
                <div className="form-control">
                  <label htmlFor="username">{t("Benutzername")}</label>
                  <input type="text" id="username" ref={username => (this._username = username)} />
                </div>
                <div className="form-control">
                  <label htmlFor="password">{t("Passwort")}</label>
                  <input type="password" id="password" ref={password => (this._password = password)} />
                </div>
                <Button theme="dark" onClick={() => {}}>
                  {t("Jetzt einloggen")}
                </Button>
              </form>
            </div>
          </div>}
          <span className={styles.version}>{t("Version")} {version} {branch && `(${branch})`}</span>
      </div>
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

LoginForm = connect(mapStateToProps)(LoginForm)
export default translate()(LoginForm)
