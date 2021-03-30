import React, {PureComponent} from "react"
import {goBack} from "redux-little-router"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import Button from "../../components/Button"
import {Container, Row, Col} from "../../components/Grid"

import styles from "./styles.css"

class NotFound extends PureComponent {
  render() {
    const {t} = this.props
    return (
      <Container>
        <Row justifyContent="center">
          <Col className={styles.Content} alignItems="center">
            <h1>404</h1>
            <p>{t("Die angeforderte Seite wurde nicht gefunden.")}</p>
            <p><em>{this.props.pathname}</em></p>
            <Button 
              onClick={() => this.props.dispatch(goBack())}
              size="large"
              theme="purple"
              icon="none"
            >
              {t("Zurück")}
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pathname: state.router.pathname,
    lang: state.app.lang
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => dispatch(action)
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(NotFound)
NotFound = connect(mapStateToProps, mapDispatchToProps)(NotFound)
export default translate()(NotFound)