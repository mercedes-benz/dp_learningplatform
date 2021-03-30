import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import { translate } from "react-i18next"

import {Container, Row} from "../../components/Grid"
import Loader from "../../components/Loader"
import RemoteContent from "../../components/RemoteContent"
import Message from "../../components/Message"

import styles from "./styles.css"

class Pages extends Component {
  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    post: PropTypes.object.isRequired
  }

  static defaultProps = {
    post: {},
    fetching: false,
    error: null
  }

  render() {
    const {post, fetching, error, t} = this.props
    if(error) {
      return (
        <Message error>
          <p>
            <strong>{t("Es ist ein Fehler aufgetreten.")}</strong><br />
            {error}
          </p>
        </Message>
      )
    }

    return (
      <div>
        <Loader active={fetching} />
        <Container>
          <Row>
            <RemoteContent className={styles.WPContent}>
              {post.post_content}
            </RemoteContent>
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.pages,
    lang: state.app.lang
  }
}

// export default connect(mapStateToProps)(Pages)
Pages = connect(mapStateToProps)(Pages)
export default translate()(Pages)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
