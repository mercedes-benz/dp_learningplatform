import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../Grid"

import Start from "./Start"
import Single from "./Single"
import Multiple from "./Multiple"
import TrueFalse from "./TrueFalse"
import Order from "./Order"
import Assign from "./Assign"
import Finish from "./Finish"

import styles from "./styles.css"

import api from "../../services/ApiService"

class Quiz extends Component {
  constructor() {
    super()

    this.handleNext = this.handleNext.bind(this)
    this.markAsDone = this.markAsDone.bind(this)
    this.restartQuiz = this.restartQuiz.bind(this)
    this.renderSteps = this.renderSteps.bind(this)

    this.state = {
      currentQuestion: "",
      fails: 0,
      currentQuiz: 0,
      doneSuccess: false,
      quizCompleted: false
    }
  }

  componentDidMount() {
    if(!this.props.fetching) {
      this.setState({
        currentQuestion: this.props.questions.questions[0].type
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.questions !== this.props.questions && !this.props.fetching) {
      this.setState({
        currentQuestion: this.props.questions.questions[0].type
      })
    }
  }

  renderQuiz(type) {
    const childProps = { ...this.props, handleNext: this.handleNext, fails: this.state.fails, currentQuiz: this.state.currentQuiz }
    const finishProps = { ...this.props, fails: this.state.fails, markAsDone: this.markAsDone, restartQuiz: this.restartQuiz, closeQuiz: this.props.closeQuiz }
    switch (type) {
      case "start": return <Start {...childProps} />;
      case "single_choice": return <Single {...childProps} />;
      case "multiple_choice": return <Multiple {...childProps} />;
      case "true_false": return <TrueFalse {...childProps} />;
      case "order": return <Order {...childProps} key={this.state.currentQuiz} />;
      case "assign": return <Assign {...childProps} key={this.state.currentQuiz} />;
      case "finish": return <Finish {...finishProps} />;
      default: return <Start {...childProps} />;
    }
  }

  handleNext(isFailed, fails) {
    if (fails) {
      this.setState({
        fails: fails
      })
    }
    if (isFailed) {
      this.setState({
        currentQuestion: "finish"
      })
    } else {
      if (this.state.currentQuiz + 1 !== this.props.questions.questions.length) {
        this.setState({
          currentQuiz: this.state.currentQuiz + 1,
          currentQuestion: this.props.questions.questions[this.state.currentQuiz + 1].type
        })
      } else {
        this.setState({
          currentQuestion: "finish"
        })
      }
    }
  }

  markAsDone(success) {
    this.setState({
      quizCompleted: true
    })
    if(success) {
      this.setState({
        doneSuccess: true
      })
      api.markLearningArticleAsRead(this.props.postID, this.props.lang)
    }
  }

  restartQuiz() {
    for (var i = 0; i < document.querySelectorAll(".quiz-steps li").length; i++) {
      document.querySelectorAll(".quiz-steps li")[i].classList.remove('active')
    }
    this.setState({
      currentQuiz: 0,
      currentQuestion: this.props.questions.questions[0].type,
      fails: 0
    })
  }

  renderSteps(item, key) {
    let index = key + 1
    return (
      <li key={key} className={item.type}>
        {index}
      </li>
    )
  }

  render() {
    const { modulename, quizname, questions, questionslength } = this.props
    const currentFailPercantage = Math.floor((this.state.fails * 100) / questionslength)
    let amountOfPossibleFails = Math.floor((questionslength * 100) / 33)

    amountOfPossibleFails = amountOfPossibleFails >= 18 ? Math.max(0, 1 + Number((amountOfPossibleFails + "").substring(0, 1)) - this.state.fails) : Math.max(0, 1 - this.state.fails)
    // if (amountOfPossibleFails >= 18) {
    //   let wrongAnswersLeft = 1 + Number((amountOfPossibleFails + "").substring(0, 1)) - this.state.fails
    //   console.log(Math.max(0, wrongAnswersLeft))
    //   amountOfPossibleFails = Math.max(0, wrongAnswersLeft) === 0 ? 0 : wrongAnswersLeft
    // } else {
    //   amountOfPossibleFails = this.state.fails === 0 ? 1 : 0
    // }

    return (
      <div className={styles.Quiz}>
        <div className="inner">
          <div className="header">
            <Container>
              <Row>
                <Col className="modal-title" md={1}>
                  <span className="modulename">{modulename}</span>
                  <i className="icon icon-next"></i>
                  <span className="quizname">{quizname}</span>
                  <span className="fails"><i className="icon-like-filled"></i>{amountOfPossibleFails}</span>
                </Col>
                <Col className="modal-close" md={1}>
                  <i onClick={()=>this.props.closeQuiz(false)} className="icon icon-quiz-fail-box"></i>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="quiz-content">
            <div className={`quiz-steps length-${questionslength}`}>
              <Container>
                <Row>
                  <ul>
                    {questions.questions.map(this.renderSteps)}
                    {!this.state.quizCompleted ?
                      (<li className="last"><i className="icon icon-quiz-1"></i></li>) :
                      (currentFailPercantage <= 30 ?
                        (<li className="last"><i className="icon icon-quiz-2"></i></li>) :
                        (<li className="last"><i className="icon icon-quiz-3"></i></li>)
                    )}
                  </ul>
                </Row>
              </Container>
            </div>
            {!this.props.fetching ? this.renderQuiz(this.state.currentQuestion) : null}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang,
    avatar: state.login.avatar
  }
}

Quiz = connect(mapStateToProps)(Quiz)
export default translate()(Quiz)
