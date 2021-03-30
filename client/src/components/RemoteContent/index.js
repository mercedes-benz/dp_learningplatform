import React, {Component} from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { translate } from "react-i18next"
import * as basicLightbox from "basiclightbox"

import "basiclightbox/dist/basicLightbox.min.css"
import "./styles.css"

// export default class RemoteContent extends Component {
class RemoteContent extends Component {
  state = {
    showSidebar: false
  }
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: "wp-content",
  }

  initVideos() {
    const videos = document.querySelectorAll(".video video.mejs__player")

    videos.forEach((video) => {
      new window.MediaElementPlayer(video, {
        renderers: ["html5"],
        stretching: "responsive",
      })
    })
  }

  initLightbox() {
    const getSrc = (elem) => elem.getAttribute('data-src')
    const getPrev = (elem) => document.getElementById(elem.getAttribute('data-prev'))
    const getNext = (elem) => document.getElementById(elem.getAttribute('data-next'))
    const open = function(elem) {
      // elem = img
    	const init = (instance) => {
        // instance.element() = basicLightbox
    		instance.element().querySelector('img').src = ''
    		instance.element().querySelector('img').src = getSrc(elem)
        const close = instance.element().querySelector('#close')
    		const prev = instance.element().querySelector('#prev')
    		const next = instance.element().querySelector('#next')
    		prev.onclick = (e) => {
    			elem = getPrev(elem)
    			init(instance)
    		}
    		next.onclick = (e) => {
    			elem = getNext(elem)
    			init(instance)
    		}
        close.onclick = (e) => {
    			instance.close()
        }
    	}
    	basicLightbox.create('<img>', {
        beforePlaceholder: '<button id="prev" class="icon icon-prev">&#8592;</button><button id="close" class="icon icon-quiz-fail-box"></button>',
        afterPlaceholder  : '<button id="next" class="icon icon-next">&#8594;</button>',
        beforeShow: (instance) => {
          let closer = instance.element().querySelector('#close');
          let prev = instance.element().querySelector('#prev');
          let next = instance.element().querySelector('#next');
          let imgcontainer = instance.element().querySelector('.basicLightbox__placeholder');
          imgcontainer.appendChild(closer);
          imgcontainer.appendChild(prev);
          imgcontainer.appendChild(next);
          document.body.classList.add('noScroll');
          init(instance)
          // swipe feature
          let touchstartX = 0;
          let touchendX = 0;
          const gestureZone = instance.element().querySelector('img')
          gestureZone.addEventListener('touchstart', function (event) {
            touchstartX = event.changedTouches[0].screenX;
          }, false);
          gestureZone.addEventListener('touchend', function (event) {
            touchendX = event.changedTouches[0].screenX;
            if (touchendX < touchstartX) {
              // console.log('Swiped left');
              next.click()
            }
            if (touchendX > touchstartX) {
              // console.log('Swiped right');
              prev.click()
            }
            // if (touchendY === touchstartY) {
            //   console.log('Tap');
            // }
          }, false); 
        },
        beforeClose: (instance) => {
          document.body.classList.remove('noScroll');
        }
      }).show()
    }
    Array.prototype.forEach.call(document.querySelectorAll('a.gallery__link'), function(elem) {
      elem.onclick = function(e) {
        e.preventDefault()
        open(elem.querySelector('img'))
      }
    })

    document.querySelectorAll("a.image__link").forEach(function(elem) {
      const href = elem.getAttribute("href")
      const instance = basicLightbox.create(`<img src="${href}">`,{
        beforeShow: (instance) => {
          let closer = instance.element().querySelector('#close');
          let imgcontainer = instance.element().querySelector('.basicLightbox__placeholder');
          imgcontainer.appendChild(closer);
          closer.onclick = (e) => {
      			instance.close()
      		}
        },
        beforePlaceholder: '<button id="close" class="icon icon-quiz-fail-box"></button>',
      })
      elem.onclick = function(e) {
        e.preventDefault()
        instance.show()
      }
    })
  }

  initAccordion() {
    let toggler = document.querySelectorAll(".accordion__panel-heading")
    ;[].forEach.call(toggler, function(el) {
      el.onclick = function(e) {
        if (e.target && e.target.nodeName === "H3") {
          if (e.target.classList.contains("active")) {
            e.target.classList.remove("active")
          } else {
            for (var i = 0; i < toggler.length; i++) {
              toggler[i].classList.remove("active")
            }
            e.target.classList.add("active")
          }
        }
      }
    })
  }
  
  componentDidMount() {
    this.initVideos()
    this.initLightbox()
    this.initAccordion()
  }

  componentDidUpdate() {
    this.initVideos()
    this.initLightbox()
    this.initAccordion()
  }

  shouldComponentUpdate() {
    return true
  }

  componentWillReceiveProps() {
    this.initAccordion()
  }

  render() {
    return (
      <div>
        <div className={this.props.className} dangerouslySetInnerHTML={{__html: this.props.children}} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.lang
  }
}

RemoteContent = connect(mapStateToProps)(RemoteContent)
export default translate()(RemoteContent)
