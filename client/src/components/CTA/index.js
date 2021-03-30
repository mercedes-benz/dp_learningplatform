import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../Grid"
import Button from "../Button"

import styles from "./styles.css"

class CTA extends Component {
  render() {
    const { t } = this.props
    return (
      <section className={styles.CTA}>
        <Container>
          <Row>
            <Col className="teaser">
              <h3 className="title">{t("Sprechen sie uns")}</h3>
              <ul>
                <li>
                  <Button theme="dark" icon="phone" href="tel:07111234567">
                    0711 123 456 7
                  </Button>
                </li>
                <li>
                  <Button
                    theme="dark"
                    icon="mail"
                    href="mailto:simplicity@daimler.com"
                  >
                    simplicity@daimler.com
                  </Button>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

// export default CTA
CTA = connect(mapStateToProps)(CTA)
export default translate()(CTA)
