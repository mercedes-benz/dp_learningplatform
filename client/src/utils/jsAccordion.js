export default (clickEl, dropEl, childrenTag = false) => {

  let toggler = document.querySelectorAll(clickEl);
  let dropdowns;
  
  if (toggler.length === 1) {
    toggler[0].onclick = function (e) {
      e.preventDefault();
      if (e.target) {
        let dropdown = e.target.nextElementSibling;
        if (e.target.classList.contains("active")) {
          e.target.classList.remove("active")
          slideUp(dropdown)
        } else {
          e.target.classList.add("active")
          slideDown(dropdown)
        }
        
        if (childrenTag) {
          let children = dropdown.querySelectorAll(childrenTag);
          ;[].forEach.call(children, function (el) {
            el.onclick = function (e) {
              e.preventDefault();
              toggler[0].classList.remove("active")
              slideUp(dropdown)
            }
          });
        }
      }
    }
  } else {
    dropdowns = document.querySelectorAll(dropEl)
    ;[].forEach.call(toggler, function (el) {
      let dropdown = el.nextElementSibling;
      // if (el.classList.contains("active")) {
        // slideDown(dropdown)
      // }
      el.onclick = function (e) {
        e.preventDefault();
        if (e.target) {
          if (e.target.classList.contains("active")) {
            return false;
          }
          if (e.target.classList.contains("is-active")) {
            e.target.classList.remove("is-active")
            slideUp(dropdown)
          } else {
            for (var i = 0; i < toggler.length; i++) {
              toggler[i].classList.remove("is-active")
              dropdowns[i].style.height = "0px"
            }
            e.target.classList.add("is-active")
            slideDown(dropdown)
          }
        }
      }
    })
  }
  
}

const slideDown = (d) => {
  d.classList.add('active')
  // d.style.height = "auto"
  // var height = d.clientHeight + "px"
  // d.style.height = "0px"
  // setTimeout(() => {
  //   d.style.height = height
  // }, 0)
  d.style.height = d.scrollHeight + 'px';
}
const slideUp = (d) => {
  d.style.height = "0px"
  d.addEventListener('transitionend', () => {
    d.classList.remove('active')
  }, { once: true })
}