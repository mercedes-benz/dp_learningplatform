import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Link} from "redux-little-router"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import Button from "../../components/Button"
import Loader from "../../components/Loader"
import RemoteContent from "../../components/RemoteContent"
import Message from "../../components/Message"
import Quiz from "../../components/Quiz"

import api from "../../services/ApiService"

import { ManageBookmarksCreators as MBCreators } from "../ManageBookmarks/redux"
import { AppCreators } from "../App/redux"

import {formatReadingTime} from "../../utils"
import {dateToString} from "../../utils"
import {textTruncate} from "../../utils"
import {log} from "../../utils"
import { stickyNav } from "../../utils"
import { stickySidebar } from "../../utils"

import styles from "./styles.css"

import graphicAcademyMed from "../../assets/svg/graphic-academy-med.svg"

class LearningSingle extends Component {
  constructor() {
    super()

    this.state = {
      isLoaded: false
    }

    this.doPrint = this.doPrint.bind(this)
    this.closePrint = this.closePrint.bind(this)
    this.toggleQuiz = this.toggleQuiz.bind(this)
    this.handleImageLoad = this.handleImageLoad.bind(this)
    this.openQuiz = this.openQuiz.bind(this)
    this.closeQuiz = this.closeQuiz.bind(this)
  }

  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    post: PropTypes.object.isRequired,
  }

  static defaultProps = {
    post: {},
    fetching: false,
    error: null,
  }

  state = {
    isLoaded: false,
    markedAsRead: false,
    isPrinting: false,
    quizactive: false
  }

  _mounted = false;
  componentDidUpdate() {
    this._mounted = true;
    if (!this.props.error) {
      this.fixLastChild()
      this.initAnchorNav()
      this.handleImageLoad()

      if (!this.props.fetching || this.state.isLoaded) {
        stickySidebar(this.props.fetching, true)
        stickyNav(this.props.fetching)
        this.markAsRead()
      }
    }
  }

  componentWillUnmount () {
    this._mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only update component when fetching new props
    // not when component state changes
    if (this.state.isPrinting !== nextState.isPrinting) {
      return true
    }
    if (this.state.quizactive !== nextState.quizactive) {
      return true
    }
    if (this.props.fetching !== nextProps.fetching) {
      return true
    } else {
      return false
    }
  }

  handleImageLoad() {
    let self = this;
    if (!this.state.isLoaded) {
      var refreshInterval = setInterval(function () {
        let wpWrapper = document.querySelectorAll('.wp-content');
        if (wpWrapper.length > 0) {
          self.setState(prevState => {
            return {
              ...prevState,
              isLoaded: true
            }
          })
          clearInterval(refreshInterval);
        }
      }, 1000);
    }
  }

  initAnchorNav() {
    if(!this.props.fetching) {
      let anchorHeadline;
      let anchorNav;
      if (document.querySelector(".nav-anchor div") !== null) {
        anchorNav = document.querySelector(".nav-anchor div");
        anchorNav.innerHTML = "";
        anchorNav.parentNode.classList.remove('active');
        anchorHeadline = document.querySelectorAll(".wp-content h2");

        if (anchorHeadline.length > 0) {
          anchorNav.parentNode.classList.add('active');
          [].forEach.call(anchorHeadline, function (el, index) {
            el.setAttribute('id', 'anchor' + index);

            let navItem = document.createElement('a');
            navItem.innerHTML = '<span>' + el.innerHTML + '</span>';
            navItem.setAttribute('data-scroll', '');
            navItem.setAttribute('href', '#anchor' + index);
            anchorNav.appendChild(navItem);
          });
        } else {
          anchorNav.parentNode.parentNode.classList.add('hidden');
        }
      }
    }
  }

  async markAsRead() {
    // reset markedAsRead prop in state on each component update
    this.setState((prevState) => {
      return {
        ...prevState,
        markedAsRead: false,
      }
    })

    if (!this.props.fetching && (typeof this.props.post.fields.is_quiz === "undefined" || (typeof this.props.post.fields.is_quiz !== "undefined" && !this.props.post.fields.is_quiz))) {
      if (typeof this.props.post.ID !== "undefined" && !this.state.markedAsRead) {
        const self = this;
        const containerRequest = document.querySelectorAll('.container-request');
        let isScrolling
        let response

        let footer = document.querySelector('footer')
        let footerContainerOffset = footer.getBoundingClientRect().top;
        let windowHeight = window.innerHeight
        let trigger = footerContainerOffset < windowHeight

        if (trigger) {
          try {
            response = await api.markLearningArticleAsRead(self.props.post.ID, self.props.lang)
          } catch (e) {
            log.dir(e)
          }
          // set markedAsRead in component state to prevent
          // further api calls for same article
          self.setState((prevState) => {
            return {
              ...prevState,
              markedAsRead: true,
            }
          }, () => {
            if (response && response.status && response.status === 'success') {
              self.props.refreshTopics()
            }
          })
        }

        // check on scroll if near to end of article
        // if so, mark article as read
        window.addEventListener('scroll', async function () {
          if (typeof self.props.post.fields.is_quiz === "undefined" || (typeof self.props.post.fields.is_quiz !== "undefined" && !self.props.post.fields.is_quiz)) {
            if (self.state.markedAsRead) {
              return false
            }

            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(async function () {

              // Run the callback
              if (self._mounted && containerRequest.length > 0 && !self.state.markedAsRead) {
                footerContainerOffset = footer.getBoundingClientRect().top;
                trigger = footerContainerOffset < windowHeight
                if (trigger) {
                  try {
                    response = await api.markLearningArticleAsRead(self.props.post.ID, self.props.lang)
                  } catch (e) {
                    log.dir(e)
                  }

                  // set markedAsRead in component state to prevent
                  // further api calls for same article
                  self.setState((prevState) => {
                    return {
                      ...prevState,
                      markedAsRead: true,
                    }
                  }, () => {
                    if (response && response.status && response.status === 'success') {
                      self.props.refreshTopics()
                    }
                  })
                }
              }

            }, 100);
          }
        }, false);
      }
    }
  }

  fixLastChild() {
    document
      .querySelectorAll(".content_element .wrapper")
      .forEach(function(elem) {
        let types = Array.from(elem.children)
        if (types.length > 0) types[types.length - 1].className += " last"
      })
  }

  renderAllArticles(lang,item, key) {
    return (
      !item.fields.is_quiz ?
      (<li key={key}>
        <Link className={`${item.current_article ? "active" : ""}`} href={`/${lang}/learning/article/` + item.ID}>
          <i className="icon icon-arrow"></i>
          <span>{item.post_title}</span>
        </Link>
      </li>) :
      (null)
    )
  }

  getPostNav() {
    const {post,t,lang} = this.props
    const prev_post = post.prev_post
    const next_post = post.next_post
    const all_articles = post.all_articles
    if (typeof all_articles === "undefined") {
      return null
    }

    return (
      <div className="post--nav nav-black">
        <Container>
          <Row>
            <Col>
              <ul>
                <li className={prev_post ? "prev" : "prev --disabled"}>
                  {prev_post ?
                    (
                      <ul className="prev-post">
                        <li>
                          <span className="headline">{textTruncate(prev_post.post_title, true, 4, "...")}</span>
                          <span className="description">{textTruncate(prev_post.post_excerpt, true, 7, "...")}</span>
                        </li>
                      </ul>
                    )
                    : (null)}
                  <i className="icon-arrow-left" />
                  {prev_post ? (
                    <Link href={`/${lang}/learning/article/${prev_post.ID}`}>
                      {t("Vorheriger Artikel")}
                    </Link>
                  ) : (
                    `${t("Vorheriger Artikel")}`
                  )}
                </li>
                <li className="back">
                  <i></i>
                  <Link href={`/${lang}/learning/topic/${post.topic.term_id}`}>
                    <span>{t("Zur Modulübersicht")}</span>
                  </Link>
                  <div className="all-articles">
                    <ul>
                      {all_articles.map(this.renderAllArticles.bind(null, lang))}
                    </ul>
                  </div>
                </li>
                <li className={next_post ? "next" : "next --disabled"}>
                  {next_post ? (
                    <Link href={`/${lang}/learning/article/${next_post.ID}`}>
                      {t("Nächster Artikel")}
                    </Link>
                  ) : (
                    `${t("Nächster Artikel")}`
                  )}
                  <i className="icon-arrow-right" />
                  {next_post ?
                    (
                      <ul className="next-post">
                        <li>
                          <span className="headline">{textTruncate(next_post.post_title, true, 4, "...")}</span>
                          <span className="description">{textTruncate(next_post.post_excerpt, true, 7, "...")}</span>
                        </li>
                      </ul>
                    )
                    : (null)}
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  addLearningSingleBookmark(e) {
    e.preventDefault();
    this.props.addBookmark(this.props.post.ID, "learning")
  }

  removeLearningSingleBookmark(e) {
    e.preventDefault();
    this.props.removeBookmark(this.props.post.ID, this.props.lang, "learning")
  }

  getPostIntro() {
    const { post, lang, t } = this.props

    return (
      <div className="post--intro">
        <div className="intro--text">
          <Container>
            <Row justifyContent={'between'}>
              <Col className="block-text">
                <h2 className="headline">{t("Einleitung")}</h2>
                <p>{post.post_excerpt}</p>
                <div className="info">
                  <p className="timestamp has-icon"><i className="icon icon-calender"></i><span className="title">{t("Veröffentlichung")}:&nbsp;</span><span>{dateToString(post.post_date, lang, ' | ')}</span><span className="title"> | {t("Letzte Aktualisierung")}:&nbsp;</span><span className="updated">{dateToString(post.post_modified, lang, ' | ')}</span></p>
                  <p className="time has-icon"><i className="icon icon-clock"></i><span>{formatReadingTime(post.fields.reading_time)}</span></p>
                  <p className="action-likes has-icon">
                    <a>
                      <i className="icon icon-heart" />
                      <span className="count">3</span>
                    </a>
                  </p>
                  <p className="action-comments has-icon">
                    <a data-scroll href="#commentForm">
                      <span className="icon-block">
                        <i className="icon icon-comment-blank" />
                        {post.comment_count > 0 ?
                          (<span className="count">{post.comment_count}</span>)
                          : (<span className="count">0</span>)}
                      </span>
                      <span className="title">{t("Kommentare")}</span>
                    </a>
                  </p>
                  <p className="action-print has-icon">
                    <a onClick={this.doPrint}>
                      <span className="icon-block">
                        <i className="icon icon-print" />
                      </span>
                      <span className="title">{t("Artikel drucken")}</span>
                    </a>
                  </p>
                  <p className="action-bookmark has-icon">
                    <a onClick={(e) => { post.is_bookmarked ? this.removeLearningSingleBookmark(e) : this.addLearningSingleBookmark(e) }}>
                      <span className="icon-block">
                        <i className="icon icon-list" />
                        {post.is_bookmarked ?
                          (<span className="remove">&times;</span>)
                          : (<span className="add">+</span>)}
                      </span>
                      <span className="title">{t("Lesezeichen-Artikel")}</span>
                    </a>
                  </p>
                </div>
                <div className="buttons">
                  <div className="tags">
                    <div className="button  button--cyan button--small button--inline button--none">
                      <a>
                        {t("Tag#1")}<i className="button__icon icon--none" />
                      </a>
                    </div>
                    <div className="button  button--cyan button--small button--inline button--none">
                      <a>
                        {t("Tag#2")}<i className="button__icon icon--none" />
                      </a>
                    </div>
                    <div className="button  button--cyan button--small button--inline button--none">
                      <a>
                        {t("Tag#3")}<i className="button__icon icon--none" />
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }

  getLinkedArticles() {
    const {post,t,lang} = this.props
    const linked_learning_articles = post.fields.linked_learning_articles

    return linked_learning_articles.map(article => {
      return (
        <Col className={styles.Related} lg={8} key={article.ID}>
          <div className="teaser">
            <Link className="teaser-link"
              href={`/${lang}/learning/article/${article.ID}`}
            ></Link>
            <div className="teaser-top">
              <p className="supheadline supheadline--desktop">{post.fields.tag}</p>
              <h3 className="headline">
                {article.post_title}
              </h3>
              <p>{article.post_excerpt}</p>
            </div>
            <div className="teaser-bottom">
              <div className="meta-info">
                <p className="time icon icon-clock">
                  <span>{formatReadingTime(post.fields.reading_time)}</span>
                </p>
              </div>
              <Button
                theme="purple"
                to={`/${lang}/learning/article/${article.ID}`}
              >
                {t("Lesen")}
              </Button>
            </div>
          </div>
        </Col>
      )
    })
  }

  closePrint() {
    this.setState(prevState => {
      return {
        ...prevState,
        isPrinting: false
      }
    })
  }
  doPrint() {
    this.setState(prevState => {
      return {
        ...prevState,
        isPrinting: true
      }
    }, () => {
      this.forceUpdate();
      setTimeout(function () {
        window.print(); return false
      }, 1000)
    })
    let self = this;
    setTimeout(function () {
      self.setState(prevState => {
        return {
          ...prevState,
          isPrinting: false
        }
      })
    }, 5000);
  }

  toggleQuiz() {
    this.setState(prevState => {
      return {
        ...prevState,
        quizactive: !prevState.quizactive
      }
    })
    if (document.querySelector('body').classList.contains('overflow')) {
      document.querySelector('body').className = '';
    } else {
      document.querySelector('body').className = 'overflow';
    }
  }

  openQuiz(e, fetch = false) {
    // if (fetch) {
    //   let quizslug = e.target.getAttribute('data-slug')
    //   this.props.loadQuiz(quizslug)
    // }
    this.setState(prevState => {
      return {
        ...prevState,
        quizactive: !prevState.quizactive
      }
    })
    if (document.querySelector('body').classList.contains('overflow')) {
      document.querySelector('body').className = '';
    } else {
      document.querySelector('body').className = 'overflow';
    }
  }
  closeQuiz(success) {
    this.setState(prevState => {
      return {
        ...prevState,
        quizactive: !prevState.quizactive
      }
    })
    if (success) {
      document.location.reload();
    }
    document.querySelector('body').className = '';
  }

  render() {
    const {post, fetching, error, lang, t} = this.props
    const module = post.module
    const topic = post.topic

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

    if (typeof topic === "undefined" || typeof module === "undefined") {
      return null
    }

    return (
      <div className={styles.Post}>
        <Loader active={fetching} />
        <div className={`${styles.IntroBlock} intro-block`}>
          <Container>
            <Row className="row-fluid">
              <Col md={10} className="col-left">
                <div className="wp-content">
                  <Row className="row-fluid">
                    <Col>
                      <div className="text_column">
                        <h1 className="headline">{post.post_title}</h1>
                        <p className="description no-margin">{post.post_excerpt}</p>
                        <p className="tags">{post.fields.tag}</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={2} className="col-right">
                <div className="image-holder">
                  <img src={graphicAcademyMed} alt="Academy" />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Col className={`modal-print ${this.state.isPrinting ? "is-active" : ""}`}>
          <button onClick={this.closePrint}>Close</button><div>{t("Druckfunktion wird geladen...")}</div>
        </Col>
        {!this.state.isPrinting ?
          (
            <div className="inside">
              {this.getPostNav()}
              <div className={styles.InfoBar}>
                <Container>
                  <Row className="row-fluid">
                    <div className="info">
                      <p className="timestamp has-icon"><i className="icon icon-calender"></i><span className="title"> | {t("Letzte Aktualisierung")}:&nbsp;</span><span className="updated">{dateToString(post.post_modified, lang, ' | ')}</span></p>
                      <p className="time has-icon"><i className="icon icon-clock"></i><span>{formatReadingTime(post.fields.reading_time)}</span></p>
                      <p className="action-bookmark has-icon">
                        <a onClick={(e) => { post.is_bookmarked ? this.removeLearningSingleBookmark(e) : this.addLearningSingleBookmark(e) }}>
                          <span className="icon-block">
                            <i className="icon icon-list" />
                            {post.is_bookmarked ?
                              (<span className="remove">&times;</span>)
                              : (<span className="add">+</span>)}
                          </span>
                          {post.is_bookmarked ?
                            (<span className="title">{t("Lesezeichen entfernen")}</span>)
                            : (<span className="title">{t("Lesezeichen setzen")}</span>)}
                        </a>
                      </p>
                      <p className="action-print has-icon">
                        <a onClick={this.doPrint}>
                          <span className="icon-block">
                            <i className="icon icon-print" />
                          </span>
                          <span className="title">{t("Artikel drucken")}</span>
                        </a>
                      </p>
                    </div>
                  </Row>
                </Container>
              </div>
              <Container className="container-main container-request fix-ie">
                <Row justifyContent={'between'}>
                  <Col lg={8}>
                    <div className="post-articles">
                      <RemoteContent>
                        {post.post_content}
                      </RemoteContent>
                      {typeof post.fields.is_quiz !== "undefined" && post.fields.is_quiz ?
                        (
                          <div data-slug={post.post_name} className="button-holder" onClick={this.openQuiz}>
                            <div className="button  button--purple button--small button--inline button--none no-events">
                              <a className="no-events">
                                <span className="no-events">{t("Jetzt Quiz starten!")}</span><i className="button__icon icon--default no-events" />
                              </a>
                            </div>
                          </div>
                        ) : (null)}
                    </div>
                  </Col>
                  {typeof post.fields.is_quiz !== "undefined" && post.fields.is_quiz ?
                    (null) : (
                      <Col lg={4} className="sidebar sidebar-anchors">
                        <nav className="nav-anchor learning">
                          <p className="title icon">{t("Inhalt")}</p>
                          <div></div>
                        </nav>
                      </Col>
                    )}
                </Row>
              </Container>
              <Container className="container-extra">
                <div className="newest-related">
                  <Row>
                    {post.fields.linked_learning_articles.length > 0 && (
                      <Col lg={8}>
                        <h2>{t("Weiterführende Artikel")}</h2>
                      </Col>
                    )}
                    {this.getLinkedArticles()}
                  </Row>
                </div>
              </Container>
              {typeof post.fields.is_quiz !== "undefined" && post.fields.is_quiz ?
                (
                <div className={`quiz-modal ${this.state.quizactive ? "active" : ""}`}>
                  <Quiz fetching={fetching} postID={this.props.post.ID} topicslug={post.topic.slug} questions={post.quiz} modulename={post.module.name} quizname={post.post_title} quizdescription={post.quiz.description} closeQuiz={this.closeQuiz} questionslength={post.quiz.questions.length} />
                </div>
                ) : (null)}
            </div>
          ) :
          (
            <table className="print-table">
              <thead><tr><td>
                <div className="header-space">&nbsp;</div>
              </td></tr></thead>
              <tbody><tr><td>
                <div className="inside">
                  <Container className="container-main container-request fix-ie">
                    <Row justifyContent={'between'}>
                      <Col lg={8}>
                        <div className="post-articles">
                          <RemoteContent>
                            {post.post_content}
                          </RemoteContent>
                        </div>
                      </Col>
                      <Col lg={4} className="sidebar sidebar-anchors">
                        <nav className="nav-anchor learning">
                          <p className="title icon">{t("Inhalt")}</p>
                          <div></div>
                        </nav>
                      </Col>
                    </Row>
                  </Container>
                  <Container className="container-extra">
                    <div className="newest-related">
                      <Row>
                        {post.fields.linked_learning_articles.length > 0 && (
                          <Col lg={8}>
                            <h2>{t("Weiterführende Artikel")}</h2>
                          </Col>
                        )}
                        {this.getLinkedArticles()}
                      </Row>
                    </div>
                  </Container>
                </div>
              </td></tr></tbody>
            <tfoot><tr><td>
              <div className="footer-space">&nbsp;</div>
            </td></tr></tfoot>
          </table>
          )
        }
        <div className="page-footer">
          <Container>
            <Row className="d-print-block">
              <Col><p>{post.post_title}</p></Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.learningsingle,
    slug: state.router.params.slug,
    lang: state.app.lang
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addBookmark: (id, container) => dispatch(MBCreators.addBookmark(id, container)),
    removeBookmark: (id, lang, container) => dispatch(MBCreators.removeBookmark(id, lang, container)),
    refreshTopics: () => dispatch(AppCreators.refreshTopicsRequest()),
  }
}

LearningSingle = connect(mapStateToProps, mapDispatchToProps)(LearningSingle)
export default translate()(LearningSingle)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
