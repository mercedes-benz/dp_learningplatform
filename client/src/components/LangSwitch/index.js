import React, {Component} from "react"
import {connect} from "react-redux"
import { translate } from "react-i18next"
import {push} from "redux-little-router"

import PropTypes from "prop-types"

import {Col} from "../Grid"
import Button from "../../components/Button"
import { Link } from "redux-little-router"

import styles from "./styles.css"

import flag_de from "../../assets/icons/flag_de.svg"
import flag_en from "../../assets/icons/flag_en.svg"
// import flag_fr from "../../assets/icons/flag_fr.svg"

class LangSwitch extends Component {

  constructor() {
    super()
    this._toggleLangModal = this._toggleLangModal.bind(this)
    this.langModal = React.createRef();

    this.state = {
      active: false
    }
  }

  static propTypes = {
    // slug: PropTypes.string,
    langurl: PropTypes.string
  }

  static defaultProps = {
    // slug: "",
    langurl: ""
  }

  _toggleLangModal() {
    this.setState(prevState => {
      return {
        ...prevState,
        active: !prevState.active
      }
    })
  }

  render() {
    const { langurl} = this.props

    if (langurl.substr(langurl.length - 4) === "null") {
      return (
        <Col className={`${styles.Langswitch} lang-switch`} md={3}>
          <ul>
            {this.props.lang === "de" ?
              (
                <li className="de">
                  <img src={flag_de} alt="de" /><span>Deutsch</span>
                  <div className="inner">
                    <ul>
                      <li className="en"><img src={flag_en} alt="en" /><a href={langurl}>English</a></li>
                    </ul>
                  </div>
                </li>
              ) :
              (
                <li className="en">
                  <img src={flag_en} alt="en" /><span>English</span>
                  <div className="inner">
                    <ul>
                      <li className="de"><img src={flag_de} alt="de" /><a href={langurl}>Deutsch</a></li>
                    </ul>
                  </div>
                </li>
              )
            }
          </ul>
          <div className={`lang-modal ${this.state.active ? "is-active" : ""}`} ref={this.langModal}>
            <div className="inner">
              <p>Unfortunately, this page has not been translated yet.</p>
              <div className="buttons">
                <div className="button  button--dark button--medium button--inline button--default">
                  <Link onClick={this._toggleLangModal} href="/en/">
                    To start page
                    <i className="button__icon icon--default"></i>
                  </Link>
                </div>
                <Button onClick={this._toggleLangModal} theme="dark">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Col>
      )
    } else {
      return (
        <Col className={`${styles.Langswitch} lang-switch`} md={3}>
          <ul>
            {this.props.lang === "de" ?
              (
                <li className="de">
                  <img src={flag_de} alt="de" /><span>Deutsch</span>
                  <div className="inner">
                    <ul>
                      <li className="en"><img src={flag_en} alt="en" /><a href={langurl}>English</a></li>
                    </ul>
                  </div>
                </li>
              ) :
              (
                <li className="en">
                  <img src={flag_en} alt="en" /><span>English</span>
                  <div className="inner">
                    <ul>
                      <li className="de"><img src={flag_de} alt="de" /><a href={langurl}>Deutsch</a></li>
                    </ul>
                  </div>
                </li>
              )
            }
          </ul>
        </Col>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    lang: state.app.lang,
    langurl: state.langswitch.langurl.langurl
  }
}

const mapDispatchToProps = dispatch => {
  return {
    push: location => dispatch(push(location))
  }
}

LangSwitch = connect(mapStateToProps, mapDispatchToProps)(LangSwitch)
export default translate()(LangSwitch)
