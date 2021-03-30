import React, {Component} from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { translate } from "react-i18next"

import styles from "./styles.css"

class SearchForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    handleSubmit: () => {},
    className: ""
  }

  state = {
    term: ""
  }

  constructor(props) {
    super(props)

    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleSubmit(e) {
    e.preventDefault()
    this.props.handleSubmit(this._SearchField.value)
  }

  render() {
    const {active, className, t} = this.props
    let searchInputClassList = [styles.SearchInput]

    if (active) {
      searchInputClassList.push("active")
    }

    return (
      <form
        className={`${styles.search_form} ${className}`}
        onSubmit={this._handleSubmit}
      >
        <input
          className="input"
          ref={field => (this._SearchField = field)}
          placeholder={t("Neuen Suchbegriff eingeben...")}
          type="text"
        />
        <button className="submit icon-search-thin" />
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

// export default SearchForm
SearchForm = connect(mapStateToProps)(SearchForm)
export default translate()(SearchForm)
