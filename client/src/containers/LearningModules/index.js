import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import { LearningModulesCreators as Creators } from "./redux"
import { Link } from "redux-little-router"
import { translate } from "react-i18next"

import {Container, Row, Col} from "../../components/Grid"
import Loader from "../../components/Loader"
import Message from "../../components/Message"
import RemoteContent from "../../components/RemoteContent"
import Quiz from "../../components/Quiz"
import Certificate from "../../components/Certificate"

import { textTruncate } from "../../utils"
import { stickyNav } from "../../utils"
import { stickySidebar } from "../../utils"
import { dateToString } from "../../utils"

import styles from "./styles.css"

import graphicAcademyMed from "../../assets/svg/graphic-academy-med.svg"

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import api from "../../services/ApiService"

class LearningModules extends Component {
  constructor() {
    super()
    this.modalVideo = React.createRef();

    this.fetchArticles = this.fetchArticles.bind(this)
    this.doPrint = this.doPrint.bind(this)
    this.closePrint = this.closePrint.bind(this)
    this.doGlobalPrint = this.doGlobalPrint.bind(this)
    this.closeGlobalPrint = this.closeGlobalPrint.bind(this)
    this.doCrtPrint = this.doCrtPrint.bind(this)
    this.closeCrtPrint = this.closeCrtPrint.bind(this)
    this.openQuiz = this.openQuiz.bind(this)
    this.closeQuiz = this.closeQuiz.bind(this)
    this.openVideo = this.openVideo.bind(this)
    this.closeVideo = this.closeVideo.bind(this)

    this.state = {
      activeDropdown: '',
      activeLink: '',
      isPrinting: false,
      isGlobalPrinting: false,
      isCrtPrinting: false,
      quizactive: false,
      videoactive: false,
      currentvideo: '',
      modulename: '',
      articlename: '',
      username: null,
      isReload: false
    }
  }

  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    topic: PropTypes.object.isRequired,
    modules: PropTypes.array.isRequired,
    articles: PropTypes.object.isRequired,
    quizpost: PropTypes.object.isRequired
  }

  static defaultProps = {
    topic: {},
    modules: [],
    articles: {},
    quizpost: {},
    fetching: false,
    error: null
  }

  componentDidMount() {
    if (document.querySelector('body').classList.contains('overflow')) {
      document.querySelector('body').className = '';
    }
    if (!this.props.error && !this.props.fetching) {
      stickyNav(this.props.fetching)
      stickySidebar(this.props.fetching, false)
    }
  }

  componentDidUpdate() {
    if (!this.props.error && !this.props.fetching) {
      stickyNav(this.props.fetching)
      stickySidebar(this.props.fetching, false)
    }
  }

  fetchArticles(e) {
    e.preventDefault();
    let moduleslug = e.target.getAttribute("href")
    this.props.loadArticles(moduleslug)
    let self = this;
    setTimeout(function () {
      self.setState(prevState => {
        return {
          ...prevState,
          isPrinting: true
        }
      })
    }, 500);
  }
   
  doPrint() {
    setTimeout(function() {
      window.print(); return false
    },1000)
    let self = this;
    setTimeout(function () {
      self.setState(prevState => {
        return {
          ...prevState,
          isPrinting: false
        }
      })
    }, 10000);
  }
  closePrint() {
    this.setState(prevState => {
      return {
        ...prevState,
        isPrinting: false
      }
    })
  }

  doGlobalPrint() {
    this.setState(prevState => {
      return {
        ...prevState,
        isGlobalPrinting: true
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
          isGlobalPrinting: false
        }
      })
    }, 7000);
  }
  closeGlobalPrint() {
    this.setState(prevState => {
      return {
        ...prevState,
        isGlobalPrinting: false
      }
    })
  }

  doCrtPrint() {
    document.querySelector('html').classList.add('overflow');
    this.setState(prevState => {
      return {
        ...prevState,
        isCrtPrinting: true,
        username: this.props.userdata.user.display_name
      }
    })
    const input = document.getElementById('crt-print');
    let topicname = this.props.topic.name
    let topicdate = dateToString(this.props.topic.completed_at, this.props.lang, ' | ')
    setTimeout(function () {
      // window.devicePixelRatio = 2;
      html2canvas(input, { scale: 2, width: 690, height: 1120 }).then(canvas => {
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
        const dataURL = canvas.toDataURL('image/png',1)
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
          isCrtPrinting: false
        }
      })
      document.querySelector('html').classList.remove('overflow');
    }, 3000);
  }
  closeCrtPrint() {
    document.querySelector('html').classList.remove('overflow');
    this.setState(prevState => {
      return {
        ...prevState,
        isCrtPrinting: false,
        username: null
      }
    })
  }

  slideToggle(e) {
    let activeDropdown = this.state.activeDropdown;
    let activeLink = this.state.activeLink;
    let dropdown = e.target.parentNode.parentNode.nextElementSibling;
    e.preventDefault();
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

  openQuiz(e, fetch = true) {
    if(fetch) {
      let quizslug = e.target.getAttribute('data-id')
      this.props.loadQuiz(quizslug)
    }
    this.setState(prevState => {
      return {
        ...prevState,
        quizactive: !prevState.quizactive
      }
    })
    document.querySelector('body').className = 'overflow';
  }
  closeQuiz(success) {
    this.setState(prevState => {
      return {
        ...prevState,
        quizactive: !prevState.quizactive
      }
    })
    if(success) {
      document.location.reload();
    }
    document.querySelector('body').className = '';
  }

  async markAsRead(id, lang) {
    await api.markLearningArticleAsRead(id, lang)
  }
  openVideo(e) {
    let videoURL = e.target.getAttribute('data-video')
    let modulename = e.target.getAttribute('data-modulename')
    let articlename = e.target.getAttribute('data-articlename')
    let articleID = e.target.getAttribute('data-id')
    this.setState(prevState => {
      return {
        ...prevState,
        videoactive: !prevState.videoactive
      }
    })
    this.setState({
      currentvideo: videoURL,
      modulename: modulename,
      articlename: articlename
    })
    this.markAsRead(articleID, this.props.lang)
    this.modalVideo.current.load();
    document.querySelector('body').className = 'overflow';
  }
  closeVideo() {
    this.setState(prevState => {
      return {
        ...prevState,
        videoactive: !prevState.videoactive,
      }
    })
    this.setState({
      currentvideo: "",
      modulename: "",
      articlename: ""
    })
    document.location.reload();
    document.querySelector('body').className = '';
  }

  getThemeNav() {
    const { topic, t, lang } = this.props
    // const subcategory = post.subcategory
    const prev_topic = topic.prev_topic
    const next_topic = topic.next_topic

    return (
      <div className="theme--nav nav-black">
        <Container>
          <Row>
            <Col>
              <ul>
                <li className={prev_topic ? "prev" : "prev --disabled"}>
                  {prev_topic ?
                    (
                      <ul className="prev-post">
                        <li>
                          <span className="headline">{textTruncate(prev_topic.name, true, 4, "...")}</span>
                          <span className="description">{textTruncate(prev_topic.description, true, 7, "...")}</span>
                          {prev_topic.fields.image ?
                            (<span className="img"><img src={prev_topic.fields.image} alt="preview prev" /></span>) :
                            (null)
                          }
                        </li>
                      </ul>
                    )
                    : (null)}
                  <i className="icon-arrow-left" />
                  {prev_topic ? (
                    <Link href={`/${lang}/learning/topic/${prev_topic.term_id}`}>
                      {t("Vorheriger Kurs")}
                    </Link>
                  ) : (
                      `${t("Vorheriger Kurs")}`
                    )}
                </li>
                <li className="back">
                  <i></i>
                  <Link href={`/${lang}/learning/topics`}>
                    {t("Zur Kursübersicht")}
                  </Link>
                </li>
                <li className={next_topic ? "next" : "next --disabled"}>
                  {next_topic ? (
                    <Link href={`/${lang}/learning/topic/${next_topic.term_id}`}>
                      {t("Nächster Kurs")}
                    </Link>
                  ) : (
                      `${t("Nächster Kurs")}`
                    )}
                  <i className="icon-arrow-right" />
                  {next_topic ?
                    (
                      <ul className="next-post">
                        <li>
                          <span className="headline">{textTruncate(next_topic.name, true, 4, "...")}</span>
                          <span className="description">{textTruncate(next_topic.description, true, 7, "...")}</span>
                          {next_topic.fields.image ?
                            (<span className="img"><img src={next_topic.fields.image} alt="preview next" /></span>) :
                            (null)
                          }
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

  getTopicName() {
    return typeof this.props.topic === "undefined" ? null : this.props.topic.name
  }

  renderModuleArticles(quizevent, videoevent, modulename, lang, t, item, key) {
    return (
      <li 
        className={`${typeof item.is_quiz !== "undefined" && item.is_quiz ? "quiz" : ""} ${item.is_read ? "done" : ""}`} 
        key={key}>
        {typeof item.is_quiz !== "undefined" && item.is_quiz ?
          (
            <span data-id={item.ID} className="title" onClick={quizevent}>{item.post_title}</span>
          ) : typeof item.is_video !== "undefined" && item.is_video ?
          (
            <span data-id={item.ID} data-modulename={modulename} data-articlename={item.post_title} data-video={`${typeof item.fields.video_id !== "undefined" && item.fields.video_id ? item.fields.video_url : ""}`}  className="title" onClick={videoevent}>{item.post_title}</span>
          ) : (
            <Link href={`/${lang}/learning/article/` + item.ID}>
              <span>{item.post_title}</span>
            </Link>
        )}
        {item.is_new && <span className="badge-new">{t("NEU")}</span>}
        <span className="time"><i className="icon icon-clock"></i><span>{item.fields.reading_time} Min.</span></span>
        {typeof item.is_quiz !== "undefined" && item.is_quiz ?
          (
            <span className="status icon icon-trophy">{item.is_read ? (<span className="icon-ico-state-done"></span>) : (null)}</span>
          ) : typeof item.is_video !== "undefined" && item.is_video ? 
          (
            <span className="status icon icon-video-play">{item.is_read ? (<span className="icon-ico-state-done"></span>) : (null)}</span>
          ) :
          (
            <span className="status icon icon-articles">{item.is_read ? (<span className="icon-ico-state-done"></span>) : (null)}</span>
          )}
      </li>
    )
  }

  getModules() {
    const { modules,t,lang} = this.props
    const quizevent = this.openQuiz
    const videoevent = this.openVideo

    return modules.map((module,index) => {
      const quizArticles = module.articles.filter(function(item) {
        return item.is_quiz === true
      })
      const quizDoneArticles = module.articles.filter(function (item) {
        return item.is_quiz === true && item.is_read === true
      })

      const learningProgress = ((module.read_articles > module.number_articles ? module.number_articles : module.read_articles) * 100) / module.number_articles

      return (
        <div className={`
        ${styles.Module}
        module
        ${!module.is_available ? 'is-closed' :
        module.is_available && !module.is_read && module.read_articles === 0 ? 'is-available' :
        module.is_available && module.is_read ? 'is-done' : 'in-progress'}
        `} key={module.term_id}>
          {module.is_final_quiz ?
          (
            <div className="teaser teaser-last">
              <div className="count-holder">
                <span><i className="icon-trophy"></i></span>
              </div>
              <div className="teaser-content">
                <div className="content-holder">
                  <h3 id={`anchor${index}`} className="headline">{module.name}</h3>
                  <p className="description">{module.description}</p>
                </div>
                <div className={`
                info-holder
                ${!module.is_available ? 'is-closed' :
                    module.is_available && !module.is_read && module.read_articles === 0 ? 'is-available' :
                      module.is_available && module.is_read ? 'is-done' : 'in-progress'}
              `}>
                  <div data-id={module.articles[0].ID} className="button-holder" onClick={this.openQuiz}>
                    <div className="button  button--purple button--small button--inline button--none">
                      <a>
                        <span>{t("Quiz starten")}</span><i className="button__icon icon--default" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : module.is_standalone_video ? (
              <div className="teaser teaser-standalone_video">
                <div className="count-holder">
                  <span><i className="icon-video-play"></i></span>
                </div>
                <div className="teaser-content">
                  <div className="content-holder">
                    <h3 id={`anchor${index}`} className="headline">{module.name}</h3>
                    <p className="description">{module.description}</p>
                  </div>
                  <div className={`
                info-holder
                ${!module.is_available ? 'is-closed' :
                      module.is_available && !module.is_read && module.read_articles === 0 ? 'is-available' :
                        module.is_available && module.is_read ? 'is-done' : 'in-progress'}
              `}>
                    <div data-id={module.articles[0].ID} data-modulename={module.name} data-articlename={module.articles[0].post_title} data-video={`${typeof module.articles[0].fields.video_id !== "undefined" && module.articles[0].fields.video_id ? module.articles[0].fields.video_url : ""}`} className="button-holder" onClick={this.openVideo}>
                      <div className="button  button--purple button--small button--inline button--none">
                        <a>
                          <span>{t("Video abspielen")}</span><i className="button__icon icon--default" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="teaser">
              <div className="count-holder">
                <span>{index+1}</span>
              </div>
              <div className="teaser-content">
                <div className="content-holder">
                  <h3 id={`anchor${index}`} className="headline">{module.name}</h3>
                  <p className="description">{module.description}</p>
                  <ul className="meta">
                    {module.is_new && <li className="badge-new">{t("NEU")}</li>}
                    <li><i className="icon-userlevel"></i><span>{module.fields.difficulty}</span></li>
                    <li><i className="time icon icon-clock"></i><span>{module.fields.reading_time} Min.</span></li>
                    <li className="action-print has-icon col">
                      <a value={module.term_id} href={module.term_id} onClick={e => this.fetchArticles(e)}>
                        <span className="icon-block">
                          <i className="icon icon-print" />
                        </span>
                        <span className="title">{t("Modul drucken")}</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className={`
                  info-holder
                  ${!module.is_available ? 'is-closed' :
                  module.is_available && !module.is_read && module.read_articles === 0 ? 'is-available' :
                  module.is_available && module.is_read ? 'is-done' : 'in-progress'}
                `}>
                  <div className="info">
                    <ul>
                      <li className="status"><i className={`
                        ${!module.is_available ? 'icon-ico-state-locked' :
                          module.is_available && !module.is_read && module.read_articles === 0 ? 'icon-ico-state-todo' :
                          module.is_available && module.is_read ? 'icon-ico-state-done' : 'icon-ico-state-wip'}
                      `}></i></li>
                      <li className="articles"><i className="icon-articles"></i><span>{module.read_articles > module.number_articles ? module.number_articles : module.read_articles}/{module.number_articles}</span></li>
                      <li className="quiz">
                        <i className="icon-trophy"></i>
                        <span>{quizDoneArticles.length}/{quizArticles.length}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="progress">
                    <span style={{ width: learningProgress + "%" }}>
                      {Math.floor(learningProgress)}%
                    </span>
                  </div>
                  <div className="button-holder" onClick={(e) => !module.is_available ? (null) : (this.slideToggle(e))}>
                    <div className="button  button--purple button--small button--inline button--none">
                      <a>
                        <span>{t("Artikel einblenden")}</span><span className="is-open">{t("Artikel ausblenden")}</span><i className="button__icon icon--default" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="articles-list">
                <div className="list-items">
                  <ul>
                    {module.articles.map(this.renderModuleArticles.bind(null, quizevent, videoevent, module.name, lang, t))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    })
  }

  renderAnchorNav() {
    const { modules } = this.props

    return modules.map((module, index) => {
      return (
        <li className={`
        ${!module.is_available ? 'is-closed' :
            module.is_available && !module.is_read && module.read_articles === 0 ? 'is-available' :
              module.is_available && module.is_read ? 'is-done' : 'in-progress'}
        `} key={module.term_id}>
          <a data-scroll href={`#anchor${index}`}>
            <span className="count">{index+1}</span>
            <span>{module.name}</span>
          </a>
        </li>
      )
    })
  }

  getArticlesList() {
    const { articles } = this.props
    return articles.posts.map((post, index) => {
      return (
        <li key={post.ID}><span>{`${index+1}.`}</span><span>{post.post_title}</span></li>
      )
    })
  }

  getArticles() {
    const { articles } = this.props
    return articles.posts.map(post => {
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
    const { error, fetching, modules, quizpost, lang, t } = this.props
    // if(this.props.userdata.user === undefined) {
    //   return null
    // }
    if (typeof this.props.topic === "undefined") {
      return null
    }

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

    const articleCount = modules.reduce((acc, item) => {
      acc.total = acc.total + item.number_articles
      acc.read = acc.read + item.read_articles

      return acc
    }, {total: 0, read: 0})

    const learningProgress = ((articleCount.read > articleCount.total ? articleCount.total : articleCount.read) * 100) / articleCount.total

    const doneModules = modules.filter((item) => {
      return item.is_read === true
    })
    // const availableModules = modules.filter((item) => {
    //   return item.is_available === true
    // })
    const wipModules = modules.filter((item) => {
      return item.is_available === true && item.read_articles > 0
    })
    let modulesNames = [];
    modules.forEach((item, i, arr) => {
      modulesNames.push(item.name)
    })
    let currentDate = new Date()
    let month = currentDate.getMonth() + 1
    let day = currentDate.getDate()
    let year = currentDate.getFullYear()
    currentDate = day + "." + month + "." + year

    return (
      <div>
        <Loader active={this.props.fetching} />
        <Col className={`modal-print ${this.state.isPrinting ? "is-active" : ""}`}>
          <button onClick={this.closePrint}><i className="icon icon-close"></i></button><div>{t("Druckfunktion wird geladen...")}</div>
        </Col>
        <Col className={`modal-print ${this.state.isGlobalPrinting ? "is-active" : ""}`}>
          <button onClick={this.closeGlobalPrint}><i className="icon icon-close"></i></button><div>{t("Druckfunktion wird geladen...")}</div>
        </Col>
        <Col className={`modal-video ${this.state.videoactive ? "is-active" : ""}`}>
          <div className="video_container">
            <div className="head">
              <div className="title">
                <span>{this.state.modulename}</span>
                <i className="icon-arrow-right"></i>
                <span>{this.state.articlename}</span>
              </div>
              <button onClick={this.closeVideo}><i className="icon icon-close"></i></button>
            </div>
            <div className="inner">
              <video controls autoPlay name="media" ref={this.modalVideo}>
                  <source src={this.state.currentvideo} type="video/mp4"></source>
              </video>
            </div>
          </div>
        </Col>
        {!this.props.fetching ?
        (
          <Certificate username={this.state.username} topicname={this.props.topic.name} modulesNames={modulesNames} currentDate={dateToString(this.props.topic.completed_at, lang, ' | ')} isCrtPrinting={this.state.isCrtPrinting} closeCrtPrint={this.closeCrtPrint} />
        ) : (null)}
        <div className={`${styles.IntroBlock} intro-block`}>
          <Container>
            <Row className="row-fluid">
              <Col md={10} xl={6} className="col-left">
                <div className="wp-content">
                  <Row className="row-fluid">
                    <Col>
                      <div className="text_column">
                        <h1 className="headline" dangerouslySetInnerHTML={{ __html: this.props.topic.name }} />
                        <p className="description no-margin" dangerouslySetInnerHTML={{ __html: this.props.topic.description }} />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={2} xl={3} offsetXl={1} className="col-right">
                <div className="image-holder">
                  <img src={graphicAcademyMed} alt="Academy" />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        {this.state.isPrinting || this.state.isGlobalPrinting ?
        (<table className="print-table">
          <thead><tr><td>
            <div className="header-space">&nbsp;</div>
          </td></tr></thead>
          <tbody><tr><td>
            {this.state.isPrinting && !this.props.fetching ?
              (
                <div className={styles.Modules}>
                  <div className="inside">
                    <Container className="modules-contents">
                      <Row className="row-fluid">
                        <Col>
                          <p className="title-print">{t("Übersicht Artikel")}</p>
                          <ul className="table-of-contents" >
                            {this.getArticlesList()}
                          </ul>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                  <div className="inside">
                    <Container className="modules-list">
                      <Row className="row-fluid">
                        <Col>
                          {this.getArticles()}
                          {this.doPrint()}
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </div>
              ) :
              (
                <div className={styles.Modules}>
                  <div className="inside">
                    {this.getThemeNav()}
                    <div className={`${styles.FilterBar} filter-bar`}>
                      <Container>
                        <Row className="row-fluid" justifyContent="between" alignItems="center">
                          <Col className="progress-info" lg={4}>
                            <div className="progress">
                              <p>
                                <i className="icon-modules"></i><span><b>{doneModules.length > modules.length ? modules.length : doneModules.length}/{modules.length}</b> {t("Module erledigt")} <span className="additional">| <b>{modules.length - doneModules.length}</b> {t("Module in Bearbeitung")}</span></span>
                              </p>
                            </div>
                            <div className="status">
                              <span style={{ width: learningProgress + "%" }}>
                                {Math.floor(learningProgress)}%
                              </span>
                            </div>
                          </Col>
                          <Col className="status-info" lg={4}>
                            <ul>
                              <li className="closed"><i></i><span>{t("Gesperrt")}</span></li>
                              <li className="available"><i></i><span>{t("Verfügbar")}</span></li>
                              <li className="wip"><i></i><span>{t("In Bearbeitung")}</span></li>
                              <li className="done"><i></i><span>{t("Erledigt")}</span></li>
                            </ul>
                          </Col>
                          <Col className="action-print has-icon col" lg={4}>
                            <a onClick={this.doGlobalPrint}>
                              <span className="icon-block">
                                <i className="icon icon-print" />
                              </span>
                              <span className="title">{t("Thema drucken")}</span>
                            </a>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                    <Container className="modules-list">
                      <Row className="row-fluid">
                        <Col md={8}>
                           <p className="title-print">{t("Übersicht Modul")}</p>
                          {this.getModules()}
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </div>
              )
            }
          </td></tr></tbody>
          <tfoot><tr><td>
            <div className="footer-space">&nbsp;</div>
          </td></tr></tfoot>
        </table>
        ) : (
          <div className={styles.Modules}>
            <div className="inside">
              {this.getThemeNav()}
                <div className={`${styles.FilterBar} filter-bar ${Math.floor(learningProgress) === 0 ? 'is-available' : Math.floor(learningProgress) >= 1 && Math.floor(learningProgress) <= 99 ? 'in-progress' : 'done'}`}>
                <Container>
                  <Row className="row-fluid" justifyContent="between" alignItems="center">
                    <Col className="progress-info" lg={4}>
                      <div className="progress">
                        <p>
                          <i className="icon-modules"></i>
                          <span>
                            <b>{doneModules.length > modules.length ? modules.length : doneModules.length}/{modules.length}</b> {modules.length > 1 ? t("Modulen erledigt") : t("Modul erledigt")} 
                            <span className="additional">| <b>{wipModules.length - doneModules.length}</b> {wipModules.length - doneModules.length === 1 ? t("Modul in Bearbeitung") : t("Module in Bearbeitung")}</span>
                          </span>
                        </p>
                      </div>
                      <div className="status">
                          <span className="percent" style={{ width: learningProgress + "%" }}>
                          {Math.floor(learningProgress)}%
                        </span>
                      </div>
                    </Col>
                    <Col className="status-info" lg={4}>
                      <ul>
                        <li className="closed"><i></i><span>{t("Gesperrt")}</span></li>
                        <li className="available"><i></i><span>{t("Verfügbar")}</span></li>
                        <li className="wip"><i></i><span>{t("In Bearbeitung")}</span></li>
                        <li className="done"><i></i><span>{t("Erledigt")}</span></li>
                      </ul>
                    </Col>
                    <Col className="action-print has-icon col" lg={4}>
                      {learningProgress === 100 ?
                      (
                        <a onClick={this.doCrtPrint}>
                          <span className="icon-block">
                            <i className="icon icon-cert-download" />
                          </span>
                          <span className="title">{t("Zertifikat herunterladen")}</span>
                        </a>
                      ) : (null)
                      }
                      <a onClick={this.doGlobalPrint}>
                        <span className="icon-block">
                          <i className="icon icon-print" />
                        </span>
                        <span className="title">{t("Thema drucken")}</span>
                      </a>
                    </Col>
                  </Row>
                </Container>
              </div>
              <Container className="modules-list">
                <Row className="row-fluid">
                  <Col lg={8}>
                    <p className="title-print">{t("Übersicht Modul")}</p>
                    {this.getModules()}
                  </Col>
                  <Col lg={4} className="sidebar sidebar-anchors">
                    <nav className="nav-anchor learning">
                      <p className="title icon">{t("Lernfortschritt")}</p>
                      <div>{this.renderAnchorNav()}</div>
                    </nav>
                  </Col>
                  {!fetching && this.state.quizactive ?
                  (
                    <div className={`quiz-modal ${this.state.quizactive ? "active" : ""}`}>
                      <Quiz fetching={fetching} postID={quizpost.ID} topicslug={quizpost.topic.ID} questions={quizpost.quiz} modulename={quizpost.module.name} quizname={quizpost.post_title} quizdescription={quizpost.quiz.description} closeQuiz={this.closeQuiz} questionslength={quizpost.quiz.questions.length} />
                    </div>
                  ) : (null)}
                </Row>
              </Container>
            </div>
          </div>
        )}
        <div className="page-footer">
          <Container>
            <Row className="d-print-block">
              <Col><p>{this.props.topic.name}</p></Col>
            </Row>
          </Container>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.learningmodules,
    lang: state.app.lang
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadArticles: (moduleslug) =>
      dispatch(Creators.articlesRequest(moduleslug)),
    loadQuiz: (quizslug) =>
      dispatch(Creators.quizRequest(quizslug))
  }
}

// export default connect(mapStateToProps)(LearningModules)
LearningModules = connect(mapStateToProps, mapDispatchToProps)(LearningModules)
export default translate()(LearningModules)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
