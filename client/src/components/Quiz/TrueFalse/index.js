import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../Grid"

class TrueFalse extends Component {
  constructor() {
    super()

    this.state = {
      activateNext: false,
      selectedElement: '',
      answerState: null,
      attempt: 0,
      isFinished: false
    }

    this.handleCheck = this.handleCheck.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidMount() {
    // document.querySelector("." + this.props.questions.questions[this.props.currentQuiz].type).classList.add('active');
    let stepActive = document.querySelectorAll(".quiz-steps .active")
    if (document.querySelector(".quiz-steps li:first-child").classList.contains('active')) {
      stepActive[stepActive.length - 1].nextElementSibling.classList.add('active');
    } else {
      document.querySelector(".quiz-steps li:first-child").classList.add('active');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentQuiz !== prevProps.currentQuiz) {
      this.setState({
        selectedElement: '',
        answerState: null,
        attempt: 0,
        isFinished: false
      })
      for (var i = 0; i < document.querySelectorAll(".radio_container span").length; i++) {
        document.querySelectorAll(".radio_container span")[i].className  = "is-default"
      }
      document.querySelector('input[type="radio"]:checked').checked = false;
      let stepActive = document.querySelectorAll(".quiz-steps .active")
      if (document.querySelector(".quiz-steps li:first-child").classList.contains('active')) {
        stepActive[stepActive.length - 1].nextElementSibling.classList.add('active');
      } else {
        document.querySelector(".quiz-steps li:first-child").classList.add('active');
      }
    }
  }

  handleCheck(e) {
    this.setState({
      selectedElement: e.target.parentNode
    })
  }

  handleSelect(e) {
    let selectedElement = this.state.selectedElement
    if (selectedElement !== "") {
      let dataState = selectedElement.getAttribute('data-state')
      let dataCorrect = selectedElement.parentNode.getAttribute('data-correct')
      if (dataState === dataCorrect) {
        selectedElement.className = 'is-true'
        this.setState({
          answerState: "true"
        })
      } else {
        selectedElement.className = 'is-false'
        this.setState({
          answerState: "false",
          attempt: 1
        })
      }
      this.setState({
        isFinished: true
      })
    }
  }
  render() {
    const { questions, t } = this.props
    // const currentQuestion = questions.questions[0]
    const currentQuestion = questions.questions[this.props.currentQuiz]
    const currentFail = this.props.fails + this.state.attempt
    // const errorsArray = Array.from({ length: currentFail }, (v, i) => i)
    const currentFailPercantage = Math.floor(((this.props.fails + this.state.attempt) * 100) / this.props.questionslength)

    return (
      <div className={`quiz-truefalse ${this.state.isFinished ? "is-active" : ""}`}>
        <Container>
          <Row>
            <Col lg={8} xl={8} className="question-text">
              {this.props.currentQuiz === 0 ?
                (<p className="suptitle">{t("Los geht's mit der ersten Frage!")}</p>) :
                this.props.currentQuiz === this.props.questionslength - 1 ? (<p className="suptitle">{t("Und nun zur letzten Frage!")}</p>) :
                  (<p className="suptitle">{t("Und hier kommt die nächste Frage!")}</p>)
              }
              <div className="headline" dangerouslySetInnerHTML={{ __html: currentQuestion.title }} />
              {currentQuestion.image !== null ? (
                <div className="quiz-image">
                  <img src={currentQuestion.image} alt="img" />
                </div>
              ) : (null)}
              <p className="subtitle">{t("Wählen Sie die richtige Antwort.")}</p>
            </Col>
            <Col className={`question-values ${this.state.isFinished ? "isFinished" : ""}`}>
              <div className="widget widget-radio">
                <div className="fieldset radio_container" data-correct={currentQuestion.values.is_true}>
                  <span className="is-default" data-state="true">
                    <input type="radio" name="grp_1" className="radio" id="opt_true" value={currentQuestion.values.label_true} />
                    <label htmlFor="opt_true" onClick={!this.state.isFinished ? (e) => this.handleCheck(e) : null}>{currentQuestion.values.label_true}</label>
                  </span>
                  <span className="is-default" data-state="false">
                    <input type="radio" name="grp_1" className="radio" id="opt_false" value={currentQuestion.values.label_false} />
                    <label htmlFor="opt_false" onClick={!this.state.isFinished ? (e) => this.handleCheck(e) : null}>{currentQuestion.values.label_false}</label>
                  </span>
                </div>
              </div>
            </Col>
            <Col lg={10} xl={8} className={`quiz-check ${this.state.isFinished ? "is-active" : ""}`}>
              <div className="button button--large button--purple">
                <button onClick={(e) => this.handleSelect(e)}>
                  {t("Überprüfen")}
                  <i className="icon icon-arrow-right"></i>
                </button>
              </div>
            </Col>
            <Col lg={10} xl={8} className={`quiz-hint ${this.state.isFinished ? "is-active" : ""}`}>
              <div className="hint-holder">
                {this.state.answerState === "false" ?
                  (
                    <div className="hint-text">
                      <p className="title"><strong>{t("Die Antwort ist falsch!")}</strong></p>
                      <div className="text" dangerouslySetInnerHTML={{ __html: currentQuestion.incorrect_message }} />
                    </div>
                  ) :
                  (
                    <div className="hint-text">
                      <p className="title"><strong>{t("Die Antwort ist richtig!")}</strong></p>
                    </div>
                  )}
                {currentFailPercantage <= 33 ?
                  (
                    <div lg={10} xl={8} className="quiz-buttons">
                      <div className="button button--large button--purple">
                        <button className={`next ${this.state.isFinished ? "is-active" : ""}`} onClick={this.state.isFinished ? (e) => this.props.handleNext(false, currentFail) : null}>
                          {questions.questions.indexOf(currentQuestion) === questions.questions.length - 1 ?
                            (t("Zum Ergebnis")) : (t("Weiter zur nächsten Frage"))
                          }
                          <i className="icon icon-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  ) :
                  (
                    <div lg={10} xl={8} className="quiz-buttons">
                      <div className="button button--large button--purple">
                        <button onClick={this.state.isFinished ? (e) => this.props.handleNext(true, currentFail) : null}>
                          {t("Zum Ergebnis")}
                          <i className="icon icon-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
              </div>
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

TrueFalse = connect(mapStateToProps)(TrueFalse)
export default translate()(TrueFalse)
