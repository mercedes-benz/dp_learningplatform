import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../Grid"
import Button from "../../Button"

import quiz_placeholder from "../../../assets/icons/quiz-placeholder.jpg"

class Start extends Component {

  render() {
    const { quizname, quizdescription, t} = this.props
    return (
      <div className="quiz-start">
        <Container>
          <Row>
            <Col lg={10} xl={8} className="intro-img"><img alt={quizname} src={quiz_placeholder} /></Col>
            <Col lg={10} xl={8} className="suptitle"><p>{quizname}</p></Col>
            <Col lg={10} xl={8} className="description">
              <div dangerouslySetInnerHTML={{ __html: quizdescription }} />
            </Col>
            <Col lg={10} xl={8} className="quiz-buttons">
              <Button theme="purple" onClick={(e)=>this.props.handleNext(false, 0)}>{t("Quiz starten")}</Button>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

Start = connect(mapStateToProps)(Start)
export default translate()(Start)
