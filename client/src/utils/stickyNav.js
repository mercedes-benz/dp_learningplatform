export default (fetching) => {
  if (!fetching) {
    if (document.querySelector('.nav-black') === null) {
      return null;
    }
    let themeNav = document.querySelector('.nav-black');
    let scrollY;
    let headerHeight;
    if (window.screen.width >= 1200) {
      headerHeight = 125;
    } else if (window.screen.width >= 992) {
      headerHeight = 100;
    } else if (window.screen.width >= 769) {
      headerHeight = 95;
    }
    else {
      headerHeight = 80;
    }
    window.addEventListener('scroll', function () {
      scrollY = window.pageYOffset;
      if (scrollY > headerHeight + 70) {
        themeNav.classList.add('is-fixed')
      }
      if (scrollY < headerHeight + 5) {
        themeNav.classList.remove('is-fixed')
      }
    });
  } 
}