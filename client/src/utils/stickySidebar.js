export default (fetching, isSingleContainer) => {
  if (!fetching) {
    if (document.querySelector('.nav-anchor') === null) {
      return null;
    }
    // console.log('init', fetching)
    let currentWidth = window.innerWidth;
    let sidebar = document.querySelector('.sidebar');
    let sidebarNav = sidebar.querySelector('.nav-anchor');
    let sidebarNavLinks = sidebar.querySelectorAll('.nav-anchor a');
    let containerMain,
        anchorHeadline,
        sidebarWidth = 0,
        sidebarHeight = sidebar.scrollHeight + 100,
        // eslint-disable-next-line
        containerMainOffset,
        isTouch = false,
        scrollY;
    let sidebarNavTitle = sidebar.querySelector('.nav-anchor .title');
    let sidebarClientWidth,
        sidebarOffsetLeft;
    let headerHeight = 100,
        heightArr = [];
    let footertHeight = document.querySelector('footer').clientHeight
    let compensationValue,
        containerNextHeight
    let footertOffset

    if (sidebarNavLinks.length > 0) {
      if (isSingleContainer) {
        containerMain = document.querySelector('.container-main');
        anchorHeadline = containerMain.querySelectorAll(".wp-content h2");
      } else {
        containerMain = document.querySelector('.modules-list');
        anchorHeadline = containerMain.querySelectorAll(".teaser .headline");
      }
      anchorHeadline = [].slice.call(anchorHeadline);

      containerMain.classList.remove('hide-sidebar');

      if (currentWidth >= 1400) {
        sidebarOffsetLeft = sidebar.offsetLeft + 5 + (currentWidth - containerMain.clientWidth) / 2 + 'px';
        sidebarClientWidth = sidebar.clientWidth - 30 + 'px'
      } else if (currentWidth > 1199) {
        sidebarClientWidth = sidebar.clientWidth - 30 + 'px'
        sidebarOffsetLeft = sidebar.offsetLeft + 60 + 'px';
      } else {
        sidebarClientWidth = sidebar.clientWidth - 20 + 'px'
        sidebarOffsetLeft = sidebar.offsetLeft + (currentWidth - containerMain.clientWidth) / 2 + 'px';
      }
      window.addEventListener('resize', function (event) {
        currentWidth = window.innerWidth;
        if (currentWidth >= 1400) {
          sidebarOffsetLeft = sidebar.offsetLeft + 5 + (currentWidth - containerMain.clientWidth) / 2 + 'px';
          sidebarClientWidth = sidebar.clientWidth - 30 + 'px'
        } else if (currentWidth > 1199) {
          sidebarClientWidth = sidebar.clientWidth - 30 + 'px'
          sidebarOffsetLeft = sidebar.offsetLeft + 60 + 'px';
        } else {
          sidebarClientWidth = sidebar.clientWidth - 20 + 'px'
          sidebarOffsetLeft = sidebar.offsetLeft + (currentWidth - containerMain.clientWidth) / 2 + 'px';
        }
        sidebarNav.style.maxWidth = "";
        sidebarNav.style.left = "";
        sidebarNav.style.maxWidth = sidebarClientWidth;
        sidebarNav.style.left = sidebarOffsetLeft;
      });
      sidebarNav.style.left = sidebarOffsetLeft;
      sidebarNav.style.maxWidth = sidebarClientWidth;

      if (currentWidth < 992) {
        let ev = 'click';
        if ('ontouchstart' in window) { ev = 'touchstart'; };
        sidebarNavTitle.nextElementSibling.addEventListener(ev, function (e) {
          e.stopPropagation();
        }, true);
        document.body.addEventListener(ev, function (event) {
          if (event.target === sidebarNavTitle) {
            sidebarNavTitle.classList.toggle('active');
          } else {
            sidebarNavTitle.classList.remove('active');
          }
        }, false);
        (currentWidth < 768) ? containerMainOffset = containerMain.offsetTop - 60 : containerMainOffset = containerMain.offsetTop - 40;
      } else {
        containerMainOffset = containerMain.offsetTop + 30;
      }

      // get top position of each headline
      anchorHeadline.forEach(function (item, index, arr) {
        let heightVal;
        if (index === anchorHeadline.length - 1) {
          heightVal = window.pageYOffset - headerHeight + arr[index].getBoundingClientRect().top
        } else {
          heightVal = window.pageYOffset - headerHeight + arr[index].getBoundingClientRect().top
        }

        heightArr.push(parseInt(heightVal, 10))
      })

      if (isSingleContainer) {
        containerNextHeight = containerMain.nextElementSibling.clientHeight
        if (currentWidth >= 1400) {
          compensationValue = window.innerHeight - (containerNextHeight + footertHeight);
        } else {
          compensationValue = window.innerHeight - (containerNextHeight + 60 + footertHeight);
        }
      } else {
        if (currentWidth >= 1400) {
          compensationValue = window.innerHeight - footertHeight;
        } else {
          compensationValue = window.innerHeight - (60 + footertHeight);
        }
      }

      setTimeout(function () {
        footertOffset = document.querySelector('footer').offsetTop - footertHeight
      }, 500);

      // on scroll
      window.addEventListener('scroll', function () {
        let containerMainBoundary = containerMain.getBoundingClientRect()
        scrollY = window.pageYOffset;
        
        // if (scrollY > containerMainOffset) {
        if (containerMainBoundary.top < 130) {
          containerMain.classList.add('is-fixed')
        } else {
          containerMain.classList.remove('is-fixed')
        }

        if (window.innerHeight < 1600) {
          if (scrollY + sidebarHeight > footertOffset) {
            containerMain.classList.add('is-colapsed')
          } else {
            containerMain.classList.remove('is-colapsed')
            sidebarNavTitle.classList.remove('is-active')
          }
        }

        // eslint-disable-next-line
        let currentHeadline = null
        let currentIndex = 0

        if (isSingleContainer) {
          // set current index
          heightArr.forEach((val, index) => {
            if (scrollY >= val-100) {
              currentHeadline = anchorHeadline[index]
              currentIndex = index
            }
          })

          // let containerMainBoundary = containerMain.getBoundingClientRect()
          // let endOfContainerMain = (containerMainBoundary.top + containerMainBoundary.height + scrollY) - compensationValue

          anchorHeadline.forEach(function (el, index) {
            if (index === currentIndex) {
              // mark active link
              let oldLink = document.querySelector(".scroll-active")
              if (oldLink !== null) {
                oldLink.classList.remove("scroll-active", "reading")
                oldLink.className = ""
              }

              if (scrollY + 100 >= heightArr[0]) {
                if (scrollY + window.innerHeight < footertOffset) {
                  sidebarNavLinks[anchorHeadline.length - 1].className = ""
                }
                sidebarNavLinks[currentIndex].classList.remove('previous');
                sidebarNavLinks[currentIndex].className = "scroll-active reading";
              }
              if (scrollY === 0) {
                sidebarNavLinks[0].className = ""
              }
            }
          })
          if (scrollY + window.innerHeight > footertOffset) {
            sidebarNavLinks[anchorHeadline.length - 1].className = "scroll-active reading"
          }
        } else {
          heightArr.forEach((val, index) => {
            if (scrollY >= val) {
              currentIndex = index
            }
          })
          let endOfContainerMain = (containerMainBoundary.top + containerMainBoundary.height + scrollY) - compensationValue

          anchorHeadline.forEach(function (_el, index) {

            if (index === currentIndex) {
              // mark active link
              let oldLink = document.querySelector(".scroll-active")
              if (oldLink !== null) {
                oldLink.classList.remove("scroll-active")
                oldLink.className = ""
              }

              if (scrollY + 100 >= heightArr[0] && scrollY <= endOfContainerMain) {
                sidebarNavLinks[currentIndex].className = "scroll-active"
              }
              if (scrollY === 0) {
                sidebarNavLinks[0].className = ""
              }
            }
          })
        }
      });

      window.addEventListener("orientationchange", function () {
        if (window.orientation !== undefined) {
          sidebar.removeAttribute("style");
          window.setTimeout(function () {
            if (isSingleContainer) {
              if (window.screen.width >= 1400) {
                compensationValue = window.innerHeight - (containerNextHeight + footertHeight);
              } else {
                compensationValue = window.innerHeight - (containerNextHeight + 60 + footertHeight);
              }
            } else {
              if (window.screen.width >= 1400) {
                compensationValue = window.innerHeight - footertHeight;
              } else {
                compensationValue = window.innerHeight - (60 + footertHeight);
              }
            }

            if (window.screen.width < 992) {
              isTouch = true
              sidebarWidth = containerMain.clientWidth;
            } else {
              isTouch = false
              sidebarWidth = sidebar.clientWidth;
              containerMainOffset = containerMain.offsetTop + 30;
            }
            sidebar.style.maxWidth = sidebarWidth + 'px';
            sidebar.style.right = containerMain.offsetLeft - 5 + 'px';
          }, 400);
        }
      }, false);

      if (isTouch) {
        let ev = 'click';
        if ('ontouchstart' in window) { ev = 'touchstart'; };
        containerMainOffset = containerMain.offsetTop + 20;
        sidebarNavTitle.nextElementSibling.addEventListener(ev, function (e) {
          e.stopPropagation();
        }, true);
        document.body.addEventListener(ev, function (event) {
          if (event.target === sidebarNavTitle) {
            sidebarNavTitle.classList.toggle('active');
          } else {
            sidebarNavTitle.classList.remove('active');
          }
        }, false);
      } else {
        if (isSingleContainer) {
          let ev = 'click';
          if ('ontouchstart' in window) { ev = 'touchstart'; };
          document.body.addEventListener(ev, function (event) {
            if (event.target === sidebarNavTitle) {
              sidebarNavTitle.classList.toggle('is-active');
            } else {
              sidebarNavTitle.classList.remove('is-active');
            }
          }, false);
        }
      }
    }
  }
}
