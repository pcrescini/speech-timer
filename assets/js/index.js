document.addEventListener("DOMContentLoaded", () => {
  const documentBody = document.querySelector("body");
  const overlay = document.querySelector("#overlay");
  const hamburgerMenu = document.querySelector(".nav__menu--button");

  hamburgerMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("menu clicked");
    documentBody.classList.toggle("nav-open");
    overlay.classList.toggle("blur");
  });

  documentBody.addEventListener("click", () => {
    if (documentBody.classList.contains("nav-open")) {
      documentBody.classList.remove("nav-open");
      overlay.classList.remove("blur");
    }
  });

  let lastKnownScrollPosition = 0;
  let ticking = false;

  document.addEventListener("scroll", (event) => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkScrollPosition(lastKnownScrollPosition);
        ticking = false;
      });
      ticking = true;
    }

    AOS.init();
  });

  const footerCopyright = document.querySelector('#copyright-year');
  const dateObj = new Date();
  const currentYear = dateObj.getFullYear();

  footerCopyright.innerHTML = `${currentYear}`;
});

function checkScrollPosition(scrollPosition) {
  if (scrollPosition <= 0) {
    document.querySelector("header").classList.remove("scrolled");
    document.querySelector(".scrolltop").classList.remove("reveal");
  } else {
    document.querySelector("header").classList.add("scrolled");
    document.querySelector(".scrolltop").classList.add("reveal");
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
}
