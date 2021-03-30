import React, {Component} from "react"
import {push} from "redux-little-router"
import {connect} from "react-redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import RemoteContent from "../../components/RemoteContent"
import Button from "../../components/Button"

import styles from "./styles.css"

class LoginSuccessful extends Component {
  redirectToFrontpage() {
    setTimeout(() => {
      this.props.push("/de/")
    }, 3000)
  }

  render() {
    const {user_display_name, token, t} = this.props

    if (token === null) return null

    this.redirectToFrontpage()

    return (
      <Container>
        <Row>
          <Col className={styles.Content}>
            <RemoteContent className="content">
              {this.props.post.post_content}
            </RemoteContent>
          </Col>
        </Row>
        <Row>
          <Col>
            {
              token &&
              <Col className={styles.LoggedIn} xl={6} pushXl={3} lg={8} pushLg={2} size={12}>
                <div className="divider divider--purple"></div>
                <div className="welcome">
                  {t("Angemeldet als")} <strong>{user_display_name}</strong>.
                </div>
                <div className="button-wrapper">
                  <Button to="/" theme="purple">{t("Zur Startseite")}</Button>
                  <Button to="/logout">{t("Abmelden")}</Button>
                </div>
              </Col>
            }
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.loginsuccessful,
    user_display_name: state.login.user_display_name,
    token: state.login.token,
    lang: state.app.lang
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    push: (location) => dispatch(push(location)),
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(LoginSuccessful)
LoginSuccessful = connect(mapStateToProps, mapDispatchToProps)(LoginSuccessful)
export default translate()(LoginSuccessful)

export { reducer } from "./redux"
export { default as sagas } from "./sagas"
