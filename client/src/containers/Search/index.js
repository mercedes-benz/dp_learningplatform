import React, {Component} from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {push} from "redux-little-router"
import { Link } from "redux-little-router"
import { translate } from "react-i18next"

import ReactPaginate from 'react-paginate';

import {SearchCreators as Creators} from "./redux"
import {Container, Row, Col} from "../../components/Grid"
import SearchForm from "../../components/SearchForm"
import Button from "../../components/Button"

import { formatReadingTime } from "../../utils"

import styles from "./styles.css"

class Search extends Component {
  state = {
    active: false,
    formValue: ""
  }

  constructor(props) {
    super(props)

    this._handleSubmit = this._handleSubmit.bind(this)
    this._loadMore = this._loadMore.bind(this)
    this._handlePageClick = this._handlePageClick.bind(this)
  }

  static propTypes = {
    error: PropTypes.string,
    fetching: PropTypes.bool,
    results: PropTypes.array.isRequired
  }

  static defaultProps = {
    results: [],
    fetching: false,
    error: null
  }

  componentDidMount() {
    const query = this.props.router.query.q

    if (typeof query === "undefined") return

    try {
      const decodedQuery = decodeURI(query)
      this.setState(prevState => {
        return {
          ...prevState,
          formValue: decodedQuery
        }
      })
    } catch (error) {
      this.setState(prevState => {
        return {...prevState, formValue: query}
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.router.query.q !== this.props.router.query.q &&
      typeof this.props.router.query.q !== "undefined"
    ) {
      try {
        const decodedQuery = decodeURI(this.props.router.query.q)

        this.setState(prevState => {
          return {
            ...prevState,
            formValue: decodedQuery
          }
        })
      } catch (error) {
        this.setState(prevState => {
          return {...prevState, formValue: this.props.router.query.q}
        })
      }
    }
  }

  getSearched() {
    const {results,t, lang} = this.props

    return results.map(result => {
      return (
        <Col md={6} lg={4} className={styles.Result} key={`result-${result.ID}`}>
          <div className={`teaser ${result.post_type}`}>
            {result.post_type === 'knowledge' ?
              (
                <Link className="teaser-link"
                  href={`/${lang}/knowledge/article/${result.ID}`}
                ></Link>
              ) : (
                <Link className="teaser-link"
                  href={`/${lang}/learning/article/${result.ID}`}
                ></Link>
              )}
            <h4 className="headline headline--desktop">
              {result.post_title}
            </h4>
            <p className="description" dangerouslySetInnerHTML={{ __html: result.post_excerpt }} />
            <div className="tags">
              {
                result.fields.tag.map((tag, index) =>
                  <p key={`tag-${index}`}>{tag}</p>
                )
              }
            </div>
            <div className="actions">
              <p className="time icon icon-clock">
                <span>{formatReadingTime(result.fields.reading_time)}</span>
              </p>
              {result.post_type === 'knowledge' ?
                (
                  <Button
                    theme="cyan"
                    size="small"
                    to={`/${lang}/knowledge/article/${result.ID}`}
                  >
                    {t("Lesen")}
                  </Button>
                ) : (
                  <Button
                    theme="purple"
                    size="small"
                    to={`/${lang}/learning/article/${result.ID}`}
                  >
                    {t("Lesen")}
                  </Button>
                )}
            </div>
          </div>
        </Col>
      )
    })
  }

  _handleSubmit(term) {
    const { lang } = this.props
    this.setState({formValue: term})
    this.props.push(`/${lang}/search?q=${encodeURI(term)}`)
  }

  _loadMore(term) {
    this.props.moreResults(
      this.state.formValue,
      this.props.results.length,
      true
    )
  }

  // handlePageClick = data => {
  _handlePageClick(page) {
    const { query_vars } = this.props
    let selected = page.selected;
    let offset = Math.ceil(selected * query_vars.posts_per_page);
    this.props.moreResults(
      this.state.formValue,
      offset,
      false
    )
    // this.setState({ offset: offset }, () => {
    //   this.loadCommentsFromServer();
    // });
  };

  render() {
    const { fetching, results, query_vars, others, t} = this.props

    return (
      <div>
        <Container className={styles.Container}>
          <Row>
            <Col>
              {this.state.formValue !== "" ? (
                <h1>{t("Suche nach")} '{this.state.formValue}'</h1>
              ) : (
                <h1>{t("Suche")}</h1>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <SearchForm
                className={styles.Form}
                handleSubmit={this._handleSubmit}
              />
            </Col>
          </Row>
        </Container>
        <div className={styles.Results}>
          <div className="inside">
            <Container className="container-main">
              <Row className={styles.ResultsRow}>
                {typeof query_vars.posts_found !== "undefined" && (
                  <h3 className={styles.PostsFound}>
                    {t("Es wurden")} {query_vars.posts_found} {t("Einträge gefunden")}
                  </h3>
                )}
                {typeof query_vars.posts_found !== "undefined" && (
                  <div className="counter">
                    <p>{t("Ergebnisse")}:
                      {query_vars.posts_found > 9 ?
                        (
                          <strong>{query_vars.offset + 1}-{query_vars.offset + results.length} </strong>
                        ) :
                        (
                          <strong>{query_vars.offset + 1}-{query_vars.posts_found} </strong>
                        )
                      }
                      {t("von")} {query_vars.posts_found}
                    </p>
                  </div>
                )}
                <div className={styles.ResultsWrapper}>
                  {this.getSearched()}

                  {query_vars.posts_found > query_vars.posts_per_page && (
                    <div className="pagina-block">
                      <div className="inner">
                        <div className="counter">
                          <p>Ergebnisse:
                          {query_vars.offset + query_vars.posts_per_page > query_vars.posts_found ?
                              (<strong>{query_vars.offset + 1}-{query_vars.offset + results.length} </strong>) :
                              (<strong>{query_vars.offset + 1}-{query_vars.offset + query_vars.posts_per_page} </strong>)
                            }
                            von {query_vars.posts_found}
                          </p>
                        </div>
                        <ReactPaginate
                          previousLabel={<i className="icon-prev"></i>}
                          nextLabel={<i className="icon-next"></i>}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          pageCount={query_vars.max_num_pages}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={this._handlePageClick}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'}
                        />
                      </div>
                    </div>
                  )}

                  {query_vars.posts_found > results.length && (
                    <Button
                      className={`${styles.LoadMoreButton} ${
                        fetching ? "fetching" : ""
                      }`}
                      onClick={this._loadMore}
                      theme="cyan"
                      alignment="center"
                    >
                      {t("Weitere Suchergebnisse")}
                    </Button>
                  )}
                </div>
              </Row>
            </Container>
            <Container className="container-main">
              <Row className={styles.ResultsOthers}>
                {others.posts_found > 0 && (
                  <div className="otherbox">
                    <div className="inner">
                      <i className="icon-tip"></i>
                      <div className="text">
                        <h3>{t("Suchergebnisse im Lernbereich")}</h3>
                        <p>{t("Für den Suchbegriff")} <strong>"{this.state.formValue}"</strong> {t("gibt es in unserem Lernbereich weiter")} <strong>{others.posts_found}</strong> {t("Treffer. Schau' mal rein!")}</p>
                      </div>
                      <Button
                        className=""
                        theme="purple"
                        href="/de/learning/topics"
                      >
                        {t("Zur Übersicht")}
                      </Button>
                    </div>
                  </div>
                )}
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
    router: state.router,
    ...state.search,
    lang: state.app.lang
  }
}

const mapDispatchToProps = dispatch => {
  return {
    moreResults: (term, offset, append) =>
      dispatch(Creators.request(term, offset, append)),
    push: location => dispatch(push(location))
  }
}

// export default connect( mapStateToProps, mapDispatchToProps)(Search)
Search = connect(mapStateToProps, mapDispatchToProps)(Search)
export default translate()(Search)

export {reducer} from "./redux"
export {default as sagas} from "./sagas"
