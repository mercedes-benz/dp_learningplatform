import React, { Component } from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import { Container, Row, Col } from "../../Grid"

// import { Droppable } from '@shopify/draggable';
import { Droppable } from '@shopify/draggable/lib/es5/draggable.bundle.legacy.js';

class Assign extends Component {
  constructor() {
    super()

    this.state = {
      questions: [],
      answerState: null,
      attempt: 0,
      isFinished: false,
      activateCheckButton: false,
      isMobile: false
    }

    this.handleSelect = this.handleSelect.bind(this)

    this.containerQuestionsParent = React.createRef();
  }

  componentDidMount() {
    this.updatePredicate();
    this.shuffleQuestions()
    if (!this.state.isMobile) {
      this.initDroppable()
    }
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
        activateNext: false,
        answerState: null,
        attempt: 0,
        isFinished: false,
        activateCheckButton: false,
      })
    }
  }

  updatePredicate() {
    if (window.innerWidth < 1200) {
      this.setState({ isMobile: true });
    }
  }

  initDroppable() {
    let self = this
    const { questions } = this.props
    const currentQuestion = questions.questions[this.props.currentQuiz]
    setTimeout(function () {
      const containerQuestionsParent = self.containerQuestionsParent.current;
      let droppableItems = containerQuestionsParent.querySelectorAll('.BlockLayout')
      self.droppable = new Droppable(droppableItems, {
        draggable: '.Block--isDraggable',
        dropzone: '.BlockWrapper--isDropzone',
        mirror: {
          constrainDimensions: true,
        },
        delay: 50
      });

      let droppableOrigin;

      self.droppable.on('drag:start', (evt) => {
        let originalSource = evt.originalSource
        // droppableOriginParent = originalSource.parentNode;
        droppableOrigin = originalSource.dataset.dropzone;
        let dropzoneCell = originalSource.parentNode.parentNode.parentNode
        if (!dropzoneCell.classList.contains('variant')) {
          dropzoneCell.classList.remove("selected", "false", "true")
        }
      });

      self.droppable.on('droppable:stop', (evt) => {
        let dropzone = evt.dropzone
        let dropzoneCell = dropzone.parentNode.parentNode
        if (!dropzoneCell.classList.contains("variant-cell")) {
          dropzoneCell.classList.add("selected")
          if (droppableOrigin !== dropzone.dataset.dropzone) {
            dropzoneCell.classList.add("false")
          } else {
            dropzoneCell.classList.add("true")
          }
        }

        let amountOfSelectedItems = containerQuestionsParent.querySelectorAll('.selected')
        if (amountOfSelectedItems.length < currentQuestion.values.length) {
          self.setState({ activateCheckButton: false });
        } else {
          self.setState({ activateCheckButton: true });
        }
      });
    }, 500)
  }

  handleSelect(e) {
    const containerQuestionsParent = this.containerQuestionsParent.current;
    containerQuestionsParent.classList.add("active");

    let falseItems = Array.prototype.slice.call(containerQuestionsParent.querySelectorAll('.false'))

    if (falseItems.length > 0) {
      this.setState({
        answerState: "false",
        attempt: 1
      })
    } else {
      this.setState({
        answerState: "true"
      })
    }
    this.setState({
      isFinished: true,
      activateNext: true
    })
  }

  slideToggle(e) {
    e.stopPropagation()
    let target = e.target;
    let dropdown = target.nextElementSibling;
    if (target.classList.contains("is-active")) {
      target.classList.remove("is-active");
      dropdown.classList.remove("is-open");
      dropdown.style.height = "0px"
      dropdown.addEventListener('transitionend', () => {
        dropdown.classList.remove('active')
      }, { once: true })
    } else {
      target.classList.add("is-active")
      dropdown.classList.add('is-open')
      dropdown.style.height = dropdown.scrollHeight + 'px';
    }
    const outsideClickListener = event => {
      if (!target.contains(event.target)) {
        target.classList.remove("is-active")
        dropdown.classList.remove("is-open")
        dropdown.style.height = "0px"
        dropdown.addEventListener('transitionend', () => {
          dropdown.classList.remove('active')
        }, { once: true })
        removeClickListener()
      }
    }
    const removeClickListener = () => {
      document.removeEventListener('click', outsideClickListener)
    }
    document.addEventListener('click', outsideClickListener)
  }

  handleAccordionAnswers(e) {
    const { questions } = this.props
    const currentQuestion = questions.questions[this.props.currentQuiz]
    const containerQuestionsParent = this.containerQuestionsParent.current;
    let target = e.target;
    let targetIndex = target.dataset.index
    let targetParent = target.parentNode.parentNode
    let targetParentIndex = targetParent.dataset.index
    let allItems = Array.prototype.slice.call(containerQuestionsParent.querySelectorAll('li'))
    let allParentItems = Array.prototype.slice.call(targetParent.querySelectorAll('li'))
    let allActiveItems;

    let targetText = target.innerText
    let targetParentToggler = targetParent.querySelector('.toggler span')
    let targetParentTogglerText = "Bitte Recht zuordnen"

    targetParent.parentNode.classList.remove("false", "true", "is-selected")

    if (target.classList.contains("active")) {
      target.classList.remove("active")
      targetParentToggler.innerText = targetParentTogglerText
    } else {
      allParentItems.forEach(function (item) {
        item.classList.remove("active")
      })
      target.classList.add("active")
      if (targetIndex !== targetParentIndex) {
        targetParent.parentNode.classList.add("false", "is-selected")
      } else {
        targetParent.parentNode.classList.add("true", "is-selected")
      }
      targetParentToggler.innerText = targetText
    }

    allItems.forEach(function (item) {
      item.classList.remove("inactive")
    })
    allActiveItems = Array.prototype.slice.call(containerQuestionsParent.querySelectorAll('li.active'))
    allActiveItems.forEach(function (item) {
      let itemClass = item.className.replace(' active', '')
      Array.prototype.slice.call(containerQuestionsParent.querySelectorAll("li." + itemClass)).forEach(function (item) {
        if (!item.classList.contains("active")) {
          item.classList.add("inactive")
        }
      })
    })

    let amountOfSelectedItems = containerQuestionsParent.querySelectorAll('.is-selected')
    if (amountOfSelectedItems.length < currentQuestion.values.length) {
      this.setState({ activateCheckButton: false });
    } else {
      this.setState({ activateCheckButton: true });
    }
  }
  shuffle(arr) {
    var temp, j, i = arr.length;
    while (--i) {
      j = ~~(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  shuffleQuestions() {
    const { questions } = this.props
    const currentQuestion = questions.questions[this.props.currentQuiz]
    let currentQuestions = currentQuestion.values.map((val, index) => ({ index, val }))
    this.shuffle(currentQuestions)
    this.setState({
      questions: currentQuestions
    })
  }


  render() {
    const { questions, t } = this.props
    const currentQuestion = questions.questions[this.props.currentQuiz]
    const currentFail = this.props.fails + this.state.attempt
    const currentFailPercantage = Math.floor(((this.props.fails + this.state.attempt) * 100) / this.props.questionslength)
    if (this.state.questions.length === 0) {
      return null
    }
    return (
      <div className={`quiz-assign ${this.state.isFinished ? "is-active" : ""}`}>
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
              <p className="subtitle">{t("Fasse dazu die Antwortmöglichkeiten mit der Maus an und ziehe sie an die richtige Stelle.")}</p>
            </Col>
            <Col className={`question-values assign-values ${this.state.isFinished ? "isFinished" : ""}`}>
              {this.state.isMobile ?
              (
                <div className="questions-holder--mobile" ref={this.containerQuestionsParent}>
                    {currentQuestion.values.map((item, i) => {
                      return (
                        <div className="accordion-parent" key={i}>
                          <div className="questions-accordion" data-index={i}>
                            <div className="term">{item.term}</div>
                            <div className="toggler" onClick={(e) => this.slideToggle(e)}>
                              <span>{t("Bitte Recht zuordnen")}</span>
                              <i className="icon-arrow-down"></i>
                            </div>
                            <ul className="accordion">
                              {currentQuestion.values.map((item, index) => {
                                return (
                                  <li key={index} className={`item-${index}`} data-index={index} onClick={(e) => this.handleAccordionAnswers(e)}>
                                    <i className="icon-check-circle"></i>{item.assigned}
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) :
              (
                <div className="questions-holder" ref={this.containerQuestionsParent}>
                  <div className="answers-holder">
                    {currentQuestion.values.map((item, i) => {
                      return (
                        <div className="question-cell" key={i}>
                          <div className="question BlockLayout">
                            <div className="info">
                              <span>{item.term}</span>
                            </div>
                            <div className="answer BlockWrapper--isDropzone" data-dropzone={i}>
                              <span>{t("Ziehe den passenden Text hierher!")}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="variants-holder">
                    {this.state.questions.map((item, i) => {
                      return (
                        <div className="variant-cell" key={i}>
                          <div className="variant BlockLayout">
                            <div className="BlockWrapper BlockWrapper--isDropzone draggable-dropzone--occupied" data-dropzone={item.index}>
                              <span className="Block--isDraggable" data-dropzone={item.index}>{item.val.assigned}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Col>
            <Col lg={10} xl={8} className={`quiz-check ${this.state.isFinished ? "is-active" : ""}`}>
              <div className="button button--large button--purple">
                <button className={`${this.state.activateCheckButton ? "" : "inactive"}`} onClick={(e) => this.handleSelect(e)}>
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
                      <p className="title"><strong>{t("Die Zuordnung ist falsch!")}</strong></p>
                      <div className="text" dangerouslySetInnerHTML={{ __html: currentQuestion.incorrect_message }} />
                    </div>
                  ) :
                  (
                    <div className="hint-text">
                      <p className="title"><strong>{t("Die Zuordnung ist richtig!")}</strong></p>
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

Assign = connect(mapStateToProps)(Assign)
export default translate()(Assign)
