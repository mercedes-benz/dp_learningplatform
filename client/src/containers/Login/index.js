import React, {Component} from "react"
import {connect} from "react-redux"
import {push, replace} from "redux-little-router"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import LoginForm from "../../components/LoginForm"
import {LoginCreators as Creators} from "./redux"
import RemoteContent from "../../components/RemoteContent"
import Message from "../../components/Message"
import ScrollButton from "../../components/ScrollButton"

import styles from "./styles.css"
// import logo from "../../assets/icons/simplicity-logo-black.svg"
import logo from "../../assets/icons/logo.svg"
import simplicity_logo from "../../assets/icons/logo-simplicity.svg"
import protics_logo from "../../assets/icons/logo-protics.svg"

class Login extends Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(username, password) {
    const {lang, query} = this.props
    let target = `/${lang}/login`

    if(typeof query.referer !== "undefined") {
      target = `/${lang}/login?referer=${query.referer}`
    }

    this.props.replace(target)

    this.props.login(username, password)
  }

  gotoFrontpageOrReferer() {
    const {lang, query} = this.props
    let target = `/${lang}/login-successful`

    if(typeof query.referer !== "undefined") {
      if (query.referer === '/') {
        target = query.referer + "de/"
      } else {
        target = query.referer
      }
    }

    setTimeout(() => {
      this.props.push(target)
    }, 100)

    return null
  }

  render() {
    const {error, token, query, t} = this.props

    return (
      <div>
        <Container fluid className={`${styles.Login} container-small`}>
          {token === null &&
            <Row>
              <Col className={styles.Logo}>
                <img src={logo} alt="SIMPLICITY" />
              </Col>
            </Row>
          }
          <Row>
            <Col className={styles.Content}>
              {typeof query.revalidate !== "undefined" &&
                <Message warning>
                  <p>
                    <strong>{t("Ihre Sitzung ist abgelaufen.")}</strong><br />
                    {t("Bitte loggen Sie sich erneut ein.")}
                  </p>
                </Message>
              }
              {error &&
                <Message error>
                  <p>
                    <strong>{t("Es ist ein Fehler aufgetreten.")}</strong><br />
                    {error}
                  </p>
                </Message>
              }
              <Col xl={6} pushXl={3} lg={8} pushLg={2} size={12}>
                <RemoteContent className="content">
                  {this.props.post.post_content}
                </RemoteContent>
              </Col>
            </Col>
          </Row>
          <Row>
            {token === null &&
              <Col className={styles.Form}>
                <Col xl={6} pushXl={3} lg={8} pushLg={2} size={12}>
                  <LoginForm onSubmit={this.onSubmit} />
                </Col>
              </Col>
            }
            {token && this.gotoFrontpageOrReferer()}
          </Row>
        </Container>
        <div>
          {token === null &&
            <div className={styles.Footer}>
              <div className="footer-top">
                <Container>
                  <Row>
                    <Col className="footer-simplicity" md={3}>
                      <img src={simplicity_logo} alt="Simplicity" />
                      <p>{t("Einfach")} <strong>{t("LERNEN")}</strong> – {t("Einfach")} <strong>{t("FINDEN")}</strong></p>
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
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.login,
    query: state.router.query,
    lang: state.app.lang
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(Creators.request(username, password)),
    push: (location) => dispatch(push(location)),
    replace: (location) => dispatch(replace(location)),
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Login)
Login = connect(mapStateToProps, mapDispatchToProps)(Login)
export default translate()(Login)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
