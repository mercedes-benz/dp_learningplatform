import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import { Link } from "redux-little-router"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import Button from "../../components/Button"
import Loader from "../../components/Loader"
import Certificate from "../../components/Certificate"

import { textTruncate } from "../../utils"
import { dateToString } from "../../utils"

import styles from "./styles.css"

import graphicAcademyMed from "../../assets/svg/graphic-academy-med.svg"

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class Learning extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      sortBy: "default",
      filterBy: "all",
      isMobile: false,
      isCrtPrinting: false,
      topicname: null,
      modulesNames: [],
      topicdate: null
    }

    this.updatePredicate = this.updatePredicate.bind(this);
    this.doCrtPrint = this.doCrtPrint.bind(this)
    this.closeCrtPrint = this.closeCrtPrint.bind(this)

    this.sort = null
    this.filter = null
  }
  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    topics: PropTypes.array.isRequired,
    post: PropTypes.object.isRequired,
    sidebar: PropTypes.array.isRequired,
    userdata: PropTypes.object.isRequired,
  }

  static defaultProps = {
    topics: [],
    post: {},
    sidebar: [],
    userdata: {},
    fetching: false,
    error: null
  }

  updatePredicate() {
    if (window.innerWidth < 1200) {
      this.setState({ isMobile: window.innerWidth < 768 });
    }
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

  doCrtPrint(e) {
    e.persist();
    let topicname = e.target.getAttribute('data-title')
    let topicdate = e.target.getAttribute('data-date')
    let modulesNames = e.target.getAttribute('data-modules')
    modulesNames = modulesNames.split(',')
    this.setState(prevState => {
      return {
        ...prevState,
        isCrtPrinting: true,
        topicname: topicname,
        modulesNames: modulesNames,
        topicdate: topicdate
      }
    })

    const input = document.getElementById('crt-print');
    setTimeout(function () {
      // window.devicePixelRatio = 2;
      html2canvas(input, { scale: 2, width: 690, height: 1120, scrollX: 0, scrollY: 0 }).then(canvas => {
        // document.body.appendChild(canvas)
        var context = canvas.getContext('2d');
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        context.scale(2, 2);
        context["imageSmoothingEnabled"] = false;
        context["mozImageSmoothingEnabled"] = false
        context["oImageSmoothingEnabled"] = false
        context["webkitImageSmoothingEnabled"] = false
        context["msImageSmoothingEnabled"] = false
        // var dataURL = canvas.toDataURL("image/jpeg", 1);
        const dataURL = canvas.toDataURL('image/png', 1)
        const pdf = new jsPDF("p", "mm", "a4", true);
        let marginLeft = 13;
        let marginRight = 0;
        pdf.internal.scaleFactor = 5.7;

        pdf.addImage(dataURL, 'PNG', marginLeft, marginRight, '', '', '', 'FAST')
        pdf.save('SIMPLICITY-ZERTIFIKAT-' + topicname.replace(/\s/g, '-').toUpperCase() + topicdate + '.pdf')
      })
    }, 1000);

    let self = this;
    setTimeout(function () {
      self.setState(prevState => {
        return {
          ...prevState,
          isCrtPrinting: false,
          topicname: null,
          modulesNames: [],
          topicdate: null
        }
      })
    }, 3000);
  }
  closeCrtPrint() {
    this.setState(prevState => {
      return {
        ...prevState,
        isCrtPrinting: false
      }
    })
  }

  getContent() {
    const {post} = this.props

    return (
      <div className={styles.IntroBlock}>
        <Container>
          <Row className="row-fluid">
            <Col md={10} xl={6} className="col-left">
              <div
                className="wp-content"
                dangerouslySetInnerHTML={{ __html: post.post_content }}
              ></div>
            </Col>
            <Col md={2} xl={4} offsetXl={1} className="col-right">
              <div className="image-holder">
                <img src={graphicAcademyMed} alt="Academy" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  filterTopics(topics, filterBy) {
    if(filterBy === "all") {
      return topics
    } else if(filterBy === "available") {
      return topics.filter((topic) => topic.read_articles === 0)
    } else if(filterBy === "in_progress") {
      return topics.filter((topic) => topic.read_articles !== 0 && topic.read_articles < topic.number_articles)
    } else if(filterBy === "done") {
      return topics.filter((topic) => topic.completed_modules >= topic.number_modules)
    }

    return topics
  }

  sortTopics(topics, sortBy) {
    if(sortBy === "number_of_modules_descending") {
      return topics.sort((a, b) => {
        if(a.number_modules === b.number_modules) {
          return 0
        } else if(a.number_modules < b.number_modules) {
          return 1
        } else {
          return -1
        }
      })
    } else if(sortBy === "number_of_modules_ascending") {
      return topics.sort((a, b) => {
        if(a.number_modules === b.number_modules) {
          return 0
        } else if(a.number_modules > b.number_modules) {
          return 1
        } else {
          return -1
        }
      })
    } else if(sortBy === "progress") {
      return topics.sort((a, b) => {
        const lp_a = ((a.read_articles > a.number_articles ? a.number_articles : a.read_articles) * 100) / a.number_articles
        const lp_b = ((b.read_articles > b.number_articles ? b.number_articles : b.read_articles) * 100) / b.number_articles

        return Math.floor(lp_b) - Math.floor(lp_a)
      })
    } else if (sortBy === "default") {
      return topics.sort((a, b) => {
        if (parseInt(a.fields.order, 10) === parseInt(b.fields.order, 10)) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1
          } else {
            return 1
          }
        }
        else if (parseInt(a.fields.order, 10) < parseInt(b.fields.order, 10)) {
          return -1
        } else {
          return 1
        }
      })
    }

    return topics
  }

  filterAndSortTopics(topics, filterBy, sortBy) {
    const filteredTopics = this.filterTopics(topics, filterBy)
    const sortedTopics = this.sortTopics(filteredTopics, sortBy)

    return sortedTopics
  }

  getTopics() {
    const {topics, t, lang} = this.props
    const {sortBy, filterBy} = this.state

    const filteredAndSortedTopics = this.filterAndSortTopics(topics, filterBy, sortBy)

    return filteredAndSortedTopics.map((topic, _index) => {
      const learningProgress = ((topic.read_articles > topic.number_articles ? topic.number_articles : topic.read_articles) * 100) / topic.number_articles

      let status = "default"

      if(learningProgress === 100) {
        status = "done"
      } else if(learningProgress === 0) {
        status = "default"
      } else {
        status = "in-progress"
      }

      const topicModules = []
      // eslint-disable-next-line
      topic.modules.map((item, _index) => {
        topicModules.push(item.name)
      })

      return (
        <Col sm={6} className={[styles.Topic, status].join(" ")} key={topic.term_id}>
          <div className="teaser">
            <Link className="teaser-link" href={`/${lang}/learning/topic/${topic.term_id}`}>
            </Link>
            {typeof topic.fields.image !== "undefined" && topic.fields.image ?
              (<div
                className="image-holder"
                style={{ backgroundImage: `url(${topic.fields.image})` }}
              >
                <img src={topic.fields.image} alt={topic.name} />
              </div>) : (null)
            }
            <div className="content-holder">
              <div className="inner">
                {topic.name.length > 75 ?
                  (<h3 className="headline" dangerouslySetInnerHTML={{ __html: textTruncate(topic.name, false, 75, '[...]') }} />) :
                  (<h3 className="headline" dangerouslySetInnerHTML={{ __html: topic.name }} />)
                }
                {topic.description.length > 200 ?
                  (<p className="description" dangerouslySetInnerHTML={{ __html: textTruncate(topic.description, false, 200, '[...]') }} />) :
                  (<p className="description" dangerouslySetInnerHTML={{ __html: topic.description }} />)
                }
                <Button theme="purple" to={`/${lang}/learning/topic/${topic.term_id}`}>
                  {t("Zum Kurs")}
                </Button>
              </div>
            </div>
            <div className="info-holder">
              <div className="info">
                <i className={["icon-ico-state-todo", status].join(" ")}></i>
                <span className="count">{topic.completed_modules}/{topic.number_modules}</span>
                <span className="title">
                  {topic.number_modules > 1 ?
                    (t("Modulen")): (t("Modul"))
                  }
                </span>
              </div>
              <div className="certificate">
                {learningProgress === 100 ?
                (
                  < a data-title={topic.name} data-modules={topicModules} data-date={dateToString(topic.completed_at, lang, ' | ')} onClick={(e) => this.doCrtPrint(e)}>
                    <span className="icon-block">
                      <i className="icon icon-cert-download" />
                    </span>
                    <span className="title">{t("Zertifikat herunterladen")}</span>
                  </a>
                ) : (null)
                }
              </div>
              <div className="status">
                <span style={{ width: `${learningProgress}%` }} className={["inner", status].join(" ")}>
                  <span className="percent">
                    {Math.floor(learningProgress)}%
                  </span>
                </span>
              </div>
            </div>
          </div>
        </Col>
      )
    })
  }

  _handleSort(sortBy) {
    this.setState((prevState) => {
      return {
        ...prevState,
        sortBy,
      }
    })

    // close sort dropdown
    this.sort.previousElementSibling.classList.remove("is-active")
    this.sort.classList.remove("is-active", "is-open")
    this.sort.style.height = "0px"
    this.sort.addEventListener("transitionend", () => {
      this.sort.classList.remove("active")
    }, {once: true})
  }

  _handleFilter(filterBy) {
    this.setState((prevState) => {
      return {
        ...prevState,
        filterBy,
      }
    })

    // close filter dropdown
    this.filter.previousElementSibling.classList.remove("is-active")
    this.filter.classList.remove("is-active", "is-open")
    this.filter.style.height = "0px"
    this.filter.addEventListener("transitionend", () => {
      this.filter.classList.remove("active")
    }, {once: true})
  }

  render() {
    const {error,t} = this.props
    const sort = {
      default: t("Standard"),
      number_of_modules_ascending: `${t("Anzahl Module aufsteigend")}`,
      number_of_modules_descending: `${t("Anzahl Module absteigend")}`,
      progress: `${t("Fortschritt")}`
    }
    const status = {
      all: t("Alle"),
      available: `${t("Verfügbar")}`,
      in_progress: `${t("In Bearbeitung")}`,
      done: `${t("Erledigt")}`
    }
    const isMobile = this.state.isMobile;

    if(this.props.userdata.user === undefined) {
      return null
    }
    
    return (
      <div>
        <Loader active={this.props.fetching} />
        {!this.props.fetching ?
          (
            <Certificate username={this.props.userdata.user.display_name} topicname={this.state.topicname} modulesNames={this.state.modulesNames} currentDate={this.state.topicdate} isCrtPrinting={this.state.isCrtPrinting} closeCrtPrint={this.closeCrtPrint} />
          ) : (null)}
        <div>
          {this.getContent()}
          <div className="inside">
            <div className={styles.FilterBar}>
              <Container>
                <Row className="row-fluid" justifyContent="between" alignItems="center">
                  <Col className="status-filter" lg={4} sm={6}>
                    <span className="title">{t("Status")}:</span>
                    <div className="filter-wrap">
                      {isMobile ? (
                        <span
                          onClick={(e) => this.slideToggle(e)}
                          className={`placeholder icon icon-arrow-down ${this.state.active ? "active" : ""}`}>{t("$color-background")}
                        </span>
                      ) : (
                          <span
                            onClick={(e) => this.slideToggle(e)}
                            className={`placeholder icon icon-arrow-down ${this.state.active ? "active" : ""}`}>{status[this.state.filterBy]}
                          </span>
                        )}
                      <div className="filter" ref={(filter) => this.filter = filter}>
                        {Object.keys(status).map((item, index) => {
                          return (
                            <button
                              className={`${item}`}
                              key={index}
                              value={item}
                              onClick={(_e) => this._handleFilter(item)}
                            >
                              {status[item]}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </Col>
                  <Col className="sort-filter" lg={4} sm={6}>
                    <span className="title">{t("Sortieren nach")}:</span>
                    <div className="filter-wrap">
                      {isMobile ? (
                        <span
                          onClick={(e) => this.slideToggle(e)}
                          className={`placeholder icon icon-arrow-down ${this.state.active ? "active" : ""}`}>{t("$color-background")}
                        </span>
                      ) : (
                          <span
                            onClick={(e) => this.slideToggle(e)}
                            className={`placeholder icon icon-arrow-down ${this.state.active ? "active" : ""}`}>{sort[this.state.sortBy]}
                          </span>
                        )}
                      <div className="filter" ref={(sort) => this.sort = sort}>
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
                  <Col className="status-info" lg={4}>
                      <ul>
                        <li className="available"><i></i><span>{t("Verfügbar")}</span></li>
                        <li className="wip"><i></i><span>{t("In Bearbeitung")}</span></li>
                        <li className="done"><i></i><span>{t("Erledigt")}</span></li>
                      </ul>
                  </Col>
                </Row>
              </Container>
            </div>
            <Container className={styles.Topics}>
              <Row className="row-fluid">
                {error && <Col className={styles.Error}>{error}</Col>}
                {this.getTopics()}
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
    ...state.learning,
    lang: state.app.lang
  }
}

// export default connect(mapStateToProps)(Learning)
Learning = connect(mapStateToProps)(Learning)
export default translate()(Learning)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
