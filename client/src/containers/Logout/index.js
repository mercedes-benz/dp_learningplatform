import React, {PureComponent} from "react"
import {connect} from "react-redux"
import {push} from "redux-little-router"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import Button from "../../components/Button"
import ScrollButton from "../../components/ScrollButton"

import styles from "./styles.css"
// import logo from "../../assets/icons/simplicity-logo-color.svg"
import logo from "../../assets/icons/logo.svg"
import simplicity_logo from "../../assets/icons/logo-simplicity.svg"
import protics_logo from "../../assets/icons/logo-protics.svg"

class Logout extends PureComponent {
  componentDidMount() {
    setTimeout(() => {
      this.props.push("/login")
    }, 2000)
  }

  render() {
    const { t, lang } = this.props
    return (
      <div>
        <Container fluid className={styles.Logout}>
          <Row>
            <Col className={styles.Logo}>
              <img src={logo} alt="SIMPLICITY" />
            </Col>
          </Row>
          <Row>
            <Col className={styles.Content}>
              <h3>{t("Sie wurden erfolgreich ausgeloggt.")}</h3>
              <Button to={`/${lang}/login`} theme="purple">{t("Weiter")}</Button>
            </Col>
          </Row>
        </Container>
        <div className={styles.Footer}>
          <div className="footer-top">
            <Container>
              <Row>
                <Col className="footer-simplicity" md={3}>
                  <img src={simplicity_logo} alt="Simplicity" />
                  <p>Simplicity – Lernen und Wissen neu definiert!</p>
                </Col>
                <Col className="footer-protics" md={3}>
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
                <Col className="footer-copyright" md={5}>
                  <p>&copy; 2019 {t("Daimler Protics GmbH. Alle Rechte vorbehalten.")}</p>
                </Col>
                <Col className="footer-to-top" md={1}>
                  <ScrollButton
                    target="#root"
                    duration="1000"
                    icon="icon-arrow-up"
                  />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    push: (location) => dispatch(push(location))
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Logout)
Logout = connect(mapStateToProps, mapDispatchToProps)(Logout)
export default translate()(Logout)

export {default as sagas} from "./sagas"
