import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import { Container, Row, Col } from "../../components/Grid"
import Button from "../../components/Button"
import CTA from "../../components/CTA"
import Sidebar from "../../components/Sidebar"
import Breadcrumbs from "../../components/Breadcrumbs"
import Loader from "../../components/Loader"
import Message from "../../components/Message"

import styles from "./styles.css"

class KnowledgeSubcategories extends Component {
  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    category: PropTypes.object.isRequired,
    subcategories: PropTypes.array.isRequired,
    post: PropTypes.object.isRequired,
    sidebar: PropTypes.array.isRequired
  }

  static defaultProps = {
    category: {},
    subcategories: [],
    post: {},
    sidebar: [],
    fetching: false,
    error: null
  }

  getContent() {
    const { post } = this.props

    return (
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: post.post_content }}
      />
    )
  }

  getCategoryName() {
    return typeof this.props.category === "undefined" ? null : this.props.category.name
  }

  getSubcategories() {
    const { subcategories,t,lang } = this.props

    return subcategories.map(subcategory => {
      return (
        <div className={styles.Subcategory} key={subcategory.term_id}>
          <div className="teaser">
            <div className="col-text">
              <h3 className="headline">
                {subcategory.name}
              </h3>
              <p className="description">{subcategory.description}</p>
              <Button theme="cyan" to={`/${lang}/knowledge/articles/${subcategory.term_id}`}>
                {t("Zum Artikel")}
              </Button>
            </div>
            {subcategory.fields.image ? (
              <div className="col-image"
                style={{ backgroundImage: `url(${subcategory.fields.image})` }}
              >
                <img src={subcategory.fields.image} alt={subcategory.name} />
              </div >
            ) : null}
          </div>
        </div>
      )
    })
  }

  render() {
    const { sidebar, error, t, lang } = this.props

    if (typeof this.props.category === "undefined") {
      return null
    }

    if (error) {
      return (
        <Message error>
          <p>
            <strong>{t("Es ist ein Fehler aufgetreten.")}</strong><br />
            {error}
          </p>
        </Message>
      )
    }

    const breadcrump_items = [
      {
        title: `${t("Startseite")}`,
        href: `/${lang}/`
      },
      {
        title: `${t("Wissen")}`,
        href: `/${lang}/knowledge/categorys`
      },
      {
        title: this.props.category.name,
        href: null
      }
    ]

    return (
      <div>
        <Loader active={this.props.fetching} />
        <div className="container-breadcrumbs">
          <Container>
            <Row className="row-fluid">
              <Breadcrumbs items={breadcrump_items} />
            </Row>
          </Container>
        </div>
        <div className={styles.Subcategories}>
          {/* {this.getContent()} */}
          <div className="wp-content color-primary">
            <Container className="container-main">
              <Row className="row-fluid">
                <Col lg={9}>
                  <div className="text_column content_element">
                    <p className="subheadline">{t("Subhead einordung")}</p>
                    <h2 className="headline">{this.props.category.name}</h2>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="wp-content color-primary-ext">
            <Container className="container-main">
              <Row className="row-fluid">
                <Col lg={9}>
                  <div className="text_column content_element">
                    <p className="description">{this.props.category.description}</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="inside">
            <Container className="subcategories-list">
              <Row className="row-fluid">
                <h3 className="headline">{this.getCategoryName()}</h3>
                <Sidebar items={sidebar} theme={"cyan"} />
                <Col lg={8}>{this.getSubcategories()}</Col>
              </Row>
            </Container>
          </div>
          <CTA />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.knowledgesubcategories,
    lang: state.app.lang
  }
}

// export default connect(mapStateToProps)(KnowledgeSubcategories)
KnowledgeSubcategories = connect(mapStateToProps)(KnowledgeSubcategories)
export default translate()(KnowledgeSubcategories)

export { reducer } from "./redux"
export { default as sagas } from "./sagas"
