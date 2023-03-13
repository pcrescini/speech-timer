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
  });
});

function checkScrollPosition(scrollPosition) {
  const headerHeight = document.querySelector("header").offsetHeight;
  console.log("header height " + headerHeight);
  console.log(scrollPosition);

  if (scrollPosition < headerHeight / 3) {
    document.querySelector("header").classList.remove("scroll");
    document.querySelector(".scrolltop").classList.remove("reveal");
  } else {
    document.querySelector("header").classList.add("scroll");
    document.querySelector(".scrolltop").classList.add("reveal");
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
}
