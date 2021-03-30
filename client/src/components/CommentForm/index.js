import React, {PureComponent} from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { translate } from "react-i18next"

import {vars} from "../../config"
import Button from "../Button"

import styles from "./styles.css"

// export default class CommentForm extends PureComponent {
class CommentForm extends PureComponent {
  static propTypes = {
    username: PropTypes.string,
    avatar: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    username: null,
    avatar: null,
    onSubmit: (message) => console.log(message),
  }

  state = {
    commentSent: false,
  }

  constructor(props) {
    super(props)

    this.wrapper = React.createRef()
    this.textarea = React.createRef()
    this.onSubmit = this.onSubmit.bind(this)
    this.resetForm = this.resetForm.bind(this)
  }

  resetForm() {
    this.textarea.value = ""

    this.setState((prevState) => {
      return {
        ...prevState,
        commentSent: false,
      }
    })
  }

  onSubmit() {
    const message = this.textarea.value

    this.setState((prevState) => {
      return {
        ...prevState,
        commentSent: 1,
      }
    })

    setTimeout(this.resetForm, vars.commentform.timeout)

    this.props.onSubmit(message)
  }

  render() {
    const {avatar, username, t} = this.props

    let overlayClasses = ["overlay"]

    if(this.state.commentSent) overlayClasses.push("active")

    return (
      <div className={styles.Wrapper} ref={this.wrapper}>
        <h2>{t("Kommentar verfassen")}</h2>
        <div className={styles.Meta}>
          <div className="avatar">
            {avatar && <img src={avatar} alt="Avatar" />}
          </div>
          <div className="username">
            <span>{t("Eingeloggt als:")}</span>
            <strong className="name">{username}</strong>
          </div>
        </div>
        <div className={styles.Textarea}>
          <div className={overlayClasses.join(" ")}>
            <p><strong>{t("Vielen Dank!")}</strong></p>
            <p>{t("Ihr Kommentar wurde gesendet.")}</p>
          </div>
          <textarea ref={(textarea) => this.textarea = textarea} cols={40} rows={5}></textarea>
        </div>
        <Button alignment="right" theme="dark" onClick={this.onSubmit}>{t("Absenden")}</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}
CommentForm = connect(mapStateToProps)(CommentForm)
export default translate()(CommentForm)