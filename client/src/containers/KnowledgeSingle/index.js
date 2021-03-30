import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Link} from "redux-little-router"
import { translate } from "react-i18next"

// import { KnowledgeSingleCreators as Creators } from "./redux"
import { ManageBookmarksCreators as MBCreators } from "../ManageBookmarks/redux"
import { ManageLikesCreators as MLCreators } from "../ManageLikes/redux"

import {Container, Row, Col} from "../../components/Grid"
import Button from "../../components/Button"
import Loader from "../../components/Loader"
import RemoteContent from "../../components/RemoteContent"
import Message from "../../components/Message"
import Comments from "../Comments"

import {formatReadingTime} from "../../utils"
import {dateToString} from "../../utils"
import {textTruncate} from "../../utils"
import { stickyNav } from "../../utils"
import { stickySidebar } from "../../utils"

import styles from "./styles.css"

import graphicLibrarySmall from "../../assets/svg/graphic-library-small.svg"

class KnowledgeSingle extends Component {
  constructor() {
    super()
    this.doPrint = this.doPrint.bind(this)
    this.closePrint = this.closePrint.bind(this)

    this.handleImageLoad = this.handleImageLoad.bind(this)

    this.state = {
      isPrinting: false,
      isLoaded: false
    }
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

  componentDidUpdate() {
    if (!this.props.error) {
      this.fixLastChild()
      this.initAnchorNav()
      // stickySidebar(this.props.fetching, true)
      if (this.state.isLoaded || !this.props.fetching) {
        // console.log('isLoaded',this.state.isLoaded)
        stickySidebar(this.props.fetching, true)
      }
      stickyNav(this.props.fetching)
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
    let anchorHeadline;
    let anchorNav = document.querySelector(".nav-anchor div");

    if (!this.props.fetching && anchorNav !== null) {
      anchorNav.innerHTML = "";
      anchorNav.parentNode.classList.remove('active');
      anchorHeadline = document.querySelectorAll(".wp-content h2");
      if(anchorHeadline.length > 0) {
        anchorNav.parentNode.classList.add('active');
        [].forEach.call(anchorHeadline, function(el, index) {
          el.setAttribute('id', 'anchor'+index);

          let navItem = document.createElement('a');
          navItem.innerHTML = '<span>' + el.innerHTML + '</span>';
          navItem.setAttribute('data-scroll', '');
          navItem.setAttribute('href', '#anchor'+index);
          // if(index === 0) {
          //   navItem.classList.add('scroll-active');
          // }
          anchorNav.appendChild(navItem);
        });
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
    document
      .querySelectorAll(".column-inner .wrapper")
      .forEach(function (elem) {
        let types = Array.from(elem.children)
        if (types.length > 1) elem.className += " multi"
      })
  }

  getPostNav() {
    const {post,t,lang} = this.props
    const subcategory = post.subcategory
    const prev_post = post.prev_post
    const next_post = post.next_post

    if ((next_post !== null && typeof next_post.fields === "undefined") || (prev_post !== null && typeof prev_post.fields === "undefined")) {
      return null
    }

    return (
      <div className="post--nav nav-black">
        <Container>
          <Row>
            <Col>
              <ul>
                <li className={prev_post ? "prev" : "prev --disabled"}>
                  <ul className="prev-post">
                    {prev_post ?
                      (
                        <li>
                          <span className="subheadline">{prev_post.fields.tag}</span>
                          <span className="headline">{textTruncate(prev_post.post_title, true, 4, "...")}</span>
                          <span className="description">{textTruncate(prev_post.post_excerpt, true, 7, "...")}</span>
                        </li>
                      )
                      : (null)}
                  </ul>
                  <i className="icon-arrow-left" />
                  {prev_post ? (
                    <Link href={`/${lang}/knowledge/article/${prev_post.ID}`}>
                      {t("Vorheriger Artikel")}
                    </Link>
                  ) : (
                    `${t("Vorheriger Artikel")}`
                  )}
                </li>
                <li className="back">
                  <i></i>
                  <Link href={`/${lang}/knowledge/articles/${subcategory.term_id}`}>
                    {t("Zur Artikelübersicht")}
                  </Link>
                </li>
                <li className={next_post ? "next" : "next --disabled"}>
                  {next_post ? (
                    <Link href={`/${lang}/knowledge/article/${next_post.ID}`}>
                      {t("Nächster Artikel")}
                    </Link>
                  ) : (
                    `${t("Nächster Artikel")}`
                  )}
                  <i className="icon-arrow-right" />
                  <ul className="next-post">
                    {next_post ?
                      (
                        <li>
                          <span className="subheadline">{next_post.fields.tag}</span>
                          <span className="headline">{textTruncate(next_post.post_title, true, 4, "...")}</span>
                          <span className="description">{textTruncate(next_post.post_excerpt, true, 7, "...")}</span>
                        </li>
                      )
                      : (null)}
                  </ul>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  addKnowledgeSingleBookmark(e) {
    e.preventDefault();
    this.props.addBookmark(this.props.post.ID, "knowledge")
  }

  removeKnowledgeSingleBookmark(e) {
    e.preventDefault();
    this.props.removeBookmark(this.props.post.ID, this.props.lang, "knowledge")
  }

  addKnowledgeSingleLike(e) {
    e.preventDefault();
    this.props.addLike(this.props.post.ID)
  }

  removeKnowledgeSingleLike(e) {
    e.preventDefault();
    this.props.removeLike(this.props.post.ID)
  }

  getPostIntro() {
    const {post,lang,t} = this.props

    return (
      <div className="post--intro">
        <div className="intro--text">
          <Container>
            <Row className="d-print-block" justifyContent={'between'}>
              <Col className="block-text">
                <h2 className="headline">{t("Einleitung")}</h2>
                <p>{post.post_excerpt}</p>
                <p dangerouslySetInnerHTML={{ __html: post.post_excerpt }} />
                <div className="info">
                  <p className="timestamp has-icon"><i className="icon icon-calender"></i><span className="title">{t("Veröffentlichung")}:&nbsp;</span><span>{dateToString(post.post_date, lang, ' | ')}</span><span className="title"> | {t("Letzte Aktualisierung")}:&nbsp;</span><span className="updated">{dateToString(post.post_modified, lang, ' | ')}</span></p>
                  <p className="time has-icon"><i className="icon icon-clock"></i><span>{formatReadingTime(post.fields.reading_time)}</span></p>
                  <p className="action-likes has-icon">
                    <a className={`${post.is_liked ? "is-liked" : ""}`} onClick={(e) => { post.is_liked ? this.removeKnowledgeSingleLike(e) : this.addKnowledgeSingleLike(e) }}>
                      <span className="icon-block">
                        <i className="icon icon-like-blank" />
                        <span className={`count ${post.num_likes > 0 ? "active" : ""}`}>{post.num_likes}</span>
                      </span>
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
                    <a onClick={(e) => { post.is_bookmarked ? this.removeKnowledgeSingleBookmark(e) : this.addKnowledgeSingleBookmark(e)} }>
                      <span className="icon-block">
                        <i className="icon icon-list" />
                        {post.is_bookmarked ?
                          (<span className="remove">&times;</span>)
                          : (<span className="add">+</span>)}
                      </span>
                      {post.is_bookmarked ?
                        (<span className="title">{t("von Merkliste entfernen")}</span>)
                        : (<span className="title">{t("Merkliste")}</span>)}
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
    const linked_knowledge_articles = post.fields.linked_knowledge_articles

    return linked_knowledge_articles.map(article => {
      return (
        <Col className={styles.Related} lg={8} key={article.ID}>
          <div className="teaser">
            <Link className="teaser-link"
              href={`/${lang}/knowledge/article/${article.ID}`}
            ></Link>
            <div className="teaser-top">
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
                theme="cyan"
                to={`/${lang}/knowledge/article/${article.ID}`}
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
    })
    setTimeout(function () {
      window.print(); return false
    }, 1000)
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

  render() {
    const {post, fetching, error, lang, t} = this.props
    const subcategory = post.subcategory
    const category = post.category
    const tags = post.fields.tag
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

    if (typeof category === "undefined" || typeof subcategory === "undefined" || typeof tags === "undefined") {
      return null
    }
    return (
      <div className={styles.Post}>
        <Loader active={fetching} />
        <div className={`${styles.IntroBlock} intro-block`}>
          <Container>
            <Row className="row-fluid">
              <Col md={10} xl={9} className="col-left">
                <div className="wp-content">
                  <Row className="row-fluid">
                    <Col>
                      <div className="text_column">
                        <h1 className="headline">{post.post_title}</h1>
                        <p className="description no-margin">{post.post_excerpt}</p>
                        <div className="tags">
                          {
                            tags.map((tag, index) =>
                              <p key={`tag-${index}`}>{tag}</p>
                            )
                          }
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={2} offsetXl={1} className="col-right">
                <div className="image-holder">
                  <img src={graphicLibrarySmall} alt="Library" />
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
                      <p className="action-likes has-icon">
                        <a className={`${post.is_liked ? "is-liked" : ""}`} onClick={(e) => { post.is_liked ? this.removeKnowledgeSingleLike(e) : this.addKnowledgeSingleLike(e) }}>
                          <span className="icon-block">
                            <i className="icon icon-like-blank" />
                            <span className={`count ${post.num_likes > 0 ? "active" : ""}`}>{post.num_likes}</span>
                          </span>
                          <span className="title">{t("Artikel liken")}</span>
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
                      <p className="action-bookmark has-icon">
                        <a onClick={(e) => { post.is_bookmarked ? this.removeKnowledgeSingleBookmark(e) : this.addKnowledgeSingleBookmark(e) }}>
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
              <Container className="container-main fix-ie">
                  <Row justifyContent={'between'}>
                    <Col lg={8}>
                      <div className="post-articles">
                        <RemoteContent>
                          {post.post_content}
                        </RemoteContent>
                      </div>
                    </Col>
                    <Col lg={4} className="sidebar sidebar-anchors">
                      <nav className="nav-anchor knowledge">
                        <p className="title icon">{t("Inhaltsverzeichnis")}<i className="icon-arrow-down"></i></p>
                        <div></div>
                      </nav>
                    </Col>
                  </Row>
                </Container>
                <Container className="container-extra">
                <div className="newest-related">
                  <Row>
                    {post.fields.linked_knowledge_articles.length > 0 && (
                      <Col lg={8}>
                        <h2>{t("Weiterführende Artikel")}</h2>
                      </Col>
                    )}
                    {this.getLinkedArticles()}
                  </Row>
                </div>
              </Container>
              <div id="commentForm">
                <Container>
                  <Row>
                    <Col className={styles.Comments} lg={8}>
                      <Comments id={this.props.id} title={post.post_title} />
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          ) :
          (
            <table className="print-table">
              <thead><tr><td>
                <div className="header-space">&nbsp;</div>
              </td></tr></thead>
              <tbody><tr><td>
              <div className="inside">
                <Container className="container-main fix-ie">
                  <Row className="d-print-block" justifyContent={'between'}>
                    <Col lg={8}>
                      <div className="post-articles">
                          <RemoteContent>
                            {post.post_content}
                          </RemoteContent>
                      </div>
                    </Col>
                    <Col lg={4} className="sidebar sidebar-anchors">
                      <nav className="nav-anchor knowledge">
                        <p className="title icon">{t("Inhalt")}</p>
                        <div></div>
                      </nav>
                    </Col>
                  </Row>
                </Container>
                <Container className="container-extra">
                  <div className="newest-related">
                    <Row>
                      {post.fields.linked_knowledge_articles.length > 0 && (
                        <Col lg={8}>
                          <h2>{t("Weiterführende Artikel")}</h2>
                        </Col>
                      )}
                      {this.getLinkedArticles()}
                    </Row>
                  </div>
                </Container>
                <div id="commentForm">
                  <Container>
                    <Row>
                      <Col className={styles.Comments} lg={8}>
                        <Comments id={this.props.id} title={post.post_title} />
                      </Col>
                    </Row>
                  </Container>
                </div>
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
    ...state.knowledgesingle,
    id: state.router.params.id,
    lang: state.app.lang,
    token: state.login.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addBookmark: (id, container) => dispatch(MBCreators.addBookmark(id, container)),
    removeBookmark: (id, lang, container) => dispatch(MBCreators.removeBookmark(id, lang, container)),
    addLike: (id) => dispatch(MLCreators.addLike(id)),
    removeLike: (id) => dispatch(MLCreators.removeLike(id))
  }
}

KnowledgeSingle = connect(mapStateToProps, mapDispatchToProps)(KnowledgeSingle)
export default translate()(KnowledgeSingle)

export {reducer} from "./redux"
export { default as sagas } from "./sagas"
