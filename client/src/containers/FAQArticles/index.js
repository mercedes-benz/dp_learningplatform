import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {FaqArticlesCreators as Creators} from "./redux"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import Button from "../../components/Button"
import Sidebar from "../../components/Sidebar"
import Breadcrumbs from "../../components/Breadcrumbs"
import Loader from "../../components/Loader"
import Message from "../../components/Message"

import styles from "./styles.css"

class FAQArticles extends Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false,
      isMobile: false,
      activeDropdown: '',
      activeLink: ''
    }

    this.updatePredicate = this.updatePredicate.bind(this);
  }

  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    category: PropTypes.object.isRequired,
    articles: PropTypes.array.isRequired,
    sidebar: PropTypes.array.isRequired
  }

  static defaultProps = {
    category: {},
    articles: [],
    sidebar: [],
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
    this.setState({ isMobile: window.innerWidth < 768 });
  }

  slideToggle(e) {
    let activeDropdown = this.state.activeDropdown;
    let activeLink = this.state.activeLink;
    let dropdown = e.target.nextElementSibling;
    if (e.target.classList.contains("is-active")) {
      e.target.classList.remove("is-active");
      dropdown.classList.remove("is-open");
      dropdown.style.height = "0px"
      dropdown.addEventListener('transitionend', () => {
        dropdown.classList.remove('active')
      }, { once: true })
      this.setState(prevState => {
        return {
          ...prevState,
          activeDropdown: '',
          activeLink: ''
        }
      })
    } else {
      if (activeLink !== '') {
        activeLink.classList.remove("is-active");
      }
      if (activeDropdown !== '') {
        activeDropdown.classList.remove("is-open");
        activeDropdown.style.height = "0px"
        activeDropdown.addEventListener('transitionend', () => {
          activeDropdown.classList.remove('active')
        }, { once: true })

      }

      e.target.classList.add("is-active")
      dropdown.classList.add('is-open')
      dropdown.style.height = "auto"
      var height = dropdown.clientHeight + "px"
      dropdown.style.height = "0px"
      setTimeout(() => {
        dropdown.style.height = height
      }, 0)

      activeLink = e.target;
      this.setState(prevState => {
        return {
          ...prevState,
          activeDropdown: dropdown,
          activeLink: activeLink
        }
      })
    }
  }

  getCategoryName() {
    return typeof this.props.category.category === "undefined" ? null : this.props.category.category.name
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
    const {articles} = this.props
    return articles.map((article, index) => {
      return (
        <div className={`${styles.Article} item-${index}`} key={article.ID}>
          <div onClick={(e) => this.slideToggle(e)} className="toggler"><span>{article.post_title}</span><i className="icon icon-arrow-down"></i></div>
          <div className="dropdown">
            <div dangerouslySetInnerHTML={{ __html: article.post_content }} />
            {article.fields.button.show ?
            (
              <Button
                theme="cyan"
                size="small"
                href={article.fields.button.link}
                target={article.fields.button.target}
              >
                {article.fields.button.text}
              </Button>
            ) :
              (null)
            }
          </div>
        </div>
      )
    })
  }

  render() {
    const {category, sidebar, error, fetching, t, lang} = this.props
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
        title: category.name,
        href: null
      }
    ]

    // const isMobile = this.state.isMobile;
    return (
      <div className={this.props.category.taxonomy}>
        <Loader active={fetching} />
        <div className={styles.Articles}>
          <div className="wp-content color-primary">
            <Container>
              <Row className="row-fluid">
                <Col lg={9}>
                  <div className="text_column">
                    <h2 className="headline">{category.name}</h2>
                    <p className="description">{category.description}</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="container-breadcrumbs">
            <Container>
              <Row className="row-fluid">
                <Breadcrumbs items={breadcrump_items} theme="cyan" />
              </Row>
            </Container>
          </div>
          <div className="inside">
            <Container>
              <Row className="row-fluid">
                <h3 className="headline">FAQ</h3>
                <div className="articles-list">
                  <Sidebar items={sidebar} currentPage={category.taxonomy} theme={"cyan"} />
                  <Col lg={8}>
                    <Row className="row-fluid no-margin">
                      {this.getArticles()}
                    </Row>
                  </Col>
                </div>
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
    ...state.faqarticles,
    slug: state.router.params.slug,
    lang: state.app.lang
  }
}

const mapDispatchToProps = dispatch => {
  return {
    moreArticles: (slug) => dispatch(Creators.request(slug))
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(FAQArticles)
FAQArticles = connect(mapStateToProps,mapDispatchToProps)(FAQArticles)
export default translate()(FAQArticles)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
