import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import { LearningArticlesCreators as Creators} from "./redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import Button from "../../components/Button"
import CTA from "../../components/CTA"
import Sidebar from "../../components/Sidebar"
import Breadcrumbs from "../../components/Breadcrumbs"
import Loader from "../../components/Loader"
import Message from "../../components/Message"

import {formatReadingTime} from "../../utils"
import {dateToString} from "../../utils"
import { jsAccordion } from "../../utils"

import styles from "./styles.css"

class LearningArticles extends Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false,
      currentTagsTitle: "Eingruppierung wählen",
      currentTagsName: "",
      currentSortTitle: "Ordnungs",
      currentSortName: "order",
      currentOrderBy: "ASC",
      isMobile: false
    }

    // this._toggleSelect = this._toggleSelect.bind(this)
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    topic: PropTypes.object.isRequired,
    module: PropTypes.object.isRequired,
    posts: PropTypes.array.isRequired,
    sidebar: PropTypes.array.isRequired,
    tags: PropTypes.object.isRequired
  }

  static defaultProps = {
    topic: {},
    module: {},
    posts: [],
    sidebar: [],
    tags: {},
    fetching: false,
    error: null
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }
  componentDidUpdate() {
    this.initFilterNav()
  }

  updatePredicate() {
    this.setState({ isMobile: window.innerWidth < 768 });
  }

  initFilterNav() {
    jsAccordion(".tags-filter > .placeholder", ".tags-filter > .placeholder + div", "button");
    jsAccordion(".sort-filter .filter-wrap > .placeholder", ".sort-filter .filter-wrap > .placeholder + div", "button");
  }

  _handleTagsFetch(e) {
    const { t } = this.props
    this.setState({
      active: false,
    })
    if(e.target.value === '') {
      this.setState({
        currentTagsTitle: `${t("ALLE")}`,
        currentTagsName: ''
      })
    } else {
      this.setState({
        currentTagsTitle: e.target.innerHTML,
        currentTagsName: e.target.value
      })
    }
    this.props.moreArticles(this.props.slug, e.target.value, this.state.currentSortName, this.state.currentOrderBy)
  }

  _handleSortFetch(e) {
    this.setState({
      active: false,
    })
    this.setState({
      currentSortTitle: e.target.innerHTML,
      currentSortName: e.target.value
    })
    this.props.moreArticles(this.props.slug, this.state.currentTagsName, e.target.value, this.state.currentOrderBy)
  }

  _handleOrderFetch(e) {
    this.setState({
      active: false,
    })
    this.setState({
      currentOrderBy: e.target.value
    })
    this.props.moreArticles(this.props.slug, this.state.currentTagsName, this.state.currentSortName, e.target.value)
  }

  getTopicName() {
    return typeof this.props.topic.topic === "undefined" ? null : this.props.topic.topic.name
  }

  getTags() {
    const {tags} = this.props

    return Object.keys(tags).map((tag, index) => {
      return (
        <button
          className={`${tag}`}
          key={index}
          value={tag}
          onClick={e => this._handleTagsFetch(e)}
          >
          {tags[tag]}
        </button>
      )
    })
  }

  getArticles() {
    const {posts,t,lang} = this.props

    return posts.map((post, index) => {
      return (
        <Col md={6} className={`${styles.Post} item-${index}`} key={post.ID}>
          <div className="teaser">
            <div className="teaser-top">
              <p className="supheadline supheadline--desktop">{post.fields.tag}</p>
              <h4 className="headline headline--desktop">
                {post.post_title}
              </h4>
              <div className="meta-info info-top">
                {post.comment_count > 0 ?
                  (<p className="comments-count"><i className="icon-comments"></i><span>{post.comment_count}</span></p>)
                  : (null)}
              </div>
              <p className="description">{post.post_excerpt}</p>
            </div>
            <div className="teaser-bottom">
              <div className="meta-info info-bottom">
                <p className="date icon-clock">
                  <span>{dateToString(post.post_date, lang, ' | ')}</span>
                </p>
                <p className="time icon-clock">
                  <span>{formatReadingTime(post.fields.reading_time)}</span>
                </p>
              </div>
              <Button
                theme="cyan"
                size="small"
                to={`/${lang}/knowledge/article/${post.ID}`}
              >
                {t("Lesen")}
              </Button>
            </div>
          </div>
        </Col>
      )
    })
  }

  render() {
    const {topic, module, sidebar, error, fetching, t, lang} = this.props

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

    const breadcrump_items = [
      {
        title: `${t("Startseite")}`,
        href: `/${lang}/`
      },
      {
        title: topic.name,
        href: `/${lang}/learning/topic/${topic.term_id}`
      },
      {
        title: module.name,
        href: null
      }
    ]
    const sort_items = {
      reading_time: `${t("Lesezeit")}`,
      date: `${t("Veröffentlichungsdatum")}`,
      comment_count: `${t("Anzahl Kommentare")}`
    }
    const isMobile = this.state.isMobile;
    return (
      <div className={this.props.module.taxonomy}>
        <Loader active={fetching} />
        <div className="container-breadcrumbs">
          <Container>
            <Row className="row-fluid">
              <Breadcrumbs items={breadcrump_items} />
            </Row>
          </Container>
        </div>
        <div className={styles.Articles}>
          <div className="wp-content color-primary">
            <Container className="container-main">
              <Row className="row-fluid">
                <Col lg={9}>
                  <div className="text_column content_element">
                    <p className="subheadline">{t("Subhead einordung")}</p>
                    <h2 className="headline">{module.name}</h2>
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
                    <p className="description">{module.description}</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="inside">
            <Container className="container-main">
              <Row className="row-fluid">
                <h2>{this.getTopicName()}</h2>
                <div className="articles-list">
                  <Sidebar items={sidebar} currentPage={topic.name} type={"learning"} />
                  <Col lg={8}>
                    <Row className="row-fluid">
                      <Col className={styles.ArticleFilter}>
                        <Row className="row-fluid">
                          <div className="tags-filter">
                            {isMobile ? (
                              <span
                                className={`placeholder icon icon-next ${this.state.active ? "active" : ""}`}>{t("Filter/Anordnen")}
                              </span>
                                ) : (
                                <span
                                  className={`placeholder icon icon-next ${this.state.active ? "active" : ""}`}>{this.state.currentTagsTitle}
                                </span>
                              )}
                            <div className="filter">
                              <button value="" onClick={e => this._handleTagsFetch(e)}>{t("Alle Anzeigen")}</button>
                              {this.getTags()}
                            </div>
                          </div>
                          <div className="sort-filter">
                            <span className="title">{t("Sortieren nach")}</span>
                            <div className="filter-wrap">
                              {isMobile ? (
                                <span
                                  className={`placeholder icon icon-next ${this.state.active ? "active" : ""}`}>{t("Sortieren nach")}
                              </span>
                              ) : (
                                <span
                                    className={`placeholder icon icon-next ${this.state.active ? "active" : ""}`}>{this.state.currentSortTitle}
                                </span>
                              )}
                              <div className="filter">
                                <button value="order" onClick={e => this._handleSortFetch(e)}>{t("Ordnungs")}</button>
                                {Object.keys(sort_items).map((item, index) => {
                                  return (
                                    <button
                                      className={`${item}`}
                                      key={index}
                                      value={item}
                                      onClick={e => this._handleSortFetch(e)}
                                    >
                                      {sort_items[item]}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="order-filter">
                            <div className="filter">
                              <button className="asc icon icon-next" value="ASC" onClick={e => this._handleOrderFetch(e)}></button>
                              <button className="desc icon icon-next" value="DESC" onClick={e => this._handleOrderFetch(e)}></button>
                            </div>
                          </div>
                        </Row>
                      </Col>
                      {this.getArticles()}
                    </Row>
                  </Col>
                </div>
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
    ...state.learningarticles,
    slug: state.router.params.slug,
    lang: state.app.lang
  }
}

const mapDispatchToProps = dispatch => {
  return {
    moreArticles: (slug, tag, sortby, orderby) => dispatch(Creators.request(slug, tag, sortby, orderby))
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(LearningArticles)
LearningArticles = connect(mapStateToProps, mapDispatchToProps)(LearningArticles)
export default translate()(LearningArticles)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
