import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import { translate } from "react-i18next"

import {vars} from "../../config"
import {CommentsCreators as Creators} from "./redux"
import {Container, Row, Col} from "../../components/Grid"
import CommentForm from "../../components/CommentForm"
import Button from "../../components/Button"
import Message from "../../components/Message"

import {dateToString} from "../../utils"

import styles from "./styles.css"

class Comments extends Component {
  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    comments: PropTypes.array,
    total_comments: PropTypes.number,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
 }

  static defaultProps = {
    error: null,
    fetching: false,
    comments: [],
    total_comments: 0,
    className: "",
    title: null,
  }

  constructor(props) {
    super(props)

    this.commentform = null

    this.moreComments = this.moreComments.bind(this)
    this.addComment = this.addComment.bind(this)
    this.jumpToForm = this.jumpToForm.bind(this)
  }

  addComment(message) {
    const {add, id} = this.props

    add(id, message)
  }

  moreComments() {
    const {request, id, comments} = this.props

    request(id, vars.comments.per_page, comments.length)
  }

  padDate(i) {
    return ("00" + i).slice(-2)
  }

  getMonthName(m) {
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

    return months[m]
  }

  getDate(d) {
    const date = new Date(d.replace(' ', 'T'))
    const day = date.getDate(),
          month = this.getMonthName(date.getMonth()),
          year = date.getFullYear(),
          hours = this.padDate(date.getHours()),
          minutes = this.padDate(date.getMinutes())

    return `${day}. ${month} ${year} um ${hours}:${minutes} Uhr`
  }

  jumpToForm() {
    this.commentform.wrapper.current.scrollIntoView({behavior: "smooth"})
  }

  render() {
    const {fetching, error, comments, total_comments, className, avatar, user_display_name, title, t, lang} = this.props
    let deletedUser = lang === 'de' ? "gelöschter Benutzer" : "deleted user";
    let classList = [styles.Wrapper]

    if(className !== "") classList.push(className)
    if(fetching) classList.push("is-loading")
    if(error) classList.push("has-error")

    return (
      <div className={classList.join(" ")}>
        <Container>
          <Row>
            <Col>
              <h2 className="headline">{t("Kommentare")}</h2>
            </Col>
            <Col>
              <p className="info">
                {total_comments === 1 && `${total_comments} ${t("Kommentar")}`}
                {(total_comments === 0 || total_comments > 1) && `${total_comments} ${t("Kommentare")}`}
                {title && ` zu “${title}“`}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              {comments.length === 0 && (
                <div className="no-comment">
                  {t("Keine Kommentare vorhanden")}
                </div>
              )}
              {comments.map((comment, index) => {
                return (
                  <div className={styles.Comment} key={`comment-${index}`}>
                    <div className={styles.Meta}>
                      <div className="avatar">
                        <img src={comment.user_avatar} alt={`${t("Avatar von")} ${comment.comment_author}`} />
                      </div>
                      <div className="username">
                        <strong>
                          {comment.comment_author === null ?
                            (deletedUser) :
                            (comment.comment_author)
                          }
                        </strong>
                        <p className="date has-icon"><i className="icon icon-calender"></i><span>{dateToString(comment.comment_date, lang, '|')}</span></p>
                      </div>
                    </div>
                    <div className={styles.Message} dangerouslySetInnerHTML={{__html: comment.comment_content}} />
                  </div>
                )
              })}
            </Col>
          </Row>
          {comments.length < total_comments && (
            <Row>
              <Col>
                <Button alignment="center" onClick={this.moreComments}>"{t("Neue Kommentare laden")}"</Button>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              {error && (
                <Message error>
                  <p>
                    <strong>{t("Es ist ein Fehler aufgetreten.")}</strong><br />
                    {error}
                  </p>
                </Message>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <CommentForm
                ref={(commentform) => this.commentform = commentform}
                avatar={avatar}
                username={user_display_name}
                onSubmit={this.addComment}
              />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.comments,
    avatar: state.login.avatar,
    user_display_name: state.login.user_display_name,
    lang: state.app.lang
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    request: (id, comments_per_page, offset) => dispatch(Creators.request(id, comments_per_page, offset, true)),
    add: (id, message) => dispatch(Creators.add(id, message)),
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Comments)
Comments = connect(mapStateToProps, mapDispatchToProps)(Comments)
export default translate()(Comments)

export {reducer} from "./redux"
export {default as sagas, add as addCommentSaga} from "./sagas"
