import React, {Component} from "react"
import { translate } from "react-i18next"

import { Col } from "../../components/Grid"

import styles from "./styles.css"

import badge from "../../assets/icons/badge_blank.png"
import logo from "../../assets/icons/logo.png"
import logo_simplicity from "../../assets/icons/dp_logo.png"

class Certificate extends Component {
  constructor() {
    super()

    this.state = {
    }

    this.renderCourses = this.renderCourses.bind(this)
  }

  renderCourses(divider, col = false, item, index ) {
    if (divider) {
      if (col === "is_left" && index >= divider) {
        return null;
      }
      if (col === "is_right" && index < divider) {
        return null;
      }
    }
    return (
      <li key={index}>
        {item}
      </li>
    )
  }

  render() {
    const { topicname, modulesNames, currentDate, isCrtPrinting, closeCrtPrint, username, t } = this.props
    let splitBy = false;
    let isTwoCols = modulesNames.length > 6;
    if (modulesNames !== 'undefined' && isTwoCols) {
      splitBy = Math.ceil(modulesNames.length / 2);
    }

    return (
      <Col className={`${styles.CrtPrint} crt-print ${isCrtPrinting ? "is-active" : ""}`}>
        <button onClick={closeCrtPrint}><i className="icon icon-close"></i></button>
        <section id="crt-print" className="page">
          <div className="inner">
            <div className="logo">
              <img src={logo} alt="SIMPLICITY" width="75" height="75" />
            </div>
            <div className="intro">
              <h1>{t("Teilnahmebestätigung")}</h1>
            </div>
            <div className="participant">{username}</div>
            <div className={`courses ${isTwoCols ? 'columns': ''}`}>
              <p>{t("hat den Kurs")} <strong>"{topicname}"</strong>{t(" erfolgreich durchgeführt.")}</p>
              <p>{t("Inhalte des Kurses:")}</p>
              {modulesNames !== 'undefined' && modulesNames.length > 0 ?
                (
                  isTwoCols ?
                  (
                    <div className="flexbox">
                      <ol className="col-left">
                        {modulesNames.map(this.renderCourses.bind(this, splitBy, "is_left"))}
                      </ol>
                      <ol className="col-right" start={`${splitBy}`} style={{ '--s': splitBy }}>
                        {modulesNames.map(this.renderCourses.bind(this, splitBy, "is_right"))}
                      </ol>
                    </div>  
                  ) : (
                    <ol>
                      {modulesNames.map(this.renderCourses.bind(this, false, false))}
                    </ol>
                  )
                ) : (
                  <ol>
                    <li>Zertifikat bestätigt den Abschluss</li>
                    <li>Zertifikat bestätigt den Abschluss</li>
                    <li>Zertifikat bestätigt den Abschluss</li>
                    <li>Zertifikat bestätigt den Abschluss</li>
                  </ol>
                )
              }
            </div>
            <div className="outro">
              <h3>{t("Herzlichen Glückwunsch!")}</h3>
            </div>
            <div className="badge">
              <img src={badge} alt="SIMPLICITY" />
              <span className="date">{currentDate}</span>
            </div>
            <div className="footer">
              <div className="col-left">
                <img src={logo} alt="SIMPLICITY" />
                <p>{t("Einfach")} <strong>{t("LERNEN")}</strong> – {t("Einfach")} <strong>{t("FINDEN")}</strong></p>
              </div>
              <span></span>
              <div className="col-right">
                <img src={logo_simplicity} alt="SIMPLICITY" />
              </div>
            </div>
          </div>
        </section>
      </Col>
    )
  }
}

export default translate()(Certificate)
