import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import { Link } from "redux-little-router"
import { push } from "redux-little-router"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import Button from "../../components/Button"
import Loader from "../../components/Loader"
import RemoteContent from "../../components/RemoteContent"

import graphicLibraryStart from "../../assets/svg/graphic-library-start.svg"
import graphicAcademyStart from "../../assets/svg/graphic-academy-start.svg"

import styles from "./styles.css"

class Home extends Component {
  state = {
    searchValue: ""
  }
  constructor(props) {
    super(props)

    this.doSearch = this.doSearch.bind(this)
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.searchInput = null
  }

  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    categories: PropTypes.array.isRequired,
    topics: PropTypes.array.isRequired,
    post: PropTypes.object.isRequired,
    latest_articles: PropTypes.array.isRequired
  }

  static defaultProps = {
    categories: [],
    topics: [],
    post: {},
    latest_articles: [],
    fetching: false,
    error: null
  }

  slideToggle(e) {
    let dropdown = e.target.nextElementSibling;
    if (e.target.classList.contains("is-active")) {
      e.target.classList.remove("is-active");
      dropdown.classList.remove("is-open");
      dropdown.style.height = "0px"
      dropdown.addEventListener('transitionend', () => {
        dropdown.classList.remove('active')
      }, { once: true })
    } else {
      e.target.classList.add("is-active")
      dropdown.classList.add('is-open')
      dropdown.style.height = "auto"
      var height = dropdown.clientHeight + "px"
      dropdown.style.height = "0px"
      setTimeout(() => {
        dropdown.style.height = height
      }, 0)
    }
  }

  getTopics() {
    const { topics, lang } = this.props
    return topics.map((topic, index) => {
      return (
        <Link key={topic.term_id}
          href={`/${lang}/learning/topic/${topic.term_id}`}
        >
          {topic.name}
        </Link>
      )
    })
  }

  getCategories() {
    const { categories, lang } = this.props
    return categories.map((category, index) => {
      if (category.first_subcategory === null) {
        return null
      } else {
        return (
          <Link key={category.term_id}
            href={`/${lang}/knowledge/articles/${category.first_subcategory.term_id}`}
          >
            {category.name}
          </Link>
        )
      }
    })
  }

  getContent() {
    const {post} = this.props

    return (
      <RemoteContent>
        {post.post_content}
      </RemoteContent>
    )
  }

  doSearch(e) {
    e.preventDefault()
    const { lang } = this.props
    const encodedSearchValue = encodeURI(this.state.searchValue)

    this.props.push(`/${lang}/search?q=${encodedSearchValue}`)

    this.searchInput.value = ""
    this.setState(prevState => {
      return {
        ...prevState,
        searchValue: ""
      }
    })
  }
  handleSearchInputChange(e) {
    e.persist()
    this.setState(prevState => {
      return {
        ...prevState,
        searchValue: e.target.value
      }
    })
  }

  render() {
    const {error,t, lang} = this.props
    return (
      <div className={styles.Home}>
        <Loader active={this.props.fetching} />
        {this.getContent()}
        <div id="content" className="inside">
          <Container className="categories-list">
            <Row className="row-fluid">
              {error && <Col className={styles.Error}>{error}</Col>}
              <Col className="box-holder">
                <div className="learning-box box">
                  <div className="inner">
                    <div className="image-holder">
                      <img className="image" src={graphicAcademyStart} alt="icon-lernen" />
                    </div>
                    <div className="content-holder">
                      <h3 className="headline">{t("Akademie")}</h3>
                      <p className="description">{t("Du benötigst neues Wissen? In der Akademie findest du die passenden E-Learning-Kurse.")}</p>
                    </div>
                    <Button theme="white" to={`/${lang}/learning/topics`}>
                      {t("Zur Kursübersicht")}
                    </Button>
                  </div>
                </div>
                <div className="knowledge-box box">
                  <div className="inner">
                    <div className="image-holder">
                      <img className="image" src={graphicLibraryStart} alt="icon-wisen" />
                    </div>
                    <div className="content-holder">
                      <h3 className="headline">{t("Bibliothek")}</h3>
                      <p className="description">{t("Du hast offene Fragen oder suchst Unterstützung? In der Bibliothek findest du schnell eine Lösung.")}</p>
                    </div>
                    <Button theme="white" to={`/${lang}/knowledge/articles`}>
                      {t("Zur Kategorieübersicht")}
                    </Button>
                  </div>
                </div>
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
    ...state.home,
    lang: state.app.lang
  }
}

const mapDispatchToProps = dispatch => {
  return {
    push: location => dispatch(push(location))
  }
}

// export default connect(mapStateToProps)(Home)
Home = connect(mapStateToProps, mapDispatchToProps)(Home)
export default translate()(Home)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
