import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../Grid"
import Button from "../../Button"

class Finish extends Component {

  componentDidMount() {
    const failsPercantage = Math.floor( (this.props.fails * 100) / this.props.questionslength )
    if (failsPercantage < 33) {
      this.props.markAsDone(true)
    } else {
      this.props.markAsDone()
    }
    document.querySelector(".quiz-steps li.last").classList.add('active');
  }
  

  renderFailLinks(item, key) {
    return (
      <li key={key}>
        <i className="icon icon-arrow-right"></i>
        <a href={item.link}>{item.link_text}</a>
      </li>
    )
  }

  render() {
    const { questions, fails, t } = this.props
    const failsPercantage = Math.floor((fails * 100) / this.props.questionslength)

    return (
      <div className="quiz-finish">
        {failsPercantage >= 33 ? (
          <Container>
            <Row>
              <Col lg={8} xl={8} className="question-text">
                <p className="suptitle">{t("Du hast leider 3 Fragen nicht komplett richtig beantwortet.")}</p>
                <div className="headline" dangerouslySetInnerHTML={{ __html: questions.complete_fail }} />
              </Col>
              {questions.complete_fail_links ? 
                (
                  <Col lg={8} xl={8} className="quiz-fail-links">
                    <div className="inside">
                      <p className="title">{t("Diese Artikel solltest du dir nochmal anschauen!")}</p>
                      <ul>
                        {questions.complete_fail_links.map(this.renderFailLinks)}
                      </ul>
                    </div>
                  </Col>
                ) : 
                (null)
              }
              <Col lg={10} xl={8} className="quiz-buttons last">
                <Button
                  onClick={()=>this.props.closeQuiz(false)}
                  theme="purple"
                  to={`#`}
                >
                  {t("Quiz schließen")}
                </Button>
              </Col>
            </Row>
          </Container>) : (
          <Container>
            <Row>
              <Col lg={8} xl={6} className="question-text">
                <p className="suptitle">{t("Du hast")} {this.props.questionslength - fails} {t("von")} {this.props.questionslength} {t("Fragen richtig gelöst!")}</p>
                <div className="headline" dangerouslySetInnerHTML={{ __html: questions.complete_success }} />
              </Col>
              <Col lg={10} xl={8} className="quiz-buttons last">
                <Button
                  onClick={()=>this.props.closeQuiz(true)}
                  theme="purple"
                  to={`#`}
                >
                    {t("Quiz schließen")}
                </Button>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

Finish = connect(mapStateToProps)(Finish)
export default translate()(Finish)
