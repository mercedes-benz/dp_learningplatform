import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"
import CookieConsent from "react-cookie-consent";

class Cbar extends Component {

  render() {
    const {t} = this.props
    return (
      <CookieConsent
        location="bottom"
        buttonText={t("Akzeptieren")}
        cookieName="gdpr"
        style={{ background: "#fff" }}
        buttonStyle={{ color: "#fff", fontSize: "16px" }}
        expires={150}
        disableStyles={true}
      >
        <p>{t("Diese Internetseite verwendet Cookies, um die Nutzererfahrung zu verbessern und den Benutzern bestimmte Dienste und Funktionen bereitzustellen.")}
        <a href="/datenschutz">{t("Mehr Informationen")}</a>
        </p>
      </CookieConsent>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

Cbar = connect(mapStateToProps)(Cbar)
export default translate()(Cbar)
