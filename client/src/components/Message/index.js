import React, {PureComponent} from "react"
import PropTypes from "prop-types"

import styles from "./styles.css"

export default class Message extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    warning: PropTypes.bool,
    info: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.bool,
  }

  static defaultProps = {
    className: "",
    warning: false,
    info: false,
    success: false,
    error: false,
  }

  render() {
    const {className, warning, info, success, error} = this.props

    let classList = [styles.Box, className]

    if(warning) classList.push(styles.Warning)
    if(info) classList.push(styles.Info)
    if(success) classList.push(styles.Success)
    if(error) classList.push(styles.Error)

    return (
      <div className={classList.join(" ")}>
        {this.props.children}
      </div>
    )
  }
}
