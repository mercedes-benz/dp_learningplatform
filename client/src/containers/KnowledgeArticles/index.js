import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { KnowledgeArticlesCreators as Creators } from "./redux"
import { ManageBookmarksCreators as MBCreators } from "../ManageBookmarks/redux"
import { ManageLikesCreators as MLCreators } from "../ManageLikes/redux"
import { Link } from "redux-little-router"
import { translate } from "react-i18next"

import { Container, Row, Col } from "../../components/Grid"
import Button from "../../components/Button"
import Sidebar from "../../components/Sidebar"
import Loader from "../../components/Loader"
import Message from "../../components/Message"

import RemoteContent from "../../components/RemoteContent"

import { formatReadingTime, textTruncate, sortArticles } from "../../utils"

import styles from "./styles.css"

import graphicLibrarySmall from "../../assets/svg/graphic-library-small.svg"

class KnowledgeArticles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      filterBy: [],
      sortBy: "default",
      filterCounts: 0,
      currentSortTitle: "Veröffentlichung absteigend",
      isMobile: false
    }

    this.articles = React.createRef()

    this.updatePredicate = this.updatePredicate.bind(this);
    this.fetchSubcategoryWithContent = this.fetchSubcategoryWithContent.bind(this)
  }

  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    category: PropTypes.object.isRequired,
    subcategory: PropTypes.object.isRequired,
    posts: PropTypes.array.isRequired,
    sidebar: PropTypes.array.isRequired,
    tags: PropTypes.object.isRequired,
    subcategoryWithContent: PropTypes.object.isRequired,
  }

  static defaultProps = {
    category: {},
    subcategory: {},
    posts: [],
    sidebar: [],
    tags: {},
    subcategoryWithContent: {},
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

  updatePredicate() {
    if (window.innerWidth < 1200) {
      this.setState({ isMobile: window.innerWidth < 768 });
    }
  }

  fetchSubcategoryWithContent(e) {
    e.preventDefault();
    let id = e.target.getAttribute("href")
    this.props.loadSubcategoryWithContent(id)
    this.setState(prevState => {
      return {
        ...prevState,
        isPrinting: true
      }
    })
  }

  slideToggle(e) {
    e.stopPropagation()
    let target = e.target;
    let dropdown = target.nextElementSibling;
    if (target.classList.contains("is-active")) {
      target.classList.remove("is-active");
      dropdown.classList.remove("is-open");
      dropdown.style.height = "0px"
      dropdown.addEventListener('transitionend', () => {
        dropdown.classList.remove('active')
      }, { once: true })
    } else {
      target.classList.add("is-active")
      dropdown.classList.add('is-open')
      dropdown.style.height = dropdown.scrollHeight + 'px';
    }
    dropdown.onmouseleave = function () {
      target.classList.remove("is-active");
      dropdown.classList.remove("is-open");
      dropdown.style.height = "0px"
      dropdown.addEventListener('transitionend', () => {
        dropdown.classList.remove('active')
      }, { once: true })
    }
    const outsideClickListener = event => {
      if (!target.contains(event.target)) {
        target.classList.remove("is-active")
        dropdown.classList.remove("is-open")
        dropdown.style.height = "0px"
        dropdown.addEventListener('transitionend', () => {
          dropdown.classList.remove('active')
        }, { once: true })
        removeClickListener()
      }
    }
    const removeClickListener = () => {
      document.removeEventListener('click', outsideClickListener)
    }
    document.addEventListener('click', outsideClickListener)
  }

  _handleFilter(tag) {
    if (this.state.filterBy.includes(tag)) {
      this.setState((prevState) => {
        const tags = [...this.state.filterBy]
        tags.splice(tags.indexOf(tag), 1)
        return {
          ...prevState,
          filterBy: tags,
        }
      })
    } else {
      this.setState((prevState) => {
        return {
          ...prevState,
          filterBy: [...prevState.filterBy, tag],
        }
      })
    }
  }

  _handleSort(sortBy) {
    this.setState((prevState) => {
      return {
        ...prevState,
        sortBy,
      }
    })
  }

  getCategoryName() {
    return typeof this.props.category.category === "undefined" ? null : this.props.category.category.name
  }

  getAvailableTags(articles, allTags) {
    let articlesTags = []
    articles.forEach((article) => {
      if (article.fields.tag && article.fields.tag !== 'undefined') {
        article.fields.tag.forEach(function (item, i, arr) {
          articlesTags.push(item)
        });
      }
    })
    if (articlesTags.length > 0) {
      articlesTags = articlesTags.filter(function (item, pos) {
        return articlesTags.indexOf(item) === pos;
      })
      for (let [key, value] of Object.entries(allTags)) {
        if (!articlesTags.includes(value)) {
          delete allTags[key]
        }
      }
    }
    return allTags
  }

  getTags() {
    const { tags, posts } = this.props
    const { filterBy } = this.state
    const availableTags = this.getAvailableTags(posts, tags)

    return Object.keys(availableTags).map((tag, index) => {
      return (
        <li
          className={["tag", tag, filterBy.includes(tags[tag]) && "active"].join(" ")}
          key={index}
          onClick={(_e) => this._handleFilter(tags[tag])}
        >
          <i className="icon">&times;</i>
          <span>{tags[tag]}</span>
        </li>
      )
    })
  }

  addKnowledgeArticlesBookmark(e, postid) {
    e.preventDefault();
    this.props.addArticlesBookmark(postid, true)
  }

  removeKnowledgeArticlesBookmark(e, postid) {
    e.preventDefault();
    this.props.removeArticlesBookmark(postid)
  }

  addKnowledgeArticlesLike(e, postid) {
    e.preventDefault();
    this.props.addArticlesLike(postid)
  }

  removeKnowledgeArticlesLike(e, postid) {
    e.preventDefault();
    this.props.removeArticlesLike(postid)
  }

  filterArticles(articles, filterBy) {
    return articles.filter((article) => {
      return filterBy.every((tag) => {
        return article.fields.tag.includes(tag)
      })
    })
  }

  filterAndSortArticles(articles, filterBy, sortBy) {
    const filteredArticles = this.filterArticles(articles, filterBy)
    const sortedArticles = sortArticles(filteredArticles, sortBy)

    return sortedArticles
  }

  getArticles() {
    const { posts, t, lang } = this.props
    const { sortBy, filterBy } = this.state
    const filteredAndSortedArticles = this.filterAndSortArticles(posts, filterBy, sortBy)

    if (!this.props.fetching && filteredAndSortedArticles.length === 0) {
      return (
        <Col>
          <p>{t("Es gibt keine Artikel, die Ihrer Auswahl entsprechen.")}</p>
        </Col>
      )
    } else {
      return filteredAndSortedArticles.map((post, index) => {
        return (
          <div className={`${styles.Post} item item-${index} col-12 col-md-6`} key={post.ID} data-filter={post.fields.tag}>
            <div className="teaser">
              <Link className="teaser-link"
                href={`/${lang}/knowledge/article/${post.ID}`}
              ></Link>
              <div className="teaser-top">
                <div className="likes">
                  <a className={`${post.is_liked ? "is-liked" : ""}`} onClick={(e) => { post.is_liked ? this.removeKnowledgeArticlesLike(e, post.ID) : this.addKnowledgeArticlesLike(e, post.ID) }}>
                    <span className="icon-block">
                      <i className="icon icon-like-blank" />
                      <span className={`count ${post.num_likes > 0 ? "active" : ""}`}>{post.num_likes}</span>
                    </span>
                  </a>
                </div>
                <div className="comments">
                  <span className="icon-block">
                    <i className="icon icon-comment-blank" />
                    <span className={`count ${post.comment_count > 0 ? "active" : ""}`}>{post.comment_count}</span>
                  </span>
                </div>
                <div className="bookmark">
                  <button onClick={(e) => { post.is_bookmarked ? this.removeKnowledgeArticlesBookmark(e, post.ID) : this.addKnowledgeArticlesBookmark(e, post.ID) }}>
                    <span className="icon-block">
                      <i className="icon icon-list" />
                      {post.is_bookmarked ?
                        (<span className="remove">-</span>)
                        : (<span className="add">+</span>)}
                    </span>
                    {post.is_bookmarked ?
                      (<span className="title">{t("Lesezeichen entfernen")}</span>)
                      : (<span className={`title ${post.is_bookmarked}`}>{t("Lesezeichen setzen")}</span>)}
                  </button>
                </div>
              </div>
              <h4 className="headline headline--desktop">
                {post.post_title}
              </h4>
              <p className="description">{textTruncate(post.post_excerpt, false, 200, '[...]')}</p>
              <div className="tags">
                {
                  post.fields.tag && post.fields.tag !== 'undefined' ?
                    (
                      post.fields.tag.map((tag, index) =>
                        <p key={`tag-${index}`}>{tag}</p>
                      )
                    ) : (null)
                }
              </div>
              <div className="actions">
                <p className="time icon icon-clock">
                  <span>{formatReadingTime(post.fields.reading_time)}</span>
                </p>
                <Button
                  theme="cyan"
                  size="small"
                  to={`/${lang}/knowledge/article/${post.ID}`}
                >
                  {t("Lesen")}
                </Button>
              </div>
            </div>
          </div>
        )
      })
    }
  }

  getSubcategoryWithContentList() {
    const { subcategoryWithContent } = this.props
    return subcategoryWithContent.posts.map((post, index) => {
      return (
        <li key={post.ID}><span>{`${index + 1}.`}</span><span>{post.post_title}</span></li>
      )
    })
  }

  getSubcategoryWithContent() {
    const { subcategoryWithContent } = this.props
    return subcategoryWithContent.posts.map(post => {
      return (
        <div className="module-post" key={post.ID}>
          <h2>{post.post_title}</h2>
          <RemoteContent>
            {post.post_content}
          </RemoteContent>
        </div>
      )
    })
  }

  render() {
    const { category, subcategory, sidebar, error, fetching, t, lang } = this.props
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

    const sort = {
      default: t("Neueste Artikel"),
      last_updated: t("Zuletzt aktualisiert"),
      readingtime_descending: t("Lesezeit absteigend"),
      readingtime_ascending: t("Lesezeit aufsteigend"),
      most_comments: t("Meiste Kommentare"),
      most_likes: t("Meiste Likes"),
    }

    return (
      <div className={this.props.subcategory.taxonomy}>
        <Loader active={fetching} />
        <div className={styles.IntroBlock}>
          <Container>
            <Row className="row-fluid">
              <Col md={10} xl={7} className="col-left">
                <div className="wp-content">
                  <Row className="row-fluid">
                    <Col>
                      {subcategory.name !== undefined ?
                      (
                        <div className="text_column">
                          <h1 className="headline" dangerouslySetInnerHTML={{ __html: subcategory.name }} />
                          <p className="description no-margin" dangerouslySetInnerHTML={{ __html: subcategory.description }} />
                        </div>
                      ) :
                      (
                        <div className="text_column">
                          <h1 className="headline" dangerouslySetInnerHTML={{ __html: category.name }} />
                          <p className="description no-margin" dangerouslySetInnerHTML={{ __html: category.description }} />
                        </div>
                      )
                      }
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={2} xl={3} offsetXl={2} className="col-right">
                <div className="image-holder">
                  <img src={graphicLibrarySmall} alt="Library" />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="inside">
          <div className={styles.FilterBar}>
            <Container>
              <Row className="row-fluid" justifyContent="between" alignItems="center">
                <Col className="sort-filter" lg={4}>
                  <span className="title">{t("Sortieren nach")}:</span>
                  <div className="filter-wrap">
                    <span
                      onClick={(e) => this.slideToggle(e)}
                      className={`placeholder icon icon-arrow-down ${this.state.active ? "active" : ""}`}>{sort[this.state.sortBy]}
                    </span>
                    <div className="filter">
                      {Object.keys(sort).map((item, index) => {
                        return (
                          <button
                            className={`${item}`}
                            key={index}
                            value={item}
                            onClick={(_e) => this._handleSort(item)}
                          >
                            {sort[item]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </Col>
                <Col className="bookmarks" lg={4}>
                  <Link href={`/${lang}/profile/wishlist`}>
                    <i className="icon-list"></i>
                    <span>{t("Meine Lesezeichen")}</span>
                  </Link>
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <Row className="row-fluid">
              {error && <Col className={styles.Error}>{error}</Col>}
              <Col lg={4}>
                <Sidebar items={sidebar} currentPage={category.name} theme={"cyan"} />
                <div className={styles.FilterTags}>
                  <div className="inner">
                    <ul>
                      <li className="title">{t("Filtern nach Tags")}</li>
                      {this.getTags()}
                      <li className="last"></li>
                    </ul>
                  </div>
                </div>
              </Col>
              <Col lg={8}>
                <Row className="row-fluid no-padding">
                  <div className="tiles" ref={this.articles}>
                    {this.getArticles()}
                  </div>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.knowledgearticles,
    id: state.router.params.id,
    lang: state.app.lang
  }
}

const mapDispatchToProps = dispatch => {
  return {
    moreArticles: (id, tag, sortby, orderby) =>
      dispatch(Creators.request(id, tag, sortby, orderby)),
    loadSubcategoryWithContent: (id) =>
      dispatch(Creators.subcategoryWithContentRequest(id)),

    addArticlesBookmark: (id, container) =>
      dispatch(MBCreators.addArticlesBookmark(id, container)),
    removeArticlesBookmark: (id, lang, container) =>
      dispatch(MBCreators.removeArticlesBookmark(id, lang, container)),

    addArticlesLike: (id) =>
      dispatch(MLCreators.addArticlesLike(id)),
    removeArticlesLike: (id) =>
      dispatch(MLCreators.removeArticlesLike(id))
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(KnowledgeArticles)
KnowledgeArticles = connect(mapStateToProps, mapDispatchToProps)(KnowledgeArticles)
export default translate()(KnowledgeArticles)

export { reducer } from "./redux"
export { default as sagas } from "./sagas"
