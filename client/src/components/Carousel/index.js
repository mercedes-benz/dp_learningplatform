import React, {Component} from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Siema from "siema"
import { Link } from "redux-little-router"
import { translate } from "react-i18next"

import Button from "../../components/Button"

import {formatReadingTime} from "../../utils"
import { dateToString } from "../../utils"
import { textTruncate } from "../../utils"

import styles from "./styles.css"

import sliderInactive from "../../assets/icons/slider-arrow-grey.svg"
import sliderActive from "../../assets/icons/slider-arrow.svg"

class Carousel extends Component {
  constructor() {
    super()
    this.renderItems = this.renderItems.bind(this)
    this.initCarousel = this.initCarousel.bind(this)
  }

  static propTypes = {
    className: PropTypes.string,
    perpage: PropTypes.number,
    items: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  }

  static defaultProps = {
    className: "",
    perpage: 3,
    items: [] || {}
  }

  componentDidUpdate() {
    this.initCarousel()
  }

  prev = () => {
    if(this.props.items.length > 0) {
      this.siema.prev()
    }
  }

  next = () => {
    if(this.props.items.length > 0) {
      this.siema.next()
    }
  }

  initCarousel() {
    if (this.props.items.length === 0) {
      return null
    }

    if (this.siema) {
      return null
    }

    let amount
    if (this.props.perpage > 1) {
      if (window.innerWidth < 768) {
        amount = 1
      } else if (window.innerWidth < 1199) {
        amount = 2
      } else {
        amount = this.props.perpage
      }
    }

    this.siema = new Siema({
      duration: 400,
      perPage: amount,
      loop: false
    })

  }

  renderItems(key) {
    const {t,lang} = this.props
    const item = this.props.items[key]
    return (
      <div className="article-item" key={item.ID}>
        <div className="teaser">
          <Link className="teaser-link"
            href={`/${lang}/knowledge/article/${item.ID}`}
          ></Link>
          <div className="teaser-top">
            <p className="supheadline supheadline--desktop">{item.fields.tag}</p>
            <h4 className="headline headline--desktop">
              {item.subcategory.name}: {textTruncate(item.post_title, true, 4, "...")}
            </h4>
            <div className="meta-info info-top">
              {item.comment_count > 0 ?
                (<p className="comments-count"><i className="icon-chatbubble"></i><span>{item.comment_count}</span></p>)
                : (null)}
              <p className="likes"><i className="icon-heart"></i><span>3</span></p>
            </div>
            <p className="description">{textTruncate(item.post_excerpt, true, 10, "...")}</p>
          </div>
          <div className="teaser-bottom">
            <div className="meta-info info-bottom">
              <p className="date icon-clock">
                <span>{dateToString(item.post_date, lang, ' | ')}</span>
              </p>
              <p className="time icon-clock">
                <span>{formatReadingTime(item.fields.reading_time)}</span>
              </p>
            </div>
            <Button theme="purple" size="small" to={`/${lang}/knowledge/article/${item.ID}`}>
              {t("Artikel lesen")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {className, items} = this.props

    return (
      <div className={styles.Carousel}>
        <div className={`siema ${className}`}>
          {Object.keys(items).map(this.renderItems)}
        </div>
        <button className="prev" onClick={this.prev}>
          <img className="inactive" src={sliderInactive} alt="prev" />
          <img className="active" src={sliderActive} alt="prev" />
        </button>
        <button className="next" onClick={this.next}>
          <img className="inactive" src={sliderInactive} alt="next" />
          <img className="active" src={sliderActive} alt="next" />
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

Carousel = connect(mapStateToProps)(Carousel)
export default translate()(Carousel)
// export default Carousel
