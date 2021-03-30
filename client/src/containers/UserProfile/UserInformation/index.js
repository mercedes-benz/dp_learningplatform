import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import { Col } from "../../../components/Grid"

import { log } from "../../../utils"
import api from "../../../services/ApiService"

import { dateToString } from "../../../utils"

class UserInformation extends Component {

  constructor() {
    super()

    this.state = {
      isError: null,
      errorMessage: ""
    }
  }

  async uploadAvatar(e) {
    e.preventDefault();
    let file = e.target.parentNode.querySelector('.file').files[0];
    let token = this.props.token
    try {
      const response = await api.postUserAvatar(file, token)
      if(response.status === "success") {
        this.setState({
          isError: false
        })
        this.props.replaceAvatar(response.avatar)
      }
    } catch (e) {
      this.setState({
        isError: true,
        errorMessage: e.message
      })
      log.dir(e)
    }
  }

  render() {
    const { user, avatar, lang, t} = this.props
    
    if (user === undefined) {
      return null
    }
    return (
      <Col lg={8} className="userinformation">
        <div className="card">
          <div className="intro-block">
            <h3 className="headline">{t("Benutzerinformationen")}</h3>
            <p>{t("Individualisiere dein Profil und lade ein persönliches Profilbild hoch.")}</p>
          </div>
          <div className="info-block">
            <Col size={6} md={2} lg={2} xl={2} className="user-avatar">
              <div className="inner">
                <span className={`error ${this.state.isError ? "active" : ""}`}>{this.state.errorMessage}</span>
                <img src={avatar} alt="avatar" />
                <i className="icon-edit"></i>
                <input className="file" type="file" name="fileToUpload" id="fileToUpload" onChange={e => this.uploadAvatar(e)} />
              </div>
            </Col>
            <Col size={6} md={5} lg={4} xl={5} className="user-info">
              <ul>
                <li><strong>{t("Benutzername")}:</strong></li>
                <li>{user.user_nicename}</li>
                <li><strong>{t("E-Mail Adresse")}:</strong></li>
                <li>{user.user_email}</li>
              </ul>
            </Col>
            <Col md={5} lg={6} xl={5} className="global-info">
              <ul>
                <li><strong>{t("Benutzerrolle")}:</strong></li>
                <li>{user.roles[0]}</li>
                <li><strong>{t("Registriert seit")}:</strong></li>
                <li>{dateToString(user.user_registered, lang, ' | ')}</li>
              </ul>
            </Col>
          </div>
        </div>
      </Col>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang,
    avatar: state.login.avatar,
    token: state.login.token
  }
}

UserInformation = connect(mapStateToProps)(UserInformation)
export default translate()(UserInformation)
