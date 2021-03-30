import React, {Component} from "react"

import styles from "./styles.css"

class ScrollButton extends Component {
  constructor() {
    super()

    this.state = {
      intervalId: 0
    }
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId)
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx)
  }

  scrollToTop() {
    let intervalId = setInterval(
      this.scrollStep.bind(this),
      this.props.delayInMs
    )
    this.setState({intervalId: intervalId})
  }

  render() {
    return (
      <button
        title="Back to top"
        className={styles.Scroll_to_top + " icon-dropdown-arrow"}
        onClick={() => {
          this.scrollToTop()
        }}
      />
    )
  }
}

export default ScrollButton
