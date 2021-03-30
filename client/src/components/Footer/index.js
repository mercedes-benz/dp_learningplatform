import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../Grid"
import ScrollButton from "../ScrollButton"
import Menu from "../Menu"

import styles from "./styles.css"

// import logo from "../../assets/icons/simplicity-logo-black.svg"
import simplicity_logo from "../../assets/icons/logo-simplicity.svg"
import protics_logo from "../../assets/icons/logo-protics.svg"

class Footer extends Component {
  render() {
    const {footer_menu, t} = this.props

    return (
      <footer className={styles.Footer}>
        <div className="footer-top">
          <Container>
            <Row>
              <Col className="footer-simplicity" xl={3} sm={6}>
                <img src={simplicity_logo} alt="Simplicity" />
                <p>{t("Simplicity – Lernen und Wissen neu definiert!")}</p>
              </Col>
              <Col className="footer-protics" xl={3} sm={6}>
                <img src={protics_logo} alt="Simplicity" />
                <p>
                  <span className="small">Powered by</span>
                  <span>Daimler Protics</span>
                  <span className="small">Data driven by Passion</span>
                </p>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="footer-bottom">
          <Container>
            <Row>
              <Col className="footer-copyright" lg={5}>
                <p>&copy; {new Date().getFullYear()} {t("Daimler Protics GmbH. Alle Rechte vorbehalten.")}</p>
              </Col>
              <Col className="footer-nav-extra" lg={5}>
                <Menu items={footer_menu} />
              </Col>
              <Col className="footer-to-top" lg={1}>
                <ScrollButton
                  target="#root"
                  duration="1000"
                  icon="icon-arrow-up"
                />
              </Col>
            </Row>
          </Container>
        </div>
      </footer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

// export default Footer
Footer = connect(mapStateToProps)(Footer)
export default translate()(Footer)
