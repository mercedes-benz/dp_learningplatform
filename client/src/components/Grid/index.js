import React, {Component} from "react"
import PropTypes from "prop-types"

import "./styles.css"

// Utils
// ---
// convert camelCase to hyphens
const cc2h = str => {
  return str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
}

// Container
// ---
const ContainerPropTypes = {
  fluid: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.string
}

const ContainerDefaultProps = {
  fluid: false,
  className: "",
  size: "default"
}

export class Container extends Component {
  render() {
    let className = this.props.fluid
      ? "container-fluid"
      : `container-${this.props.size}`
    className =
      this.props.className.length > 0
        ? `${className} ${this.props.className}`
        : className

    return <div className={className}>{this.props.children}</div>
  }
}

Container.propTypes = ContainerPropTypes
Container.defaultProps = ContainerDefaultProps

// Row
// ---
const RowPropTypes = {
  className: PropTypes.string,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  noGutters: PropTypes.bool
}

const RowDefaultProps = {
  className: "",
  alignItems: "",
  justifyContent: "",
  noGutters: false
}

export class Row extends React.Component {
  render() {
    let className = "row"
    className =
      this.props.className.length > 0
        ? `${className} ${this.props.className}`
        : className
    className =
      this.props.alignItems.length > 0
        ? `${className} align-items-${this.props.alignItems}`
        : className
    className =
      this.props.justifyContent.length > 0
        ? `${className} justify-content-${this.props.justifyContent}`
        : className
    className = this.props.noGutters ? `${className} no-gutters` : className

    return <div className={className}>{this.props.children}</div>
  }
}

Row.propTypes = RowPropTypes
Row.defaultProps = RowDefaultProps

// Column
// ---
const ColPropTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  xl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offset: PropTypes.number,
  offsetSm: PropTypes.number,
  offsetMd: PropTypes.number,
  offsetLg: PropTypes.number,
  offsetXl: PropTypes.number,
  push: PropTypes.number,
  pushSm: PropTypes.number,
  pushMd: PropTypes.number,
  pushLg: PropTypes.number,
  pushXl: PropTypes.number,
  pull: PropTypes.number,
  pullSm: PropTypes.number,
  pullMd: PropTypes.number,
  pullLg: PropTypes.number,
  pullXl: PropTypes.number,
  alignSelf: PropTypes.string,
  flex: PropTypes.string,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  displayFlex: PropTypes.bool
}

const ColDefaultProps = {
  className: "",
  size: 12,
  sm: -1,
  md: -1,
  lg: -1,
  xl: -1,
  offset: -1,
  offsetSm: -1,
  offsetMd: -1,
  offsetLg: -1,
  offsetXl: -1,
  push: -1,
  pushSm: -1,
  pushMd: -1,
  pushLg: -1,
  pushXl: -1,
  pull: -1,
  pullSm: -1,
  pullMd: -1,
  pullLg: -1,
  pullXl: -1,
  alignSelf: "",
  flex: "",
  alignItems: "",
  justifyContent: "",
  displayFlex: false
}

export class Col extends React.Component {
  buildClasses(props) {
    let classes = []

    for (let prop in props) {
      switch (prop) {
        case "size":
          classes.push(`col-${props[prop]}`)
          break

        case "sm":
        case "md":
        case "lg":
        case "xl":
          if (props[prop] !== -1) classes.push(`col-${prop}-${props[prop]}`)
          break

        case "offset":
        case "offsetSm":
        case "offsetMd":
        case "offsetLg":
        case "offsetXl":
        case "push":
        case "pushSm":
        case "pushMd":
        case "pushLg":
        case "pushXl":
        case "pull":
        case "pullSm":
        case "pullMd":
        case "pullLg":
        case "pullXl":
          if (props[prop] !== -1) classes.push(`${cc2h(prop)}-${props[prop]}`)
          break

        case "justifyContent":
        case "alignItems":
        case "alignSelf":
        case "flex":
          if (props[prop].length > 0)
            classes.push(`${cc2h(prop)}-${props[prop]}`)
          break

        case "className":
          if (props[prop].length > 0) classes.push(props[prop])
          break

        case "displayFlex":
          if (props[prop]) classes.push(`${cc2h(prop)}`)
          break

        default:
      }
    }

    return classes
  }

  render() {
    const classes = this.buildClasses(this.props)

    return <div className={classes.join(" ")}>{this.props.children}</div>
  }
}

Col.propTypes = ColPropTypes
Col.defaultProps = ColDefaultProps

// export Grid
const Grid = {
  Container,
  Row,
  Col
}

export default Grid
