import React, {Component} from "react"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import { Link } from "redux-little-router"
import { Col } from "../../../components/Grid"


class Wishlist extends Component {

  renderBookmarks() {
    const { bookmarks, lang} = this.props

    if (bookmarks === undefined) {
      return null
    }

    return bookmarks.map((bookmark, index) => {
      return (
        <Col className={`tile ${bookmark.post_type}`} key={bookmark.ID}>
          <ul>
            <li className="division">
              <span>{bookmark.category.name}</span>
              <span>{bookmark.subcategory.name}</span>
            </li>
            <li className="title">
              {bookmark.post_type === "knowledge" ?
                (
                  <Link className="teaser-link"
                    href={`/${lang}/knowledge/article/${bookmark.ID}`}
                  >{bookmark.post_title}</Link>
                ) :
                (
                  <Link className="teaser-link"
                    href={`/${lang}/learning/article/${bookmark.ID}`}
                  >{bookmark.post_title}</Link>
                )
              }
              <button className="remove" onClick={(e) => this.props.removeBookmark(e, bookmark.ID, lang, bookmark.post_type)}>
                <span className="icon-block">
                  <i className="icon-list"></i><span className="count">-</span>
                </span>
              </button>
            </li>
            <li className="tags">
              {
                bookmark.fields.tag && bookmark.fields.tag !== 'undefined' ?
                  (
                    bookmark.fields.tag.map((tag, index) =>
                      <span key={`tag-${index}`}>{tag}</span>
                    )
                  ) : (null)
              }
            </li>
          </ul>
        </Col>
      )
    })
  }

  render() {
    const { bookmarks, num_bookmarks, lang, t } = this.props

    if (bookmarks === undefined) {
      return null
    }

    return (
      <Col lg={8} className="wishlist">
        <div className="card">
          <div className="filter">
            <h3 className="headline">{t("Meine Lesezeichen")}</h3>
            <div className="amount">
              <p className="title">{t("Anzahl der Artikel")}:</p>
              <div className="dropdown">
                <p className="title">{num_bookmarks.num_bookmarks || 0}</p>
              </div>
            </div>
            <button className="remove" onClick={(e) => this.props.removeAllBookmarks(e, lang, ".tiles")}>
              <span className="icon-block">
                <i className="icon-list"></i><span className="count">-</span>
              </span>
              <span className="text">{t("Alle Artikel entfernen")}</span>
            </button>
            <p className="description">{t("Die folgenden Artikel hast du dir in der Bibliothek als Lesezeichen gespeichert.")}</p>
          </div>
          <div className="tiles">
            {this.renderBookmarks()}
          </div>
        </div>
      </Col>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

Wishlist = connect(mapStateToProps)(Wishlist)
export default translate()(Wishlist)
