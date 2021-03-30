import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import Loader from "../../components/Loader"
import Sidebar from "../../components/Sidebar"
import { Link } from "redux-little-router"

import styles from "./styles.css"

import graphicLibrarySmall from "../../assets/svg/graphic-library-small.svg"
import graphicLibraryIndex from "../../assets/svg/graphic-library-index.svg"

class Knowledge extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      currentSortTitle: "Veröffentlichung absteigend",
      isMobile: false
    }

    this.updatePredicate = this.updatePredicate.bind(this);
  }

  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    post: PropTypes.object.isRequired,
    sidebar: PropTypes.array.isRequired,
    tags: PropTypes.object.isRequired
  }

  static defaultProps = {
    post: {},
    sidebar: [],
    tags: {},
    fetching: false,
    error: null
  }

  updatePredicate() {
    if (window.innerWidth < 1200) {
      this.setState({ isMobile: window.innerWidth < 768 });
    }
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

  getContent() {
    const {post} = this.props

    return (
      <div className={styles.IntroBlock}>
        <Container>
          <Row className="row-fluid">
            <Col md={10} xl={7} className="col-left">
              <div
                className="wp-content"
                dangerouslySetInnerHTML={{ __html: post.post_content }}
              ></div>
            </Col>
            <Col md={2} xl={3} offsetXl={2} className="col-right">
              <div className="image-holder">
                <img src={graphicLibrarySmall} alt="Library" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  getTags() {
    const { tags } = this.props
    return Object.keys(tags).map((tag, index) => {
      return (
        <li
          className={`tag ${tag}`}
          key={index}
          value={tag}
        >
          <i className="icon">&times;</i>
          <span>{tags[tag]}</span>
        </li>
      )
    })
  }

  render() {
    const {error, sidebar, t, lang} = this.props

    return (
      <div>
        <Loader active={this.props.fetching} />
        <div className={styles.Overview}>
          {this.getContent()}
          <div className="inside">
            <div className={styles.FilterBar}>
              <Container>
                <Row className="row-fluid" justifyContent="end" alignItems="center">
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
                  <Sidebar items={sidebar} theme={"cyan"} />
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
                  <div className="content-block">
                    <div className="content-holder">
                      <h2>{t("Herzlich Willkommen in der Bibliothek.")}</h2>
                      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
                      <ul>
                        <li>{t("Kategorien- und Unterkategorien wählen")}</li>
                        <li>{t("Ergebnisse z.B. nach Veröffentlichungsdatum sortieren")}</li>
                        <li>{t("Nach definierten Tags filtern")}</li>
                      </ul>
                    </div>
                    <div className="image-holder">
                      <img src={graphicLibraryIndex} alt="Library" />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.knowledge,
    lang: state.app.lang
  }
}

// export default connect(mapStateToProps)(Knowledge)
Knowledge = connect(mapStateToProps)(Knowledge)
export default translate()(Knowledge)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
