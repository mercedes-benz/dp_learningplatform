import React, {Component} from "react"
import PropTypes from "prop-types"
import {Link} from "redux-little-router"

import styles from "./styles.css"

export default class Button extends Component {
  static propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    className: PropTypes.string,
    alignment: PropTypes.oneOf(["inline", "left", "center", "right"]),
    icon: PropTypes.oneOf([
      "none",
      "default",
      "default-small",
      "link",
      "download",
      "phone",
      "mail"
    ]),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    theme: PropTypes.oneOf(["white", "light", "dark", "cyan", "purple"]),
    onClick: PropTypes.func,
    target: PropTypes.string
  }

  static defaultProps = {
    to: "/",
    href: null,
    className: "",
    alignment: "inline",
    icon: "default",
    size: "medium",
    theme: "light",
    onClick: null
  }

  render() {
    const {
      className,
      alignment,
      icon,
      size,
      theme,
      to,
      href,
      onClick,
      target
    } = this.props

    return (
      <div
        className={`${
          styles.Button
        } button ${className} button--${theme} button--${size} button--${alignment} button--${icon}`}
      >
        {onClick ? (
          <button onClick={onClick}>
            {this.props.children}
            <i className={`button__icon icon--${icon}`} />
          </button>
        ) : href !== null ? (
          <a href={href} target={target}>
            {this.props.children}
            <i className={`button__icon icon--${icon}`} />
          </a>
        ) : (
          <Link href={to} target={target}>
            {this.props.children}
            <i className={`button__icon icon--${icon}`} />
          </Link>
        )}
      </div>
    )
  }
}
