import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import { Link } from "redux-little-router"
import { Col } from "../../../components/Grid"


class LearningProgress extends Component {

  renderModules() {
    const { modules, lang } = this.props

    if (modules === undefined) {
      return null
    }

    return modules.map((module, index) => {
      const learningProgress = ((module.read_articles > module.module_articles ? module.module_articles : module.read_articles) * 100) / module.module_articles
      return (
        <Col className="tile" key={module.term_id}>
          <ul>
            <li className="division">
              <span>{module.topic_name}</span>
            </li>
            <li className="title">
              <Link className="teaser-link"
                href={`/${lang}/learning/topic/${module.topic_id}`}
              >{module.name}</Link>
              <ul className={`progress ${Math.floor(learningProgress) === 0 ? 'closed' : Math.floor(learningProgress) === 100 ? 'done' : 'in-progress'}`}>
                <li>
                  <span>{Math.floor(learningProgress)}%</span>
                  <i style={{ width: learningProgress + "%" }}></i>
                </li>
              </ul>
            </li>
          </ul>
        </Col>
      )
    })
  }

  render() {
    const {t} = this.props

    return (
      <Col lg={8} className="learningprogress">
        <div className="card">
          <div className="intro-block">
            <h3 className="headline">{t("Mein Lernfortschritt")}</h3>
            <p>{t("Die folgenden Module werden von dir aktuell in der Akademie bearbeitet.")}</p>
          </div>
          <div className="tiles">
            {this.renderModules()}
          </div>
        </div>
      </Col>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

LearningProgress = connect(mapStateToProps)(LearningProgress)
export default translate()(LearningProgress)
