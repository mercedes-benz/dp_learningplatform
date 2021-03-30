import React, {Component} from "react"

import styles from "./styles.css"

class ScrollButton extends Component {
  doScrolling() {
    let {target, duration} = this.props

    let startingY = window.pageYOffset
    let scrollValue
    if (window.innerWidth < 768) {
      scrollValue = window.pageYOffset + window.innerHeight - 60
    } else if (window.innerWidth < 1199) {
      scrollValue = window.pageYOffset + window.innerHeight - 60
    } else {
      scrollValue = window.pageYOffset + window.innerHeight - 97
    }

    let diff

    if (target) {
      let elementY =
        window.pageYOffset +
        document.querySelector(target).getBoundingClientRect().top
      let targetY =
        document.body.scrollHeight - elementY < window.innerHeight
          ? document.body.scrollHeight - window.innerHeight
          : elementY
      diff = targetY - startingY
      if (!diff) return
    }

    let easing = function(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }
    let start

    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp
      let time = timestamp - start
      let percent = Math.min(time / duration, 1)
      percent = easing(percent)

      if (target) {
        window.scrollTo(0, startingY + diff * percent)
      } else {
        window.scrollTo(0, scrollValue * percent)
      }
      if (time < duration) {
        window.requestAnimationFrame(step)
      }
    })
  }

  render() {
    let {icon} = this.props
    return (
      <button
        className={styles.ScrollTo + " " + icon}
        onClick={() => {
          this.doScrolling()
        }}
      />
    )
  }
}

export default ScrollButton
